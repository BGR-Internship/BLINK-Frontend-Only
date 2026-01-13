import { Moon, Sun } from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '../context/SettingsContext';
import ToggleSwitch from '../components/ui/ToggleSwitch';

const Settings = () => {
    const { theme, toggleTheme } = useSettings();

    const isDarkMode = theme === 'dark';

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your preferences and application settings</p>
            </header>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-sm border border-white/20 dark:border-white/5 space-y-8 max-w-2xl">

                {/* Theme Setting */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-xl">
                            {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 dark:text-white">Appearance</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between Light and Dark mode</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3 w-full md:w-auto">
                        <span className={clsx("text-sm font-medium transition-colors", !isDarkMode ? "text-slate-800" : "text-slate-400")}>Light</span>
                        <ToggleSwitch isOn={isDarkMode} onToggle={toggleTheme} />
                        <span className={clsx("text-sm font-medium transition-colors", isDarkMode ? "text-slate-800 dark:text-white" : "text-slate-400")}>Dark</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
