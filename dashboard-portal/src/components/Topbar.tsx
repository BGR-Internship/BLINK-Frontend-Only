import { Bell, Search, Globe, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopbarProps {
    onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
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
            {/* Search Bar - Optional addition for UX */}
            <div className="w-96 relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search for services, news..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-slate-400 transition-all"
                />
            </div>

            <div className="flex items-center gap-6 ml-auto">
                {/* Language Switcher */}
                <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
                    <Globe size={20} />
                    <span className="text-sm font-medium">EN</span>
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-white/50 text-slate-500 hover:text-primary transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-secondary rounded-full animate-ping" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-secondary rounded-full" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-700">Fadhil Zaky</p>
                        <p className="text-xs text-slate-500">Employee ID: 50000216</p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 cursor-pointer"
                    >
                        <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Fadhil+Zaky&background=1893A0&color=fff" alt="Profile" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
