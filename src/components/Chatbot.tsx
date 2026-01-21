import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Maximize2, Minimize2, Sparkles, MessageSquare } from 'lucide-react';
import clsx from 'clsx';
import BilaLogo from '../assets/bila-ai.png';

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
            text: "Halo! Saya Bila, asisten pribadi Anda. Ada yang bisa saya bantu hari ini?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!inputValue.trim() || isLoading) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: newUserMessage.text,
                    model: "gemma3:4b"
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gagal mendapatkan respons');
            }

            const fullText = data.reply || "Maaf, saya tidak mendapatkan respons.";

            // Create a bot message with empty text first
            const botMessageId = (Date.now() + 1).toString();
            const botMessage: Message = {
                id: botMessageId,
                text: "",
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false); // Stop "typing" indicator before streaming starts

            // Streaming Effect
            let currentText = "";
            const words = fullText.split(' ');
            let wordIndex = 0;

            const streamInterval = setInterval(() => {
                if (wordIndex < words.length) {
                    currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
                    setMessages(prev => prev.map(m =>
                        m.id === botMessageId ? { ...m, text: currentText } : m
                    ));
                    wordIndex++;
                } else {
                    clearInterval(streamInterval);
                }
            }, 50); // Speed of streaming

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Maaf, saya tidak dapat terhubung ke AI. Pastikan server berjalan.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 group"
                    >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-2xl shadow-primary/40 border-2 border-white/50 backdrop-blur-sm transition-transform duration-300 group-hover:shadow-primary/60">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity" />
                            <img
                                src={BilaLogo}
                                alt="Bila AI"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Status Indicator */}
                        <span className="absolute top-0 right-0 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={clsx(
                            "fixed z-50 flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl border border-white/20 transition-all duration-300",
                            isMaximized
                                ? "inset-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[600px] sm:h-[80vh] rounded-2xl bg-white/95 dark:bg-slate-900/95"
                                : "bottom-4 left-4 right-4 h-[500px] sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 sm:h-[550px] rounded-3xl bg-white/90 dark:bg-slate-900/90"
                        )}
                    >
                        {/* Header */}
                        <div className="relative bg-teal-50 dark:bg-slate-800 p-4 flex items-center justify-between border-b border-teal-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full border border-teal-100 dark:border-slate-600 overflow-hidden bg-white">
                                        <img
                                            src={BilaLogo}
                                            alt="Bila AI"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-none flex items-center gap-1 text-slate-800 dark:text-white">
                                        Bila
                                        <Sparkles size={14} className="text-teal-400" />
                                    </h3>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Asisten Cerdas Anda</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMaximized(!isMaximized)}
                                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                                    title={isMaximized ? "Kecilkan" : "Perbesar"}
                                >
                                    {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                                    title="Tutup"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                            <div className="flex justify-center my-2">
                                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    Hari ini
                                </span>
                            </div>

                            {messages.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={clsx(
                                        "flex w-full",
                                        msg.sender === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div className={clsx("flex max-w-[85%] gap-2", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
                                        {/* Avatar for Bot */}
                                        {msg.sender === 'bot' && (
                                            <div className="w-8 h-8 rounded-full bg-teal-50 p-0.5 mt-auto flex-shrink-0 border border-teal-100">
                                                <img src={BilaLogo} className="w-full h-full rounded-full object-cover bg-white" alt="Bila" />
                                            </div>
                                        )}

                                        <div
                                            className={clsx(
                                                "p-4 shadow-sm text-sm leading-relaxed relative group transition-all duration-200 break-words whitespace-pre-wrap min-w-[80px]",
                                                msg.sender === 'user'
                                                    ? "bg-teal-500 text-white rounded-2xl rounded-tr-sm shadow-md shadow-teal-500/10"
                                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm shadow-sm"
                                            )}
                                        >
                                            <div className="font-normal">
                                                {msg.text || (msg.sender === 'bot' && !isLoading ? <span className="italic opacity-50">Mengetik...</span> : msg.text)}
                                            </div>
                                            <span className={clsx(
                                                "text-[10px] mt-2 block opacity-60 font-medium text-right uppercase tracking-tighter",
                                                msg.sender === 'user' ? "text-teal-100" : "text-slate-400"
                                            )}>
                                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex w-full justify-start"
                                >
                                    <div className="flex items-end gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 flex-shrink-0">
                                            <img src={BilaLogo} className="w-full h-full rounded-full object-cover bg-white" alt="Bila" />
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-2xl rounded-tl-sm shadow-sm">
                                            <div className="flex gap-1.5">
                                                <motion.span
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                    className="w-2 h-2 bg-slate-400 rounded-full"
                                                />
                                                <motion.span
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                                    className="w-2 h-2 bg-slate-400 rounded-full"
                                                />
                                                <motion.span
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                                    className="w-2 h-2 bg-slate-400 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
                            <form
                                onSubmit={handleSendMessage}
                                className="relative flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-transparent focus-within:border-primary/30 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all duration-300 shadow-inner"
                            >
                                <div className="pl-3 text-slate-400 self-end mb-2.5">
                                    <MessageSquare size={18} />
                                </div>
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(e);
                                        }
                                    }}
                                    placeholder="Ketik pesan..."
                                    rows={1}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 py-2.5 resize-none max-h-32 overflow-y-auto"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="p-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95 transition-all duration-200 self-end mb-1"
                                >
                                    <Send size={18} className={clsx(isLoading ? "opacity-0" : "opacity-100")} />
                                    {isLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                </button>
                            </form>
                            <div className="flex justify-center mt-2">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                    Didukung oleh <Sparkles size={10} className="text-primary" /> BILA AI
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
