# Ingest script to be updated
# (Kita update kode ini)
import os
import shutil
import sqlite3
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings # Library baru
from langchain_chroma import Chroma

# --- KONFIGURASI ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# 1. Database PDF (Raw Files)
DATA_PATH = os.path.join(BASE_DIR, "database_1_pdf")
# 2. Database Vector (Embeddings)
DB_PATH = os.path.join(BASE_DIR, "database_2_vector")
# 3. Database Relational (Metadata & Employee Data)
RELATIONAL_DB_PATH = os.path.join(BASE_DIR, "database_3_relational", "company.db")

# Menggunakan model Sentence Transformer yang ringan tapi performa tinggi
# 'all-MiniLM-L6-v2' adalah standar industri untuk RAG ringan
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

def reset_database():
    """Menghapus database vektor lama agar bersih (Fresh Install)"""
    if os.path.exists(DB_PATH):
        try:
            shutil.rmtree(DB_PATH)
            print(f"🗑️  DATABASE VEKTOR LAMA DIHAPUS: Folder '{DB_PATH}' telah dibersihkan.")
        except Exception as e:
            print(f"⚠️  Gagal menghapus database lama: {e}")

def init_relational_db():
    """Inisialisasi Database Relasional (SQLite)"""
    print("🛠️  Sedang menyiapkan Database Relasional (Metadata & Karyawan)...")
    try:
        conn = sqlite3.connect(RELATIONAL_DB_PATH)
        cursor = conn.cursor()
        
        # Tabel 1: Data Karyawan (Mock Data)
        cursor.execute('''CREATE TABLE IF NOT EXISTS employees
                         (id INTEGER PRIMARY KEY, name TEXT, division TEXT, role TEXT)''')
        
        # Tabel 2: Metadata PDF
        # Reset table jika ingest ulang agar tidak duplikat
        cursor.execute("DROP TABLE IF EXISTS pdf_metadata")
        cursor.execute('''CREATE TABLE pdf_metadata
                         (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                          filename TEXT, 
                          division TEXT, 
                          access_level TEXT, 
                          file_path TEXT,
                          ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        # Isi Dummy Data Karyawan jika kosong
        cursor.execute("SELECT count(*) FROM employees")
        if cursor.fetchone()[0] == 0:
            mock_employees = [
                (101, 'Budi Santoso', 'Finance', 'Manager'),
                (102, 'Siti Aminah', 'Human_Resources', 'Staff'),
                (103, 'Andi Wijaya', 'IT', 'Admin'),
                (104, 'Dewi Sartika', 'Finance', 'Staff')
            ]
            cursor.executemany("INSERT INTO employees VALUES (?,?,?,?)", mock_employees)
            print("   👤 Data Karyawan Semu berhasil ditambahkan.")
        
        conn.commit()
        conn.close()
        print(f"✅ Database Relasional siap di: {RELATIONAL_DB_PATH}")
    except Exception as e:
        print(f"❌ Error init relational db: {e}")

def add_metadata_to_db(filename, division, access_level, file_path):
    """Fungsi helper untuk insert metadata ke SQLite"""
    try:
        conn = sqlite3.connect(RELATIONAL_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO pdf_metadata (filename, division, access_level, file_path) VALUES (?, ?, ?, ?)",
                       (filename, division, access_level, file_path))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"   ⚠️ Gagal menyimpan metadata ke SQL: {e}")

def main():
    # 1. Lakukan Reset Database Dulu
    reset_database()
    init_relational_db()
    
    # 2. Siapkan Embedding Function (Jalan Lokal CPU/GPU)
    print(f"⏳ Memuat model embedding: {MODEL_NAME}...")
    embedding_function = HuggingFaceEmbeddings(model_name=MODEL_NAME)
    
    # List untuk menampung semua chunk
    documents_to_ingest = []
    
    # 3. Scanning Folder (Sesuai Struktur: Divisi -> Akses -> PDF)
    if not os.path.exists(DATA_PATH):
        print(f"❌ Error: Folder '{DATA_PATH}' tidak ditemukan.")
        return

    print("📂 Mulai memindai dokumen...")

    # Loop Level 1: Divisi (Finance, Human_Resources, IT)
    for division_name in os.listdir(DATA_PATH):
        div_path = os.path.join(DATA_PATH, division_name)
        
        if os.path.isdir(div_path):
            # Loop Level 2: Akses (Public, Secret)
            for access_level in os.listdir(div_path):
                acc_path = os.path.join(div_path, access_level)
                
                if os.path.isdir(acc_path):
                    # Normalisasi nama akses agar konsisten (misal: "secret" jadi "Secret")
                    clean_access = access_level.capitalize()
                    
                    # Loop Level 3: File PDF
                    for filename in os.listdir(acc_path):
                        if filename.endswith(".pdf"):
                            file_path = os.path.join(acc_path, filename)
                            print(f"   📄 Memproses: {division_name} / {clean_access} / {filename}")
                            
                            # Insert Metadata ke Relational DB
                            add_metadata_to_db(filename, division_name, clean_access, file_path)

                            try:
                                # A. Load PDF
                                loader = PyPDFLoader(file_path)
                                docs = loader.load()
                                
                                # B. Split Text
                                text_splitter = RecursiveCharacterTextSplitter(
                                    chunk_size=800, # Ukuran per potongan
                                    chunk_overlap=100 # Iritasi agar konteks nyambung
                                )
                                chunks = text_splitter.split_documents(docs)
                                
                                # C. Tambah Metadata (PENTING)
                                for chunk in chunks:
                                    chunk.metadata["division"] = division_name
                                    chunk.metadata["access_level"] = clean_access
                                    chunk.metadata["source_file"] = filename
                                
                                documents_to_ingest.extend(chunks)
                                
                            except Exception as e:
                                print(f"   ❌ Gagal baca file {filename}: {e}")

    # 4. Simpan ke Vector Database
    if documents_to_ingest:
        print(f"\n💾 Sedang menyimpan {len(documents_to_ingest)} potongan teks ke Vector DB...")
        print("   (Proses ini mungkin memakan waktu tergantung jumlah data)...")
        
        Chroma.from_documents(
            documents=documents_to_ingest,
            embedding=embedding_function,
            persist_directory=DB_PATH,
            collection_name="sop_collection"
        )
        print("✅ SUKSES! Database berhasil diperbarui.")
    else:
        print("⚠️  Tidak ada dokumen PDF yang ditemukan untuk diproses.")

if __name__ == "__main__":
    main()