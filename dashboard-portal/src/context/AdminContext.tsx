import { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface SiteConfig {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImage: string; // URL or path
    popupTitle: string;
    popupContent: string;
    popupActive: boolean;
}

export interface Document {
    id: string;
    title: string;
    division: string;
    classification: 'Public' | 'Private';
    date: string;
    fileUrl: string; // Mock url
}

interface AdminContextType {
    siteConfig: SiteConfig;
    updateSiteConfig: (config: Partial<SiteConfig>) => void;
    documents: Document[];
    addDocument: (doc: Omit<Document, 'id' | 'date'>) => void;
    deleteDocument: (id: string) => void;
}

// Default Config
const defaultSiteConfig: SiteConfig = {
    bannerTitle: "Net Zero Emissions 2060",
    bannerSubtitle: "Challenge yourself to take action for a cleaner future.",
    bannerImage: "https://images.unsplash.com/photo-1497435334941-8c899ee7e8e9?q=80&w=2574&auto=format&fit=crop",
    popupTitle: "Clean Desk Policy Campaign",
    popupContent: "Unless you are in a meeting, lock your computer screen when leaving your desk. Secure sensitive documents in locked drawers. Clear your workspace of confidential materials at the end of the day.",
    popupActive: true,
};

// Mock Initial Documents
const initialDocuments: Document[] = [
    { id: '1', title: 'Q1 Financial Report', division: 'Finance', classification: 'Private', date: '2024-03-01', fileUrl: '#' },
    { id: '2', title: 'Employee Handbook 2024', division: 'HR', classification: 'Public', date: '2024-01-15', fileUrl: '#' },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);

    const updateSiteConfig = (newConfig: Partial<SiteConfig>) => {
        setSiteConfig(prev => ({ ...prev, ...newConfig }));
    };

    const addDocument = (doc: Omit<Document, 'id' | 'date'>) => {
        const newDoc: Document = {
            ...doc,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0]
        };
        setDocuments(prev => [...prev, newDoc]);
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    return (
        <AdminContext.Provider value={{ siteConfig, updateSiteConfig, documents, addDocument, deleteDocument }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
