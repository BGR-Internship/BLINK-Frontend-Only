
import { createContext, useContext, useState, ReactNode } from 'react';

// Define User Type
export type UserRole = 'super_admin' | 'admin' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    division?: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: UserRole) => void;
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

    const login = (role: UserRole) => {
        // Mock Login Logic
        const mockUser: User = {
            id: '1',
            name: role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin User' : 'Regular User',
            email: `${role}@blink.id`,
            role: role,
            division: 'IT Development'
        };
        setUser(mockUser);
        localStorage.setItem('blink_user', JSON.stringify(mockUser));
        localStorage.setItem('blink_token', 'mock-token-123');
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
