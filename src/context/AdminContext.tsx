import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import defaultBanner from '../assets/banner.jpg';

// --- BACKEND URL ---
const API_URL = "https://lindsay-unreviewable-nannette.ngrok-free.dev";

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
    refreshConfig: () => void;
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
            color: "from-slate-800 to-slate-900"
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
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        fetchDocuments();
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            // 1. Settings
            const setRes = await fetch(`${API_URL}/api/settings`);
            const setData = await setRes.json();

            // 2. Banners
            const banRes = await fetch(`${API_URL}/api/banner`);
            const banData = await banRes.json();
            const mappedBanners = Array.isArray(banData) ? banData.map((b: any) => ({
                id: String(b.id),
                title: b.title,
                subtitle: b.description,
                image: b.image_path || b.image,
                color: b.color || 'from-blue-600 to-indigo-600'
            })) : [];

            // 3. Popups
            const popRes = await fetch(`${API_URL}/api/popups`);
            const popData = await popRes.json();
            const mappedPopups = Array.isArray(popData) ? popData.map((p: any) => ({
                id: String(p.id),
                title: p.title || 'Popup',
                subtitle: p.description || '',
                image: p.image_path || p.image,
                color: p.color
            })) : [];

            setSiteConfig(prev => ({
                ...prev,
                popupActive: setData ? (setData.popup_active === '1' || setData.popup_active === 'true') : prev.popupActive,
                heroBanners: mappedBanners.length > 0 ? mappedBanners : prev.heroBanners,
                popupBanners: mappedPopups.length > 0 ? mappedPopups : prev.popupBanners
            }));

        } catch (e) {
            console.error("Failed to fetch site config", e);
        }
    };

    const updateSiteConfig = async (newConfig: Partial<SiteConfig>) => {
        // Optimistic UI Update
        setSiteConfig(prev => ({ ...prev, ...newConfig }));

        // Persist specific keys to DB
        if (newConfig.popupActive !== undefined) {
            try {
                await fetch(`${API_URL}/api/settings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ popup_active: newConfig.popupActive ? '1' : '0' })
                });
            } catch (e) {
                console.error("Failed to save settings", e);
            }
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${API_URL}/api/documents`);
            const data = await response.json();
            // Map properly if needed, but assuming API matches Document type roughly
            // API returns: id, title, division, classification, date, is_active
            setDocuments(data.map((doc: any) => ({
                id: doc.id,
                title: doc.title,
                type: doc.title.toLowerCase().includes('sop') ? 'SOP' : 'SKD', // Auto-detect or logic
                division: doc.division,
                classification: doc.classification || 'Public',
                date: doc.date || new Date().toISOString().split('T')[0],
                fileUrl: doc.fileUrl || '#',
                is_active: doc.is_active // Add this to type
            })));
        } catch (error) {
            console.error("Failed to fetch documents:", error);
            // Fallback to initial if failed? Or empty
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

            const response = await fetch(`${API_URL}/api/documents`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                await fetchDocuments(); // Reload list
            } else {
                console.error("Failed to upload");
            }
        } catch (e) {
            console.error("Error uploading:", e);
        }
    };

    const deleteDocument = (id: string) => {
        // Implement delete API if available, else local
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    const toggleDocument = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`${API_URL}/api/documents/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_active: !currentStatus })
            });
            await fetchDocuments(); // Reload
        } catch (e) {
            console.error("Failed to toggle document:", e);
        }
    };

    return (
        <AdminContext.Provider value={{ siteConfig, updateSiteConfig, refreshConfig: fetchConfig, documents, addDocument, deleteDocument, toggleDocument }}>
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
