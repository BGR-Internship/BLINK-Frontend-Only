import { createContext, useContext, useState, ReactNode } from 'react';
import defaultBanner from '../assets/banner.jpg';

// Types
export interface SiteConfig {
    bannerTitle: string;
    bannerSubtitle: string;
    bannerImage: string; // URL or path
    popupImages: string[]; // List of banner URLs for the popup slider
    popupTitle: string;
    popupActive: boolean;
}

export interface Document {
    id: string;
    title: string;
    type: 'SKD' | 'SOP';
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
    bannerImage: "https://picsum.photos/seed/business/1200/600",
    popupImages: [
        defaultBanner
    ],
    popupTitle: "Important Announcement",
    popupActive: true,
};

// Mock Initial Documents
const initialDocuments: Document[] = [
    { id: '1', title: 'Q1 Financial Report', type: 'SKD', division: 'Finance', classification: 'Private', date: '2024-03-01', fileUrl: '#' },
    { id: '2', title: 'Employee Handbook 2024', type: 'SOP', division: 'HR', classification: 'Public', date: '2024-01-15', fileUrl: '#' },
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
