import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'id';

interface SettingsContextType {
    theme: Theme;
    toggleTheme: () => void;
    language: Language;
    toggleLanguage: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    // 1. Initialize State from LocalStorage or Default
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'light';
    });

    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'en';
    });

    // 2. Persist & Apply Theme Side Effects
    useEffect(() => {
        localStorage.setItem('theme', theme);

        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // 3. Persist Language Side Effects
    useEffect(() => {
        localStorage.setItem('language', language);
        // In a real app, you'd trigger i18n changes here
    }, [language]);

    const toggleTheme = () => {
        console.log("toggleTheme called. Current:", theme);
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleLanguage = () => {
        console.log("toggleLanguage called. Current:", language);
        setLanguage(prev => prev === 'en' ? 'id' : 'en');
    };

    return (
        <SettingsContext.Provider value={{ theme, toggleTheme, language, toggleLanguage }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
