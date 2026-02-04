import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Languages } from 'lucide-react';
import clsx from 'clsx';

const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
    <div
        className={clsx(
            "w-14 h-8 flex items-center bg-slate-200 rounded-full p-1 cursor-pointer transition-colors duration-300",
            isOn && "bg-primary"
        )}
        onClick={onToggle}
    >
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            className="bg-white w-6 h-6 rounded-full shadow-md"
            style={{ marginLeft: isOn ? 'auto' : '0' }}
        />
    </div>
);

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isIndonesian, setIsIndonesian] = useState(false);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500 mt-2">Manage your preferences and application settings</p>
            </header>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-white/20 space-y-8 max-w-2xl">

                {/* Theme Setting */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4 md:gap-0">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Appearance</h3>
                            <p className="text-sm text-slate-500">Toggle between Light and Dark mode</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3 w-full md:w-auto">
                        <span className={clsx("text-sm font-medium transition-colors", !isDarkMode ? "text-slate-800" : "text-slate-400")}>Light</span>
                        <ToggleSwitch isOn={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
                        <span className={clsx("text-sm font-medium transition-colors", isDarkMode ? "text-slate-800" : "text-slate-400")}>Dark</span>
                    </div>
                </div>

                {/* Language Setting */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Languages size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Language</h3>
                            <p className="text-sm text-slate-500">Select your preferred language</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3 w-full md:w-auto">
                        <span className={clsx("text-sm font-medium transition-colors", !isIndonesian ? "text-slate-800" : "text-slate-400")}>EN</span>
                        <ToggleSwitch isOn={isIndonesian} onToggle={() => setIsIndonesian(!isIndonesian)} />
                        <span className={clsx("text-sm font-medium transition-colors", isIndonesian ? "text-slate-800" : "text-slate-400")}>ID</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
