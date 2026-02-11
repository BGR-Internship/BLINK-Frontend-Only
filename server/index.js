import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs'; // For checking real passwords
import pool from './db.js';    // Import our new database connection

const app = express();
const PORT = process.env.PORT || 3000;

// --- FOLDER SETUP ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'db.json');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// Initialize JSON DB (For Banners/Popups only - since they aren't in Siska DB)
if (!fs.existsSync(dbFile)) {
    const initialData = {
        banners: [],
        popups: [],
        settings: { popup_active: true },
        documents: []
    };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
}

// --- HELPERS ---
function readJsonDb() {
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function writeJsonDb(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// --- MULTER SETUP ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// ==========================================
// 🚀 REAL DATABASE ROUTES (LOGIN)
// ==========================================

app.post('/login', async (req, res) => {
    const { nik, password } = req.body;

    console.log(`🔐 Login attempt for NIK: ${nik}`);

    try {
        // 1. Check if user exists in tbl_user
        const [rows] = await pool.query('SELECT * FROM tbl_user WHERE nik = ?', [nik]);

        if (rows.length === 0) {
            console.log("❌ User not found");
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const user = rows[0];

        // 2. Check Password (using bcrypt because your DB passwords start with $2y$)
        // If the DB password is NOT hashed (plain text), this will fail, so we handle both.
        let isMatch = false;
        
        if (user.user_pass && user.user_pass.startsWith('$2')) {
            // It is hashed
            isMatch = await bcrypt.compare(password, user.user_pass);
        } else {
            // Fallback for plain text (just in case)
            isMatch = (password === user.user_pass);
        }

        if (!isMatch) {
            console.log("❌ Wrong password");
            return res.status(401).json({ message: "Password salah" });
        }

        // 3. Login Success
        console.log("✅ Login Success:", user.id_user);
        
        // Return data matching your frontend expectations
        // We map 'id_user' to 'name' or similar for display purposes
        res.json({
            message: 'Login successful',
            token: 'fake-jwt-token-' + Date.now(), // We can add real JWT later
            user: {
                id: user.id_user,
                nik: user.nik,
                role: user.id_usr_role === 1 ? 'super_admin' : (user.id_usr_role === 2 ? 'user' : 'admin'), // Mapping role ID
                division: 'General' // You can fetch this from other tables if needed
            }
        });

    } catch (error) {
        console.error("🔥 Database Error:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
});


// ==========================================
// 📂 JSON DB ROUTES (CMS CONTENT)
// ==========================================

// 1. BANNER
app.get('/api/banner', (req, res) => {
    const db = readJsonDb();
    res.json(db.banners);
});

app.post('/api/banner', upload.single('image'), (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        let finalImagePath = imageUrl;
        if (req.file) {
            finalImagePath = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        }
        const db = readJsonDb();
        const newBanner = {
            id: Date.now().toString(),
            title: title || '',
            description: description || '',
            image_path: finalImagePath,
            created_at: new Date().toISOString()
        };
        db.banners.push(newBanner);
        writeJsonDb(db);
        res.json({ success: true, ...newBanner });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/banner/:id', (req, res) => {
    const db = readJsonDb();
    const initialLen = db.banners.length;
    db.banners = db.banners.filter(b => b.id !== req.params.id);
    if (db.banners.length === initialLen) return res.status(404).json({ error: "Not found" });
    writeJsonDb(db);
    res.json({ success: true });
});

// 2. POPUPS
app.get('/api/popups', (req, res) => {
    const db = readJsonDb();
    res.json(db.popups);
});

app.post('/api/popups', upload.single('image'), (req, res) => {
    try {
        const { imageUrl } = req.body;
        let finalImagePath = imageUrl;
        if (req.file) {
            finalImagePath = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        }
        const db = readJsonDb();
        const newPopup = {
            id: Date.now().toString(),
            image_path: finalImagePath,
            created_at: new Date().toISOString()
        };
        db.popups.push(newPopup);
        writeJsonDb(db);
        res.json({ success: true, ...newPopup });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/popups/:id', (req, res) => {
    const db = readJsonDb();
    db.popups = db.popups.filter(p => p.id !== req.params.id);
    writeJsonDb(db);
    res.json({ success: true });
});

// 3. SETTINGS
app.get('/api/settings', (req, res) => {
    const db = readJsonDb();
    res.json(db.settings);
});

app.post('/api/settings', (req, res) => {
    const db = readJsonDb();
    const { popup_active } = req.body;
    db.settings.popup_active = popup_active;
    writeJsonDb(db);
    res.json({ success: true });
});

// 4. DOCUMENTS
app.get('/api/documents', (req, res) => {
    const db = readJsonDb();
    res.json(db.documents);
});

app.post('/api/documents', upload.single('file'), (req, res) => {
    const { title, division, classification } = req.body;
    const db = readJsonDb();
    const newDoc = {
        id: Date.now().toString(),
        title,
        division,
        classification,
        type: 'SKD',
        date: new Date().toISOString().split('T')[0],
        fileUrl: req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : '#',
        isActive: true
    };
    db.documents.push(newDoc);
    writeJsonDb(db);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});