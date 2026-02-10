
import { useState, useEffect } from 'react';
import { useAdmin, SiteConfig as SiteConfigType, Banner } from '../../context/AdminContext';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { Trash2, Plus, Image as ImageIcon, Save, Edit2, X } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import ConfirmModal from '../../components/ui/ConfirmModal';

const SiteConfig = () => {
    const { siteConfig, updateSiteConfig, refreshConfig: refreshGlobal } = useAdmin();

    // Local state for "Draft" mode
    const [draftConfig, setDraftConfig] = useState<SiteConfigType>(siteConfig);
    const [isDirty, setIsDirty] = useState(false);

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [editingType, setEditingType] = useState<'hero' | 'popup'>('hero'); // Track what we are editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempBanner, setTempBanner] = useState<Banner>({
        id: '',
        title: '',
        subtitle: '',
        image: '',
        color: 'from-blue-600 to-indigo-600'
    });

    // DB Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dbBanners, setDbBanners] = useState<any[]>([]);
    const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
    const [isUploading, setIsUploading] = useState(false);

    // --- POPUP DB STATE (MySQL/JSON) ---
    const [dbPopups, setDbPopups] = useState<any[]>([]);
    const [popupFile, setPopupFile] = useState<File | null>(null);
    const [popupUrl, setPopupUrl] = useState('');
    const [popupUploadMode, setPopupUploadMode] = useState<'file' | 'url'>('file');
    const [isUploadingPopup, setIsUploadingPopup] = useState(false);

    // --- MODALS STATE ---
    const [deleteBannerId, setDeleteBannerId] = useState<string | null>(null);
    const [deletePopupId, setDeletePopupId] = useState<string | null>(null);
    const [successModal, setSuccessModal] = useState<{ isOpen: boolean; title: string; message: string }>({ isOpen: false, title: '', message: '' });
    const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });


    // Initial Fetch of Current Banner
    useEffect(() => {
        setDraftConfig(siteConfig);
        fetchCurrentBanner();
        fetchPopups();
    }, []);

    // Sync draft with global config updates (e.g. initial fetch async)
    useEffect(() => {
        setDraftConfig(prev => ({ ...prev, popupActive: siteConfig.popupActive }));
    }, [siteConfig.popupActive]);

    const fetchCurrentBanner = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/banner');
            const data = await res.json();
            if (Array.isArray(data)) {
                setDbBanners(data.map((b: any) => ({ ...b, image: b.image_path || b.image })));
            } else if (data && (data.image_path || data.image)) {
                setDbBanners([{ ...data, image: data.image_path || data.image }]);
            } else {
                setDbBanners([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteDbBanner = (id: string) => {
        setDeleteBannerId(id);
    };

    const executeDeleteDbBanner = async () => {
        if (!deleteBannerId) return;
        try {
            const res = await fetch(`http://localhost:3000/api/banner/${deleteBannerId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchCurrentBanner();
                refreshGlobal();
                setDeleteBannerId(null); // Close modal
            } else {
                setErrorModal({ isOpen: true, message: "Gagal menghapus banner" });
            }
        } catch (e) {
            console.error(e);
            setErrorModal({ isOpen: true, message: "Error deleting banner" });
        }
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setTempBanner(prev => ({ ...prev, image: e.target?.result as string }));
        };
        reader.readAsDataURL(file);
    };

    // --- POPUP CRUD (MySQL) ---
    const fetchPopups = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/popups');
            const data = await res.json();
            const mappedData = Array.isArray(data) ? data.map((p: any) => ({ ...p, image: p.image_path || p.image })) : [];
            setDbPopups(mappedData);
        } catch (err) {
            console.error("Failed to fetch popups", err);
        }
    };

    const handlePopupUpload = async () => {
        if (popupUploadMode === 'file' && !popupFile) return setErrorModal({ isOpen: true, message: "Pilih file gambar dulu!" });
        if (popupUploadMode === 'url' && !popupUrl) return setErrorModal({ isOpen: true, message: "Masukan URL gambar!" });

        setIsUploadingPopup(true);
        try {
            let res;
            if (popupUploadMode === 'file' && popupFile) {
                const formData = new FormData();
                formData.append('image', popupFile);
                res = await fetch('http://localhost:3000/api/popups', {
                    method: 'POST',
                    body: formData
                });
            } else {
                res = await fetch('http://localhost:3000/api/popups', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageUrl: popupUrl })
                });
            }

            const data = await res.json();
            if (data.success) {
                setSuccessModal({ isOpen: true, title: "Popup Berhasil", message: "Popup berhasil ditambahkan ke database." });
                fetchPopups();
                refreshGlobal();
                setPopupFile(null);
                setPopupUrl('');
            } else {
                setErrorModal({ isOpen: true, message: "Gagal upload: " + (data.error || 'Unknown error') });
            }
        } catch (e: any) {
            console.error(e);
            setErrorModal({ isOpen: true, message: "Error upload popup" });
        } finally {
            setIsUploadingPopup(false);
        }
    };

    const handleDeletePopup = (id: string) => {
        setDeletePopupId(id);
    };

    const executeDeletePopup = async () => {
        if (!deletePopupId) return;
        try {
            const res = await fetch(`http://localhost:3000/api/popups/${deletePopupId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchPopups();
                refreshGlobal();
                setDeletePopupId(null);
            } else {
                setErrorModal({ isOpen: true, message: "Gagal menghapus popup" });
            }
        } catch (e) {
            console.error(e);
            setErrorModal({ isOpen: true, message: "Error deleting popup" });
        }
    };

    const handleBannerDbUpload = async () => {
        if (uploadMode === 'file' && !selectedFile) return setErrorModal({ isOpen: true, message: "Pilih file gambar dulu!" });
        if (uploadMode === 'url' && !tempBanner.image) return setErrorModal({ isOpen: true, message: "Masukan URL gambar!" });

        setIsUploading(true); // Loading

        try {
            let res;
            if (uploadMode === 'file' && selectedFile) {
                const formData = new FormData();
                formData.append('title', tempBanner.title);
                formData.append('description', tempBanner.subtitle);
                formData.append('image', selectedFile);

                res = await fetch('http://localhost:3000/api/banner', {
                    method: 'POST',
                    body: formData
                });
            } else {
                // URL Mode
                res = await fetch('http://localhost:3000/api/banner', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: tempBanner.title,
                        description: tempBanner.subtitle,
                        imageUrl: tempBanner.image
                    })
                });
            }

            const data = await res.json();
            if (data.success) {
                setSuccessModal({ isOpen: true, title: "Banner Berhasil", message: "Banner baru telah berhasil ditambahkan." });
                fetchCurrentBanner();
                refreshGlobal();
                setSelectedFile(null);
                setTempBanner({
                    id: '',
                    title: '',
                    subtitle: '',
                    image: '',
                    color: 'from-slate-700 to-slate-900'
                });
            } else {
                setErrorModal({ isOpen: true, message: "Gagal upload: " + (data.error || 'Unknown error') });
            }
        } catch (e: any) {
            console.error(e);
            setErrorModal({ isOpen: true, message: "Error upload: " + e.message });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveAll = () => {
        updateSiteConfig(draftConfig);
        setIsDirty(false);
        setSuccessModal({
            isOpen: true,
            title: "Berhasil Disimpan",
            message: "Perubahan konfigurasi situs telah berhasil disimpan ke sistem."
        });
    };

    // --- Banner CRUD Helpers ---
    const resetTempBanner = () => {
        setTempBanner({
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            subtitle: '',
            image: '',
            color: 'from-blue-600 to-indigo-600'
        });
    }

    const handleAdd = (type: 'hero' | 'popup') => {
        resetTempBanner();
        setEditingType(type);
        setEditingId(null);
        setIsEditing(true);
    };

    const handleEdit = (banner: Banner, type: 'hero' | 'popup') => {
        setTempBanner(banner);
        setEditingType(type);
        setEditingId(banner.id);
        setIsEditing(true);
    };



    const saveTempBanner = () => {
        setDraftConfig(prev => {
            const listKey = editingType === 'hero' ? 'heroBanners' : 'popupBanners';
            // Defensive coding: ensure array exists
            let newList = prev[listKey] ? [...prev[listKey]] : [];

            if (editingId) {
                // Edit existing
                const index = newList.findIndex(b => b.id === editingId);
                if (index !== -1) newList[index] = tempBanner;
            } else {
                // Add new
                newList.push(tempBanner);
            }
            return { ...prev, [listKey]: newList };
        });

        setIsDirty(true);
        setIsEditing(false);
    };

    // --- Popup General Updates ---
    const updatePopupConfig = (updates: Partial<SiteConfigType>) => {
        setDraftConfig(prev => ({ ...prev, ...updates }));
        setIsDirty(true);
    };

    const gradients = [
        "from-blue-600 to-indigo-600",
        "from-purple-600 to-pink-600",
        "from-orange-500 to-red-500",
        "from-emerald-500 to-teal-600",
        "from-slate-700 to-slate-900",
        "from-slate-800 to-slate-900", // Dark gray
    ];

    return (
        <div className="space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Konfigurasi Situs</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Atur Hero Banner dan Popup Kampanye</p>
                </div>

                {isDirty && (
                    <motion.button
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleSaveAll}
                        className="px-6 py-3 bg-primary hover:bg-teal-600 text-white rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 font-bold transition-all"
                    >
                        <Save size={20} /> Simpan Perubahan
                    </motion.button>
                )}
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* --- HERO BANNER CONFIG (DB CONNECTED) --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Hero Banner (Database)</h2>
                    </div>

                    {/* DB Banner List */}
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {dbBanners.map((banner, index) => (
                            <div key={banner.id} className="group relative bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700 flex gap-4 items-center">
                                <div className="w-20 h-14 rounded-lg bg-slate-200 shrink-0 overflow-hidden relative">
                                    <img src={banner.image_path.startsWith('http') ? banner.image_path : `http://localhost:3000/${banner.image_path}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 dark:text-white truncate">{banner.title}</h4>
                                    <p className="text-xs text-slate-500 truncate">{banner.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDeleteDbBanner(banner.id)}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                                        title="Hapus Banner"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                        {dbBanners.length === 0 && (
                            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                                <p>Belum ada banner aktif.</p>
                            </div>
                        )}
                    </div>

                    {/* DB Banner Upload Form */}
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-slate-700 dark:text-slate-300">Upload Banner Baru</h3>

                        {/* Preview New Banner */}
                        {tempBanner.image && (
                            <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative aspect-[21/9]">
                                <img src={tempBanner.image} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                    <p className="text-white font-bold">{tempBanner.title}</p>
                                    <p className="text-white/80 text-sm">{tempBanner.subtitle}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Judul Banner</label>
                                <input
                                    type="text"
                                    value={tempBanner.title}
                                    onChange={(e) => setTempBanner({ ...tempBanner, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Judul..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Deskripsi</label>
                                <input
                                    type="text"
                                    value={tempBanner.subtitle}
                                    onChange={(e) => setTempBanner({ ...tempBanner, subtitle: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Deskripsi..."
                                />
                            </div>
                        </div>
                        {/* Upload Mode Toggle */}
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setUploadMode('file')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${uploadMode === 'file' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                Upload File
                            </button>
                            <button
                                onClick={() => setUploadMode('url')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${uploadMode === 'url' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                Link URL
                            </button>
                        </div>

                        {uploadMode === 'file' ? (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">File Gambar (Lokal)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                                    }}
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Link URL Gambar (Eksternal)</label>
                                <input
                                    type="text"
                                    value={tempBanner.image}
                                    onChange={(e) => setTempBanner({ ...tempBanner, image: e.target.value })} // Provide immediate preview
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">*Pastikan link gambar dapat diakses publik</p>
                            </div>
                        )}

                        <button
                            onClick={handleBannerDbUpload}
                            disabled={isUploading}
                            className="w-full py-2 bg-primary hover:bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isUploading ? 'Mengupload...' : <><Plus size={18} /> Tambahkan Banner</>}
                        </button>
                    </div>
                </div>

                {/* --- POPUP CONFIG (MySQL) --- */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Popup Kampanye (Database)</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-slate-500">
                                {draftConfig.popupActive ? 'Aktif' : 'Nonaktif'}
                            </span>
                            <ToggleSwitch
                                isOn={draftConfig.popupActive}
                                onToggle={() => updatePopupConfig({ popupActive: !draftConfig.popupActive })}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* List Popups */}
                        <div className="grid grid-cols-2 gap-4">
                            {dbPopups.map((popup) => (
                                <div key={popup.id} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-900">
                                    <img
                                        src={popup.image_path.startsWith('http') ? popup.image_path : `http://localhost:3000/${popup.image_path}`}
                                        className="w-full h-full object-cover"
                                        alt="Popup"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => handleDeletePopup(popup.id)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Hapus Popup"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {dbPopups.length === 0 && (
                            <div className="py-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                <ImageIcon className="mx-auto mb-2 opacity-50" size={32} />
                                <p>Belum ada popup.</p>
                            </div>
                        )}

                        {/* Upload Form */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">Tambah Popup Baru</h3>

                            <div className="flex gap-4 mb-2">
                                <button
                                    onClick={() => setPopupUploadMode('file')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${popupUploadMode === 'file' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Upload File
                                </button>
                                <button
                                    onClick={() => setPopupUploadMode('url')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${popupUploadMode === 'url' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    Link URL
                                </button>
                            </div>

                            {popupUploadMode === 'file' ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setPopupFile(e.target.files?.[0] || null)}
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="text"
                                        value={popupUrl}
                                        onChange={(e) => setPopupUrl(e.target.value)}
                                        placeholder="https://example.com/popup.jpg"
                                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            )}

                            <button
                                onClick={handlePopupUpload}
                                disabled={isUploadingPopup}
                                className="w-full py-2 bg-primary hover:bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isUploadingPopup ? 'Mengupload...' : <><Plus size={18} /> Upload Popup</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- UNIVERSAL EDIT MODAL --- */}
                <AnimatePresence>
                    {isEditing && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl space-y-5"
                            >
                                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                        {editingId ? 'Edit' : 'Tambah'} {editingType === 'hero' ? 'Hero Banner (Config)' : 'Popup Item'}
                                    </h3>
                                    <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={20} /></button>
                                </div>

                                <div className="space-y-4">
                                    {/* Edit form for popup only now really, or hero config backup */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Judul</label>
                                        <input
                                            value={tempBanner.title}
                                            onChange={e => setTempBanner({ ...tempBanner, title: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Masukan judul..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Subjudul (Opsional)</label>
                                        <input
                                            value={tempBanner.subtitle}
                                            onChange={e => setTempBanner({ ...tempBanner, subtitle: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Masukan deskripsi singkat..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">URL Gambar</label>
                                        <input
                                            value={tempBanner.image}
                                            onChange={e => setTempBanner({ ...tempBanner, image: e.target.value })}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Background Color</label>
                                        <div className="flex flex-wrap gap-3">
                                            {gradients.map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => setTempBanner({ ...tempBanner, color: g })}
                                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${g} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 transition-all ${tempBanner.color === g ? 'ring-primary scale-110' : 'ring-transparent hover:scale-105'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={saveTempBanner}
                                        className="px-6 py-2 bg-primary hover:bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>

            {/* Delete Banner Configuration Modal */}
            <ConfirmModal
                isOpen={!!deleteBannerId}
                onClose={() => setDeleteBannerId(null)}
                onConfirm={executeDeleteDbBanner}
                title="Hapus Banner?"
                message="Apakah Anda yakin ingin menghapus banner ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                variant="danger"
            />

            {/* Delete Popup Configuration Modal */}
            <ConfirmModal
                isOpen={!!deletePopupId}
                onClose={() => setDeletePopupId(null)}
                onConfirm={executeDeletePopup}
                title="Hapus Popup?"
                message="Apakah Anda yakin ingin menghapus popup ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                variant="danger"
            />

            {/* Success Modal */}
            <ConfirmModal
                isOpen={successModal.isOpen}
                onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
                onConfirm={() => setSuccessModal({ ...successModal, isOpen: false })}
                title={successModal.title || "Berhasil"}
                message={successModal.message}
                confirmText="OK" // Generic OK
                variant="success"
            />

            {/* Error Modal */}
            <ConfirmModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                onConfirm={() => setErrorModal({ ...errorModal, isOpen: false })}
                title="Gagal"
                message={errorModal.message}
                confirmText="OK"
                variant="danger"
            />
        </div>
    );
};

export default SiteConfig;
