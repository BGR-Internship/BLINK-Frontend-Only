import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import defaultBanner from '../assets/PosterCleanDesk.png';

// --- RUNPOD BACKEND URL ---
const API_URL = "https://ui9oox4nr5tnfv-3000.proxy.runpod.net";

// Types
export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    color?: string; // To keep the gradient aesthetic
}

export interface SiteConfig {
    heroBanners: Banner[];
    popupBanners: Banner[];
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
    isActive: boolean;
}

interface AdminContextType {
    siteConfig: SiteConfig;
    updateSiteConfig: (config: Partial<SiteConfig>) => void;
    documents: Document[];
    addDocument: (doc: Omit<Document, 'id' | 'date' | 'is_active'> & { file?: File }) => void;
    deleteDocument: (id: string) => void;
    toggleDocument: (id: string, currentStatus: boolean) => void;
}

// Default Config
const defaultSiteConfig: SiteConfig = {
    heroBanners: [
        {
            id: '1',
            title: "Net Zero Emissions 2060",
            subtitle: "Challenge yourself to take action for a cleaner future.",
            image: "https://picsum.photos/seed/business/1200/600",
            color: "from-blue-600 to-indigo-600"
        },
        {
            id: '2',
            title: "Digital Transformation",
            subtitle: "Embracing technology to drive efficiency.",
            image: "https://picsum.photos/seed/tech/1200/600",
            color: "from-purple-600 to-pink-600"
        },
        {
            id: '3',
            title: "Safety First",
            subtitle: "Prioritizing safety in every operation.",
            image: "https://picsum.photos/seed/safety/1200/600",
            color: "from-orange-500 to-red-500"
        }
    ],
    popupBanners: [
        {
            id: 'p1',
            title: "Perhatian",
            subtitle: "Harap perhatikan.",
            image: defaultBanner,
        }
    ],
    popupTitle: "Pengumuman",
    popupActive: true,
};

// Mock Initial Documents
const initialDocuments: Document[] = [
    { id: '1', title: 'Q1 Financial Report', type: 'SKD', division: 'Finance', classification: 'Private', date: '2024-03-01', fileUrl: '#', isActive: true },
    { id: '2', title: 'Employee Handbook 2024', type: 'SOP', division: 'HR', classification: 'Public', date: '2024-01-15', fileUrl: '#', isActive: true },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const updateSiteConfig = (newConfig: Partial<SiteConfig>) => {
        setSiteConfig(prev => ({ ...prev, ...newConfig }));
    };

    const fetchDocuments = async () => {
        try {
            // Updated to use RunPod URL
            const response = await fetch(`${API_URL}/api/documents`);
            const data = await response.json();

            setDocuments(data.map((doc: any) => ({
                id: doc.id,
                title: doc.title,
                type: doc.title.toLowerCase().includes('sop') ? 'SOP' : 'SKD',
                division: doc.division,
                classification: doc.classification || 'Public',
                date: doc.date || new Date().toISOString().split('T')[0],
                fileUrl: doc.fileUrl || '#',
                is_active: doc.is_active
            })));
        } catch (error) {
            console.error("Failed to fetch documents:", error);
            setDocuments(initialDocuments);
        }
    };

    const addDocument = async (doc: Omit<Document, 'id' | 'date' | 'is_active'> & { file?: File }) => {
        try {
            const formData = new FormData();
            formData.append('title', doc.title);
            formData.append('division', doc.division);
            formData.append('classification', doc.classification);
            if (doc.file) {
                formData.append('file', doc.file);
            }

            // Updated to use RunPod URL
            const response = await fetch(`${API_URL}/api/documents`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                await fetchDocuments();
            } else {
                console.error("Failed to upload");
            }
        } catch (e) {
            console.error("Error uploading:", e);
        }
    };

    const deleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    const toggleDocument = async (id: string, currentStatus: boolean) => {
        try {
            // Updated to use RunPod URL
            await fetch(`${API_URL}/api/documents/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: !currentStatus })
            });
            await fetchDocuments();
        } catch (e) {
            console.error("Failed to toggle document:", e);
        }
    };

    return (
        <AdminContext.Provider value={{ siteConfig, updateSiteConfig, documents, addDocument, deleteDocument, toggleDocument }}>
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
