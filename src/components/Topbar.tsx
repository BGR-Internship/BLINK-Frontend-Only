import { Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TopbarProps {
    onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
    const [userData, setUserData] = useState({ id: '', nik: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserData({
                    id: parsed.id || '-',
                    nik: parsed.nik || '-'
                });
            } catch (error) {
                console.error("Failed to parse user data", error);
            }
        }
    }, []);

    return (
        <div className="h-20 w-full flex items-center justify-between px-4 md:px-8 backdrop-blur-md bg-white/70 sticky top-0 z-40 border-b border-white/20 shadow-sm">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Open Menu"
            >
                <Menu size={24} />
            </button>
            
            {/* Search Bar */}
            <div className="w-96 relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search for services, news..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-slate-400 transition-all"
                />
            </div>

            <div className="flex items-center gap-6 ml-auto">
                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-700">{userData.id}</p>
                        <p className="text-xs text-slate-500">NIK: {userData.nik}</p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        // CHANGED: Solid Orange Background (bg-orange-500) instead of Gradient
                        className="w-10 h-10 rounded-full bg-orange-500 p-0.5 cursor-pointer"
                    >
                        <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                            {/* CHANGED: Using userData.id for the image generator */}
                            <img 
                                src={`https://ui-avatars.com/api/?name=${userData.id}&background=1893A0&color=fff`} 
                                alt="Profile" 
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;