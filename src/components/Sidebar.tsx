import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    LayoutGrid,
    Calendar,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    User
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
    const menuItems = [
        { icon: Home, label: "Dashboard", active: true },
        { icon: LayoutGrid, label: "Services" },
        { icon: BookOpen, label: "Academics" },
        { icon: Calendar, label: "Schedule" },
        { icon: User, label: "Profile" },
        { icon: Settings, label: "Settings" },
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
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    >
                        BLINK
                    </motion.span>
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
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={clsx(
                            "w-full flex items-center p-3 rounded-2xl transition-all duration-300 group hover:shadow-lg",
                            item.active
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "text-slate-500 hover:bg-white hover:text-primary"
                        )}
                    >
                        <item.icon size={22} strokeWidth={item.active ? 2.5 : 2} />

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
                        {!collapsed && item.active && (
                            <motion.div
                                layoutId="active-dot"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50"
                            />
                        )}
                    </button>
                ))}
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
