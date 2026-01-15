-- Create Database
CREATE DATABASE IF NOT EXISTS db_blink;
USE db_blink;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nik VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'User',
    division VARCHAR(100),
    join_date VARCHAR(50), -- Storing as string for simplicity like 'Jan 2023', or use DATE
    location VARCHAR(100),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Services (Bento Grid) Table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) NOT NULL, -- Name of the Lucide icon
    color_class VARCHAR(100), -- Tailwind classes for color
    link_url VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Configuration Table
-- Using a key-value pair approach for flexibility
CREATE TABLE IF NOT EXISTS site_config (
    config_key VARCHAR(50) PRIMARY KEY,
    config_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Popup Images Table (One-to-Many relationship with config logically, but simple standalone table works)
CREATE TABLE IF NOT EXISTS popup_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Initial Data)
INSERT INTO users (nik, full_name, email, role, division, join_date, location, bio) VALUES 
('12345678', 'Demo User', 'demo@bgrlogistics.id', 'Frontend Developer', 'IT Development', 'Jan 2023', 'Jakarta HQ', 'Passionate about building beautiful and functional user interfaces.');

INSERT INTO services (title, description, icon, color_class, link_url, sort_order) VALUES 
('VINA', 'Visitor integrated and administration', 'Truck', 'bg-blue-100 text-blue-600', 'https://carolina.bgrlogistik.id/', 1),
('RAISA', 'Recruitment Internal Assessment Application', 'Users', 'bg-emerald-100 text-emerald-600', 'https://amanda.bgrlogistik.id/', 2),
('SISKA', 'Sistem Informasi Kepegawaian', 'Fingerprint', 'bg-indigo-100 text-indigo-600', 'https://siska.bgrlogistik.id/', 3),
('MADONA', 'Manajemen Dokumen Pembayaran Nasional', 'CreditCard', 'bg-purple-100 text-purple-600', 'https://wina.bgrlogistik.id/', 4),
('MONALISA', 'Monitoring, Asset, Lisense Application', 'Key', 'bg-sky-100 text-sky-600', 'https://monalisa.bgrlogistik.id/', 5),
('DENADA', 'Depo Manajemen dan Agency', 'Container', 'bg-orange-100 text-orange-600', 'https://helpdesk.bgrlogistik.id/?c=7', 6);

INSERT INTO site_config (config_key, config_value, description) VALUES
('bannerTitle', 'Unified Enterprise Portal', 'Main title on the dashboard hero section'),
('bannerSubtitle', 'Akses semua aplikasi dan layanan perusahaan dalam satu pintu. Tingkatkan produktivitas dengan integrasi tanpa batas.', 'Subtitle on the dashboard hero section'),
('bannerImage', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200', 'Background image for hero section'),
('popupActive', 'true', 'Whether the campaign popup is active (true/false)'),
('popupTitle', 'Pengumuman Penting', 'Title of the popup modal');
