import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Halo! Saya Bila, asisten virtual Anda. Ada yang bisa saya bantu terkait SOP perusahaan?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]); // Scroll when messages change or loading state changes

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const userText = inputValue;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        // Placeholder ID untuk pesan bot yang sedang diketik
        const botMessageId = (Date.now() + 1).toString();
        
        // Buat pesan kosong awal untuk bot
        setMessages(prev => [...prev, {
            id: botMessageId,
            text: "",
            sender: 'bot',
            timestamp: new Date()
        }]);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userText,
                    division: "IT" 
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            if (!response.body) throw new Error('ReadableStream not supported');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                // Update pesan bot secara real-time
                setMessages(prev => 
                    prev.map(msg => 
                        msg.id === botMessageId 
                            ? { ...msg, text: accumulatedText }
                            : msg
                    )
                );
            }

        } catch (error) {
            console.error("Error communicating with AI backend:", error);
            // Jika error, ganti pesan kosong tadi dengan pesan error
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === botMessageId 
                        ? { ...msg, text: "Maaf, sistem AI sedang tidak dapat dihubungi atau terjadi kesalahan saat streaming." }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all"
            >
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <MessageCircle size={28} />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                    </div>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            width: isMaximized ? '600px' : '384px', // 384px is w-96
                            height: isMaximized ? '80vh' : '500px',
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={clsx(
                            "fixed bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col z-50 overflow-hidden transition-all duration-300",
                            isMaximized ? "bottom-6 right-6 max-w-[calc(100vw-3rem)]" : "bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px]"
                        )}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between text-white cursor-pointer" onClick={() => setIsMaximized(!isMaximized)}>
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Bila</h3>
                                    <div className="flex items-center gap-1.5 opacity-90">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                        <span className="text-xs">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        "flex w-full",
                                        msg.sender === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                            msg.sender === 'user'
                                                ? "bg-primary text-white rounded-br-none"
                                                : "bg-white text-slate-700 border border-slate-100 rounded-bl-none prose prose-slate prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0"
                                        )}
                                    >
                                        {msg.sender === 'bot' ? (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{msg.text}</p>
                                        )}
                                        <span className={clsx(
                                            "text-[10px] mt-1 block opacity-70",
                                            msg.sender === 'user' ? "text-white/80" : "text-slate-400"
                                        )}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex w-full justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="p-2 bg-primary text-white rounded-xl hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
