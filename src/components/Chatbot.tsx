import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';
import BilaLogo from '../assets/BILA AI 1.png';

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
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm Bila, your personal assistant. How can I help you today?",
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
    }, [messages]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        // Simulate Bot Response (To be replaced by AI integration)
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "I've received your message. An AI developer will connect me to a real brain soon!",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
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
                className="fixed bottom-6 right-6 z-50 p-0 bg-transparent rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all overflow-hidden border-2 border-white"
            >
                {isOpen ? (
                    <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary flex items-center justify-center rounded-full">
                        <X size={28} className="text-white" />
                    </div>
                ) : (
                    <div className="relative w-16 h-16">
                        <img
                            src={BilaLogo}
                            alt="Bila AI"
                            className="w-full h-full object-cover"
                        />
                        <span className="absolute top-0 right-0 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
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
                                <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                                    <img
                                        src={BilaLogo}
                                        alt="Bila AI"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
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
                                                : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                                        )}
                                    >
                                        <p>{msg.text}</p>
                                        <span className={clsx(
                                            "text-[10px] mt-1 block opacity-70",
                                            msg.sender === 'user' ? "text-white/80" : "text-slate-400"
                                        )}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
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
