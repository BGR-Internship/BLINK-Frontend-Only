const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pdf = require('pdf-parse'); // Kept for RAG (future use)

const app = express();
const PORT = 3000; // Changed to 3000 as requested

// --- FOLDER SETUP ---
const uploadDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'db.json');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// Initialize JSON DB if not exists
if (!fs.existsSync(dbFile)) {
    const initialData = {
        banners: [],
        popups: [],
        settings: { popup_active: true },
        documents: [
            { id: '1', title: 'Q1 Financial Report', type: 'SKD', division: 'Finance', classification: 'Private', date: '2024-03-01', fileUrl: '#', isActive: true },
            { id: '2', title: 'Employee Handbook 2024', type: 'SOP', division: 'HR', classification: 'Public', date: '2024-01-15', fileUrl: '#', isActive: true },
        ]
    };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
}

// --- HELPERS ---
function readDb() {
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

function writeDb(data) {
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


// --- API ROUTES ---

// 1. BANNER CRUD
app.get('/api/banner', (req, res) => {
    const db = readDb();
    res.json(db.banners);
});

app.post('/api/banner', upload.single('image'), (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;
        let finalImagePath = imageUrl;
        if (req.file) {
            finalImagePath = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        }

        if (!finalImagePath) return res.status(400).json({ error: "Image required" });

        const db = readDb();
        const newBanner = {
            id: Date.now().toString(),
            title: title || '',
            description: description || '',
            image_path: finalImagePath,
            created_at: new Date().toISOString()
        };

        db.banners.push(newBanner);
        writeDb(db);

        res.json({ success: true, ...newBanner });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/banner/:id', (req, res) => {
    const db = readDb();
    const initialLen = db.banners.length;
    db.banners = db.banners.filter(b => b.id !== req.params.id);

    if (db.banners.length === initialLen) return res.status(404).json({ error: "Not found" });

    writeDb(db);
    res.json({ success: true });
});


// 2. POPUPS CRUD
app.get('/api/popups', (req, res) => {
    const db = readDb();
    res.json(db.popups);
});

app.post('/api/popups', upload.single('image'), (req, res) => {
    try {
        const { imageUrl } = req.body;
        let finalImagePath = imageUrl;
        if (req.file) {
            finalImagePath = `http://localhost:${PORT}/uploads/${req.file.filename}`;
        }

        if (!finalImagePath) return res.status(400).json({ error: "Image required" });

        const db = readDb();
        const newPopup = {
            id: Date.now().toString(),
            image_path: finalImagePath,
            created_at: new Date().toISOString()
        };

        db.popups.push(newPopup);
        writeDb(db);

        res.json({ success: true, ...newPopup });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/popups/:id', (req, res) => {
    const db = readDb();
    db.popups = db.popups.filter(p => p.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
});


// 3. SETTINGS
app.get('/api/settings', (req, res) => {
    const db = readDb();
    res.json(db.settings);
});

app.post('/api/settings', (req, res) => {
    const db = readDb();
    const { popup_active } = req.body;
    db.settings.popup_active = popup_active; // Stores boolean directly or string if passed
    writeDb(db);
    res.json({ success: true });
});


// 4. DOCUMENTS (Served from JSON now)
app.get('/api/documents', (req, res) => {
    const db = readDb();
    res.json(db.documents);
});

app.post('/api/documents', upload.single('file'), (req, res) => {
    // Simple mock implementation for adding doc to JSON
    const { title, division, classification } = req.body;
    const db = readDb();
    const newDoc = {
        id: Date.now().toString(),
        title,
        division,
        classification,
        type: 'SKD', // Default or logic
        date: new Date().toISOString().split('T')[0],
        fileUrl: req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : '#',
        isActive: true
    };
    db.documents.push(newDoc);
    writeDb(db);
    res.json({ success: true });
});

app.post('/api/documents/toggle', (req, res) => {
    const { id, is_active } = req.body;
    const db = readDb();
    const doc = db.documents.find(d => d.id === String(id));
    if (doc) {
        doc.isActive = is_active;
        writeDb(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Not found" });
    }
});


// 5. LOGIN (Mock - removed DB)
app.post('/api/login', (req, res) => {
    // Determine admin status based on credentials (simple mock)
    // Accept ANY login for now, but NIK 'admin' gets admin role
    const { nik } = req.body;
    const role = nik === 'admin' ? 'Admin' : 'User';

    res.json({
        message: 'Login successful (Local Mode)',
        token: 'mock-token-' + Date.now(),
        user: { nik, role, id: nik }
    });
});


// 6. CHATBOT (LM Studio Proxy)
const LM_STUDIO_API_BASE = 'http://127.0.0.1:1234/v1';

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        // Simple proxy to LM Studio
        const response = await axios.post(`${LM_STUDIO_API_BASE}/chat/completions`, {
            model: "local-model",
            messages: [
                { role: "system", content: "You are a helpful assistant. Answer in Bahasa Indonesia." },
                { role: "user", content: message }
            ],
            temperature: 0.7
        });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Chatbot Error:", error.message);
        res.status(503).json({ error: "LM Studio unavailable. Is it running on port 1234?" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data Storage: ${dbFile}`);
    console.log(`Uploads: ${uploadDir}`);
});
