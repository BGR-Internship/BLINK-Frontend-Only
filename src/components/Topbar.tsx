import { Menu, LogOut, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

interface TopbarProps {
    onMenuClick?: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
    const [userData, setUserData] = useState({ id: '', nik: '' });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

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

        // Click outside listener
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { icon: User, label: 'Profile', onClick: () => navigate('/profile') },
        { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
        { icon: LogOut, label: 'Log Out', onClick: handleLogout, className: 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' },
    ];

    return (
        <div className="h-20 w-full flex items-center justify-between px-4 md:px-8 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 sticky top-0 z-40 border-b border-white/20 dark:border-white/5 shadow-sm">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 mr-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Open Menu"
            >
                <Menu size={24} />
            </button>

            {/* Search Bar Removed from here */}

            <div className="flex items-center gap-6 ml-auto">
                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700 relative" ref={dropdownRef}>
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{userData.id}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">NIK: {userData.nik}</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-10 h-10 rounded-full bg-orange-500 p-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden">
                            <img
                                src={`https://ui-avatars.com/api/?name=${userData.id}&background=1893A0&color=fff`}
                                alt="Profile"
                            />
                        </div>
                    </motion.button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 overflow-hidden z-50"
                            >
                                <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-700 sm:hidden">
                                    <p className="text-sm font-bold text-slate-700 dark:text-white truncate">{userData.id}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userData.nik}</p>
                                </div>

                                <div className="py-1">
                                    {menuItems.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                item.onClick();
                                                setIsDropdownOpen(false);
                                            }}
                                            className={clsx(
                                                "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors",
                                                item.className
                                                    ? item.className
                                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-primary dark:hover:text-primary"
                                            )}
                                        >
                                            <item.icon size={16} />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Topbar;