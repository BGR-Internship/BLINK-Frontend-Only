import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function CampaignPopup() {
    const { siteConfig } = useAdmin();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Trigger popup on mount (page load) if active
        if (siteConfig.popupActive) {
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [siteConfig.popupActive]);

    const closePopup = () => setIsOpen(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center space-x-3 text-amber-600">
                                <div className="p-2 bg-amber-50 rounded-xl">
                                    <ShieldAlert size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{siteConfig.popupTitle}</h3>
                            </div>
                            <button
                                onClick={closePopup}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 md:p-8">
                            <h4 className="text-lg font-semibold text-slate-800 mb-3">
                                Clean Desk Policy Campaign
                            </h4>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    {siteConfig.popupContent}
                                </p>
                                <ul className="space-y-2 bg-slate-50 p-4 rounded-xl text-sm">
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                        <span>Lock your computer screen when leaving your desk.</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                        <span>Secure sensitive documents in locked drawers.</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <CheckCircle size={16} className="text-green-500 mt-0.5" />
                                        <span>Clear your workspace of confidential materials at the end of the day.</span>
                                    </li>
                                </ul>
                                <p className="text-sm">
                                    Your cooperation is vital in maintaining a secure working environment for everyone.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50 flex justify-end">
                            <button
                                onClick={closePopup}
                                className="px-6 py-2.5 bg-primary hover:bg-secondary text-white font-medium rounded-xl transition-colors shadow-lg shadow-primary/25"
                            >
                                I Understand & Agree
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
