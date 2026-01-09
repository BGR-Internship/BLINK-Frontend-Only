import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/BGR_logo.png';
import {
    Home,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { icon: Home, label: "Dashboard", path: "/" },
        { icon: User, label: "Profile", path: "/profile" },
        { icon: Settings, label: "Settings", path: "/settings" },
    ];

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            className="h-screen bg-white shadow-xl z-50 flex flex-col fixed left-0 top-0 border-r border-slate-100"
        >
            {/* Header / Logo */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
                {!collapsed && (
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={logo}
                        alt="BGR Logo"
                        className="h-12 w-auto object-contain"
                    />
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-primary transition-colors ml-auto"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Menu */}
            <div className="flex-1 py-6 px-4 space-y-2">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className={clsx(
                                "w-full flex items-center p-3 rounded-2xl transition-all duration-300 group hover:shadow-lg",
                                isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-slate-500 hover:bg-white hover:text-primary"
                            )}
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />

                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="ml-3 font-medium whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Active Indicator Dot */}
                            {!collapsed && isActive && (
                                <motion.div
                                    layoutId="active-dot"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-50">
                <button className={clsx(
                    "w-full flex items-center p-3 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-secondary transition-colors",
                    collapsed ? "justify-center" : ""
                )}>
                    <LogOut size={22} />
                    {!collapsed && <span className="ml-3 font-medium">Log Out</span>}
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
