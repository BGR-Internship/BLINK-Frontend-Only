const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { spawn } = require('child_process');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = 5000;

// Database Connection Pool
// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(cors());
app.use(express.json());

// --- RAG (Retrieval Augmented Generation) SETUP ---
let knowledgeBase = [];

async function loadPDFs() {
    const pdfDir = path.join(__dirname, '../src/assets/pdf');
    const files = ['002_Surat Undangan Foto Nawasena.pdf', '13.1.13 Pembangunan Sistem Informasi.pdf'];

    console.log('Loading PDFs for RAG...');

    for (const fileName of files) {
        const filePath = path.join(pdfDir, fileName);
        if (fs.existsSync(filePath)) {
            try {
                console.log(`Processing ${fileName}...`);
                const dataBuffer = fs.readFileSync(filePath);

                // 1. Try standard text extraction
                let data = await pdf(dataBuffer);
                let text = data.text;

                // 2. If text is likely scanned (< 100 chars), use Python OCR Service
                if (text.trim().length < 100) {
                    console.log(`[OCR] ${fileName} seems to be scanned. Starting PaddleOCR Service...`);

                    text = await new Promise((resolve, reject) => {
                        // BEST PRACTICE: Use absolute path for the script to ensure it works from any CWD
                        const pythonScriptPath = path.join(__dirname, 'ocr_service.py');
                        const pythonProcess = spawn('python', [pythonScriptPath, filePath]);
                        let outputData = "";
                        let errorData = "";

                        pythonProcess.stdout.on('data', (data) => {
                            outputData += data.toString();
                        });

                        pythonProcess.stderr.on('data', (data) => {
                            errorData += data.toString();
                            // Optional: pipe stderr to console to see progress
                            process.stdout.write(`[Python] ${data.toString()}`);
                        });

                        pythonProcess.on('close', (code) => {
                            if (code !== 0) {
                                console.error(`[OCR] Python script exited with code ${code}`);
                                resolve(" [OCR Failed] ");
                            } else {
                                try {
                                    const result = JSON.parse(outputData);
                                    if (result.status === 'success') {
                                        resolve(result.text);
                                    } else {
                                        console.error('[OCR] Error:', result.message);
                                        resolve(" [OCR Error] ");
                                    }
                                } catch (e) {
                                    console.error('[OCR] Failed to parse JSON output');
                                    resolve(" [OCR Output Invalid] ");
                                }
                            }
                        });
                    });

                    console.log(`[OCR] Finished ${fileName}. Extracted ${text.length} characters.`);
                }

                // Chunking
                const chunks = text.split('\n\n').filter(c => c.trim().length > 50);

                chunks.forEach(chunk => {
                    knowledgeBase.push({
                        text: chunk.trim(),
                        source: fileName
                    });
                });
                console.log(`Loaded ${chunks.length} chunks from ${fileName}`);
            } catch (err) {
                console.error(`Error parsing ${fileName}:`, err.message);
            }
        } else {
            console.warn(`File not found: ${filePath}`);
        }
    }
}

function findRelevantContext(query) {
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 3);
    if (keywords.length === 0) return "";

    // Simple keyword matching score
    const scoredChunks = knowledgeBase.map(item => {
        let score = 0;
        const lowText = item.text.toLowerCase();
        keywords.forEach(word => {
            if (lowText.includes(word)) score++;
        });
        return { ...item, score };
    });

    // Get top 3 chunks with score > 0
    return scoredChunks
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => `[Source: ${item.source}]: ${item.text}`)
        .join('\n\n');
}

// --- API ROUTES ---

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { nik, password } = req.body;
    console.log('Login attempt for NIK:', nik);
    try {
        const [rows] = await pool.query(
            'SELECT id_user, nik, user_pass, id_usr_role FROM tbl_user WHERE nik = ? LIMIT 1',
            [nik]
        );

        if (rows.length > 0) {
            const user = rows[0];
            // Verify password (check bcrypt first, then fallback to plain text)
            const isBcryptValid = await bcrypt.compare(password, user.user_pass);
            const isPlainTextValid = !isBcryptValid && password === user.user_pass;
            const isValid = isBcryptValid || isPlainTextValid;

            if (isValid) {
                console.log(`Login successful for user: ${nik} [${isBcryptValid ? 'Encrypted' : 'Plain Text'}]`);
                const { user_pass, ...userWithoutPass } = user;

                // Generate JWT Token
                const token = jwt.sign(
                    {
                        id: userWithoutPass.id_user,
                        nik: userWithoutPass.nik,
                        role: userWithoutPass.id_usr_role === 1 ? 'Admin' : 'User'
                    },
                    process.env.JWT_SECRET || 'fallback-secret',
                    { expiresIn: '24h' }
                );

                return res.json({
                    message: 'Login successful',
                    token: token,
                    user: {
                        id: userWithoutPass.nik,
                        nik: userWithoutPass.nik,
                        role: userWithoutPass.id_usr_role === 1 ? 'Admin' : 'User'
                    }
                });
            } else {
                console.log('Password invalid');
            }
        } else {
            console.log('User not found');
        }
        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
});

// Services Endpoint
app.get('/api/services', async (req, res) => {
    try {
        // Fallback since we don't know the remote schema for services yet
        res.json([]);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Chatbot Proxy (LM Studio / OpenAI Compatible)
const LM_STUDIO_API_BASE = 'http://127.0.0.1:1234/v1';

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        // 1. Fetch available models to get the correct ID
        const modelsResponse = await axios.get(`${LM_STUDIO_API_BASE}/models`);
        const activeModel = modelsResponse.data.data[0]?.id || "local-model";

        // 2. Find relevant context from PDFs
        const context = findRelevantContext(message);

        // 3. Send chat request with context
        const response = await axios.post(`${LM_STUDIO_API_BASE}/chat/completions`, {
            model: activeModel,
            messages: [
                {
                    role: "system",
                    content: `You are Bila, a helpful, intelligent, and friendly AI assistant for the BLINK employees. You answer in Bahasa Indonesia. 
                    Use the following retrieved context to answer the user's question if relevant. If the context is not relevant, answer normally.
                    
                    ### CONTEXT FROM DOCUMENTS:
                    ${context || "No relevant documents found for this query."}
                    
                    Always stay professional and terse.`
                },
                { role: "user", content: message }
            ],
            temperature: 0.7
        });

        let reply = response.data.choices[0].message.content;

        // Remove <think>...</think> blocks (common in reasoning models like DeepSeek R1)
        reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '');

        // Also remove any stray closing </think> tags and everything before them if the opening tag was missed/streamed out
        // valid response usually follows the LAST closing tag if multiple exist
        if (reply.includes('</think>')) {
            const lastCloseIndex = reply.lastIndexOf('</think>');
            if (lastCloseIndex !== -1) {
                reply = reply.substring(lastCloseIndex + 8);
            }
        }

        reply = reply.trim();

        res.json({ reply: reply });
    } catch (error) {
        console.error('LM Studio Error:', error.message);
        if (error.response) {
            console.error('Data:', error.response.data);
        }
        res.status(503).json({ error: 'Failed to get response from AI (LM Studio). Ensure it is running on port 1234.' });
    }
});

app.listen(PORT, async () => {
    console.log('Server running on http://localhost:' + PORT);
    await loadPDFs();
});
