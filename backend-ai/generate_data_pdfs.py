from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
import os

# Define paths
base_dir = r"c:\Users\Katana\Documents\Kerja Praktik\RAG_3\backend-ai\data"

def create_pdf(file_path, elements):
    doc = SimpleDocTemplate(file_path, pagesize=A4)
    doc.build(elements)
    print(f"Created {file_path}")

def get_header_style():
    styles = getSampleStyleSheet()
    header_style = styles['Heading1']
    header_style.alignment = 1 # Center
    return header_style

def get_sub_header_style():
    styles = getSampleStyleSheet()
    return styles['Heading2']

def get_normal_style():
    styles = getSampleStyleSheet()
    return styles['Normal']

def generate_saham():
    path = os.path.join(base_dir, "Finance", "Public", "data_saham.pdf")
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    elements.append(Paragraph("Laporan Kinerja Saham Tahunan - PT. Nusantara Teknologi Tbk", styles['Heading1']))
    elements.append(Spacer(1, 0.2*inch))
    
    # Metadata
    meta = [
        "<b>Tanggal Laporan:</b> 9 Januari 2026",
        "<b>Kode Saham:</b> NUTECH",
        "<b>Sektor:</b> Teknologi & AI Solutions",
        "<b>Periode:</b> Q4 2025"
    ]
    for m in meta:
        elements.append(Paragraph(m, styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    # 1. Executive Summary
    elements.append(Paragraph("1. Ringkasan Eksekutif", styles['Heading2']))
    elements.append(Paragraph("PT. Nusantara Teknologi Tbk (NUTECH) menutup tahun fiskal 2025 dengan kinerja yang solid, didorong oleh adopsi massal solusi AI generatif di pasar Asia Tenggara. Harga saham mencatatkan kenaikan sebesar 28% Year-on-Year (YoY), mengungguli indeks komposit sektor teknologi (IDX-TECH).", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    # 2. Key Metrics Table
    elements.append(Paragraph("2. Metrik Kunci Keuangan (Dalam Miliar Rupiah)", styles['Heading2']))
    data = [
        ["Indikator", "Q4 2025", "Q4 2024", "Pertumbuhan (YoY)"],
        ["Pendapatan", "Rp 1.250", "Rp 980", "+27.5%"],
        ["Laba Bersih", "Rp 320", "Rp 210", "+52.3%"],
        ["EPS (Earning Per Share)", "Rp 125", "Rp 82", "+52.4%"],
        ["EBITDA", "Rp 450", "Rp 300", "+50.0%"]
    ]
    t = Table(data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.2*inch))
    
    # 3. Stock Analysis
    elements.append(Paragraph("3. Analisis Pergerakan Saham", styles['Heading2']))
    points = [
        "<b>Harga Pembukaan (Jan 2025):</b> Rp 2.450",
        "<b>Harga Penutupan (Des 2025):</b> Rp 3.150",
        "<b>Tertinggi 52 Minggu:</b> Rp 3.400 (Dicapai pada peluncuran produk 'NusantaraGPT')",
        "<b>Terendah 52 Minggu:</b> Rp 2.300",
        "<b>Volume Rata-rata Harian:</b> 15.4 Juta lembar"
    ]
    for p in points:
        elements.append(Paragraph(f"- {p}", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))

    # 4. Dividen
    elements.append(Paragraph("4. Dividen", styles['Heading2']))
    elements.append(Paragraph("Berdasarkan Rapat Umum Pemegang Saham (RUPS) terakhir, perusahaan sepakat membagikan dividen tunai sebesar Rp 45 per lembar saham, dengan payout ratio sebesar 35% dari laba bersih.", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    # 5. Outlook
    elements.append(Paragraph("5. Prospek 2026", styles['Heading2']))
    elements.append(Paragraph("Manajemen menargetkan pertumbuhan pendapatan sebesar 20-25% di tahun 2026 dengan fokus ekspansi ke pasar infrastruktur cloud dan keamanan siber.", styles['Normal']))

    create_pdf(path, elements)

def generate_gaji_staff():
    path = os.path.join(base_dir, "Finance", "Secret", "gaji_staff.pdf")
    elements = []
    styles = getSampleStyleSheet()
    
    elements.append(Paragraph("CONFIDENTIAL: Struktur Gaji Staff - PT. Nusantara Teknologi Tbk", styles['Heading1']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("<b>Dokumen Rahasia (INTERNAL ONLY)</b><br/>Departemen: Finance & HR<br/>Revisi: Januari 2026", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Himbauan Kerahasiaan", styles['Heading2']))
    elements.append(Paragraph("Dokumen ini mengandung informasi sensitif mengenai kompensasi dan benefit karyawan level Staff hingga Senior. Dilarang keras menyebarluaskan, mencetak, atau membagikan dokumen ini kepada pihak yang tidak berkepentingan tanpa izin tertulis dari HR Director.", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("1. Grade Salary Structure (Gross Monthly in IDR)", styles['Heading2']))
    data = [
        ["Grade", "Posisi", "Range Gaji Minimum", "Range Gaji Maksimum", "Tunjangan Tetap"],
        ["ST-1", "Junior Staff / Admin", "Rp 6.500.000", "Rp 8.500.000", "Uang Makan & Transport"],
        ["ST-2", "Staff / Officer", "Rp 8.500.000", "Rp 12.000.000", "Uang Makan, Transport, Pulsa"],
        ["ST-3", "Senior Staff / Specialist", "Rp 12.000.000", "Rp 18.000.000", "Uang Makan, Transport, Kesehatan+"],
        ["SP-1", "Supervisor / Lead", "Rp 18.000.000", "Rp 25.000.000", "Full Allowance Package"]
    ]
    t = Table(data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.aliceblue),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("2. Komponen Tunjangan (Variable)", styles['Heading2']))
    items = [
        "<b>Tunjangan Kehadiran:</b> Rp 50.000 / hari kehadiran (untuk Grade ST-1 dan ST-2).",
        "<b>Lembur (Overtime):</b> Dihitung sesuai peraturan Depnaker untuk staff non-management.",
        "<b>Bonus Tahunan:</b> Berdasarkan performa individu (KPI) dan performa perusahaan, rata-rata 1-3x gaji bulanan."
    ]
    for i in items:
        elements.append(Paragraph(f"{i}", styles['Normal'], bulletText="-"))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("3. Daftar Gaji Sampel (Anonymized)", styles['Heading2']))
    samples = [
        "<b>ID 1024 (Backend Dev - ST-2):</b> Rp 11.500.000",
        "<b>ID 1055 (UI/UX Designer - ST-3):</b> Rp 14.200.000",
        "<b>ID 1089 (Data Analyst - ST-2):</b> Rp 10.800.000"
    ]
    for s in samples:
        elements.append(Paragraph(f"- {s}", styles['Normal']))

    create_pdf(path, elements)

def generate_cuti():
    path = os.path.join(base_dir, "Human_Resources", "Public", "jadwal_cuti.pdf")
    elements = []
    styles = getSampleStyleSheet()
    
    elements.append(Paragraph("Kebijakan & Jadwal Cuti Perusahaan 2026", styles['Heading1']))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph("PT. Nusantara Teknologi Tbk", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("<b>Departemen:</b> Human Resources<br/><b>Status:</b> Public (Seluruh Karyawan)<br/><b>Berlaku:</b> 1 Januari 2026 - 31 Desember 2026", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("1. Jatah Cuti Tahunan", styles['Heading2']))
    leaves = [
        "<b>Masa kerja < 2 tahun:</b> 12 hari kerja per tahun.",
        "<b>Masa kerja 2 - 5 tahun:</b> 15 hari kerja per tahun.",
        "<b>Masa kerja > 5 tahun:</b> 18 hari kerja per tahun."
    ]
    for l in leaves:
        elements.append(Paragraph(f"- {l}", styles['Normal']))
    elements.append(Paragraph("<i>*Sisa cuti yang tidak diambil dapat diuangkan (cash-out) maksimal 5 hari pada akhir tahun buku.</i>", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("2. Cuti Bersama 2026 (Wajib)", styles['Heading2']))
    data = [
        ["Tanggal", "Hari", "Keterangan"],
        ["17-18 Februari", "Selasa-Rabu", "Tahun Baru Imlek 2577 Kongzili"],
        ["19-24 Mei", "Selasa-Minggu", "Hari Raya Idul Fitri 1447 H"],
        ["26 Desember", "Sabtu", "Hari Raya Natal"]
    ]
    t = Table(data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.green),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("3. Jenis Cuti Lainnya (Paid Leave)", styles['Heading2']))
    others = [
        "Menikah: 3 hari kerja.",
        "Menikahkan Anak: 2 hari kerja.",
        "Khitanan/Baptis Anak: 2 hari kerja.",
        "Istri Melahirkan: 2 hari kerja.",
        "Keluarga Inti Meninggal: 2 hari kerja.",
        "Maternity Leave: 3 Bulan."
    ]
    for o in others:
        elements.append(Paragraph(f"- {o}", styles['Normal']))
        
    create_pdf(path, elements)

def generate_gaji_direktur():
    path = os.path.join(base_dir, "Human_Resources", "Secret", "gaji_direktur.pdf")
    elements = []
    styles = getSampleStyleSheet()
    
    elements.append(Paragraph("STRICTLY CONFIDENTIAL: Paket Kompensasi Eksekutif", styles['Heading1']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("<b>Klasifikasi: SANGAT RAHASIA</b>", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Peringatan Keras", styles['Heading2']))
    elements.append(Paragraph("Dokumen ini memuat data remunerasi level C-Suite. Akses terbatas hanya untuk Komisaris, CEO, dan VP Human Capital. Pelanggaran dikenakan sanksi berat.", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("1. Kompensasi Dasar Direksi", styles['Heading2']))
    data = [
        ["Posisi", "Base Salary (IDR)", "Transport", "Housing"],
        ["CEO", "Rp 185.000.000", "Alphard + Driver", "Rp 45.000.000"],
        ["CTO", "Rp 165.000.000", "Pajero Sport + Driver", "Rp 35.000.000"],
        ["CFO", "Rp 160.000.000", "Pajero Sport + Driver", "Rp 35.000.000"],
        ["COO", "Rp 155.000.000", "Fortuner + Driver", "Rp 30.000.000"],
        ["VP HR", "Rp 120.000.000", "CR-V Turbo", "Rp 25.000.000"]
    ]
    t = Table(data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkred),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.gold),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("2. Insentif Jangka Panjang (LTI)", styles['Heading2']))
    elements.append(Paragraph("- Stock Options (ESOP): CEO 0.5%, C-Level 0.2% per tahun.", styles['Normal']))
    elements.append(Paragraph("- Performance Bonus: 6x - 12x gaji bulanan.", styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("3. Fasilitas Tambahan", styles['Heading2']))
    perks = [
        "Asuransi Kesehatan VVIP (Platinum)",
        "Membership Golf / Club (Limit 100jt/thn)",
        "Dana Representasi (50jt/bln)",
        "Cuti Eksekutif (25 hari + Tiket First Class)"
    ]
    for p in perks:
        elements.append(Paragraph(f"- {p}", styles['Normal']))

    create_pdf(path, elements)

if __name__ == "__main__":
    generate_saham()
    generate_gaji_staff()
    generate_cuti()
    generate_gaji_direktur()
