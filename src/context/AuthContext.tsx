
import { createContext, useContext, useState, ReactNode } from 'react';

// Define User Type
// export type UserRole = 'super_admin' | 'admin' | 'user'; // Deprecated

export interface User {
    id: string;
    nik: string; // Added NIK
    name: string;
    email?: string;
    role: string; // Flexible string
    division?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void; // CHANGED: Expect full user object
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Load from localStorage on boot
        const storedUser = localStorage.getItem('blink_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('blink_user', JSON.stringify(userData));
        // Token should be handled by caller or passed inuserData if needed, keeping simple for now
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('blink_user');
        localStorage.removeItem('blink_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
