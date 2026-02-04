from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import sys
import os

# Menambahkan path saat ini agar bisa import rag.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import fungsi ask_bot dan ask_bot_stream dari rag.py
try:
    from rag import ask_bot, ask_bot_stream
except ImportError as e:
    print(f"Error importing rag.py: {e}")
    ask_bot = None
    ask_bot_stream = None

app = FastAPI()

# Konfigurasi CORS (Cross-Origin Resource Sharing)
# Penting agar frontend (biasanya port 5173) diizinkan mengakses backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Izinkan semua origin (untuk development aman)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model data yang diterima dari frontend
class ChatRequest(BaseModel):
    message: str
    division: str = "IT" # Default divisi jika tidak dikirim

@app.get("/")
def read_root():
    return {"status": "Backend AI is running!"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if ask_bot_stream is None:
        raise HTTPException(status_code=500, detail="RAG system failed to load.")
    
    try:
        # Menggunakan StreamingResponse
        return StreamingResponse(
            ask_bot_stream(request.message, request.division),
            media_type="text/plain"
        )
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting API Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
