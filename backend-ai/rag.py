# RAG script with filters
# (Kita sesuaikan filternya)
import os
import sys
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings # Sesuai ingest.py
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

# --- KONFIGURASI ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Menggunakan database_2_vector sesuai struktur baru
DB_PATH = os.path.join(BASE_DIR, "database_2_vector")
# (Optional) Path ke Relational DB jika nanti dibutuhkan untuk validasi user real
RELATIONAL_DB_PATH = os.path.join(BASE_DIR, "database_3_relational", "company.db")

# 1. EMBEDDING (HARUS SAMA DENGAN INGEST.PY)
# Jika beda model, RAG tidak akan menemukan data (hasilnya 0)
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# 2. LLM MODEL (Menggunakan Qwen)
# Menggunakan model Qwen3 8B (Sesuai permintaan)
LLM_MODEL_NAME = "qwen3:8b" 

print(f"⚙️  Loading Model: Embedding='{EMBEDDING_MODEL_NAME}' | LLM='{LLM_MODEL_NAME}'")

# Load Resources
try:
    embedding_function = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
    
    vector_store = Chroma(
        persist_directory=DB_PATH,
        embedding_function=embedding_function,
        collection_name="sop_collection"
    )
    
    llm = ChatOllama(model=LLM_MODEL_NAME, temperature=0) # Temp 0 agar jawaban konsisten/fakta
    
except Exception as e:
    print(f"❌ Error Loading Model: {e}")
    sys.exit(1)

def ask_bot(query, user_division):
    print(f"\n{'='*50}")
    print(f"👤 USER: {user_division} | TANYA: '{query}'")
    
    # --- LOGIKA FILTER SECURITY ---
    # User hanya boleh melihat:
    # 1. Dokumen PUBLIC (milik siapa saja)
    # 2. Dokumen SECRET (hanya milik divisinya sendiri)
    
    filter_rule = {
        "$or": [
            {"access_level": "Public"},
            {
                "$and": [
                    {"access_level": "Secret"},
                    {"division": user_division} # Ingat, ini Case Sensitive sesuai nama folder
                ]
            }
        ]
    }

    # --- RETRIEVAL ---
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 4, # Ambil 4 potongan dokumen teratas
            "filter": filter_rule 
        }
    )
    
    # Cek dokumen yang ditemukan
    retrieved_docs = retriever.invoke(query)
    
    if not retrieved_docs:
        print("🔴 SISTEM: Tidak ada dokumen yang cocok atau Anda tidak punya akses.")
        return "Maaf, saya tidak menemukan informasi tersebut dalam dokumen yang Anda miliki aksesnya."
    
    # Debug: Print sumber dokumen yang dipakai (biar kita tau AI baca dari mana)
    print(f"🟢 SISTEM: Menemukan {len(retrieved_docs)} sumber referensi:")
    for i, doc in enumerate(retrieved_docs):
        src = doc.metadata.get('source_file', 'unknown')
        div = doc.metadata.get('division', 'unknown')
        lvl = doc.metadata.get('access_level', 'unknown')
        print(f"   {i+1}. [{div}-{lvl}] {src}")

    # --- GENERATION (RAG) ---
    # Prompt khusus untuk Qwen agar patuh SOP
    template = """
    <|im_start|>system
    Hai! Saya BILA (BGR Indonesia Live Assistant), asisten virtual Anda. Tugas saya menjawab pertanyaan karyawan berdasarkan SOP perusahaan.
    
    ATURAN MUTLAK:
    1. Jawab HANYA berdasarkan Context di bawah. JANGAN gunakan pengetahuan luarmu.
    2. Jika jawaban tidak ada di Context, katakan: "Maaf, informasi tidak tersedia di SOP."
    3. Jawab dalam Bahasa yang formal, sopan, dan jelas sesuai dengan bahasa yang digunakan pengguna.
    4. Jangan menyebutkan "berdasarkan context", langsung jawab saja intinya.
    <|im_end|>
    
    <|im_start|>user
    Context:
    {context}
    
    Pertanyaan:
    {question}
    <|im_end|>
    <|im_start|>assistant
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    
    def format_docs(docs):
        return "\n\n".join([d.page_content for d in docs])

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
    )
    
    print("🤖 BILA SEDANG MENGETIK...")
    response = chain.invoke(query)
    
    # Qwen kadang suka menyertakan tag <|im_end|>, kita bersihkan jika ada
    clean_response = response.content.replace("<|im_end|>", "").strip()
    
    print(f"💬 JAWABAN: {clean_response}")
    return clean_response

def ask_bot_stream(query, user_division):
    # --- LOGIKA FILTER SECURITY (Sama seperti ask_bot) ---
    filter_rule = {
        "$or": [
            {"access_level": "Public"},
            {
                "$and": [
                    {"access_level": "Secret"},
                    {"division": user_division}
                ]
            }
        ]
    }

    # --- RETRIEVAL ---
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 4, 
            "filter": filter_rule 
        }
    )
    
    # Template Prompt (Sama)
    template = """
    <|im_start|>system
    Hai! Saya BILA (BGR Indonesia Live Assistant), asisten virtual Anda. Tugas saya menjawab pertanyaan karyawan berdasarkan SOP perusahaan.
    
    ATURAN FORMAT JAWABAN (WAJIB MARKDOWN):
    1. Gunakan **Heading** (### Judul) untuk memisahkan bagian jawaban.
    2. Gunakan **List** (1. atau - ) untuk langkah-langkah atau poin penting.
    3. **Tebalkan** kata kunci penting.
    4. Buat paragraf pendek agar mudah dibaca.
    
    ATURAN KONTEN:
    1. Jawab HANYA berdasarkan Context di bawah.
    2. Jika jawaban tidak ada di Context, katakan: "Maaf, informasi tidak tersedia di SOP."
    3. Jawab dalam Bahasa yang formal, profesional, namun tetap ramah.
    <|im_end|>
    
    <|im_start|>user
    Context:
    {context}
    
    Pertanyaan:
    {question}
    <|im_end|>
    <|im_start|>assistant
    """
    
    prompt = ChatPromptTemplate.from_template(template)
    
    def format_docs(docs):
        return "\n\n".join([d.page_content for d in docs])

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
    )
    
    # Gunakan .stream() untuk streaming response
    for chunk in chain.stream(query):
        if hasattr(chunk, 'content'):
            yield chunk.content
        else:
            yield str(chunk)

# --- INTERACTIVE CHATBOT ---
if __name__ == "__main__":
    print("\n🤖 --- BILA (Bot Inovatif Luwes & Andal) --- 🤖")
    print("Halo! Saya BILA, siap membantu Anda. Silakan login user divisi Anda.")
    
    # 1. Login Simulasi (Input Divisi)
    while True:
        user_division = input("🔑 Masukkan Divisi Anda (Finance / Human_Resources / IT): ").strip()
        if user_division in ["Finance", "Human_Resources", "IT"]:
            break
        print("❌ Divisi tidak valid. Harap pilih: Finance, Human_Resources, atau IT.")
    
    print(f"\n✅ Login Berhasil sebagai: {user_division}")
    print("Ketik 'exit' atau 'quit' untuk keluar.\n")

    # 2. Chat Loop
    while True:
        try:
            query = input(f"👤 {user_division} > ").strip()
            
            if not query:
                continue
                
            if query.lower() in ["exit", "quit", "keluar"]:
                print("👋 Sampai jumpa!")
                break
            
            # Panggil fungsi RAG
            ask_bot(query, user_division)
            
        except KeyboardInterrupt:
            print("\n👋 Force Exit detected. Bye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")