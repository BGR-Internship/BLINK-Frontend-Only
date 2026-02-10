import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Trash2, FileText, Upload, Plus, Minus, Eye, Power, CheckCircle, XCircle, Search } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../../components/ui/ConfirmModal';

const DocumentManager = () => {
    const { documents, addDocument, deleteDocument, toggleDocument } = useAdmin();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Modal States
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toggleId, setToggleId] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [division, setDivision] = useState('Finance');
    const [docType, setDocType] = useState<'SKD' | 'SOP'>('SKD');
    const [classification, setClassification] = useState<'Public' | 'Private'>('Public');
    // Filter State
    const [filterDivision, setFilterDivision] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter Logic
    const filteredDocuments = documents.filter(doc => {
        const matchesDivision = filterDivision === 'All' || doc.division === filterDivision;
        const matchesType = filterType === 'All' || doc.type === filterType;

        let matchesDate = true;
        if (startDate && endDate) {
            matchesDate = doc.date >= startDate && doc.date <= endDate;
        } else if (startDate) {
            matchesDate = doc.date >= startDate;
        } else if (endDate) {
            matchesDate = doc.date <= endDate;
        }

        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesDivision && matchesType && matchesDate && matchesSearch;
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        addDocument({
            title,
            type: docType,
            division,
            classification,
            fileUrl: '#',
            isActive: true
        });

        // Reset
        setIsFormOpen(false);
        setShowSuccessModal(true);

        // Reset
        setTitle('');
        setDivision('Finance');
        setDocType('SKD');
        setClassification('Public');
    };

    const handleDocTypeChange = (type: 'SKD' | 'SOP') => {
        setDocType(type);
        if (type === 'SOP') {
            setClassification('Public');
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Manajemen Dokumen</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Unggah dan kelola dokumen divisi</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 text-white rounded-xl transition-colors shadow-lg self-start md:self-auto",
                        isFormOpen
                            ? "bg-secondary hover:bg-orange-600 shadow-orange-500/20"
                            : "bg-primary hover:bg-teal-600 shadow-primary/20"
                    )}
                >
                    {isFormOpen ? <Minus size={20} /> : <Plus size={20} />}
                    <span>{isFormOpen ? "Tutup Form" : "Unggah Dokumen"}</span>
                </button>
            </header>

            {/* Upload Form - Moved to Top */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleUpload} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Dokumen Baru</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Judul Dokumen</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Q1 Financial Report"
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Divisi</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="Finance">Finance</option>
                                        <option value="HR">Human Resources</option>
                                        <option value="IT">IT & Tech</option>
                                        <option value="Legal">Legal</option>
                                        <option value="Operations">Operations</option>
                                    </select>
                                </div>

                                {/* Document Type & Classification */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipe Dokumen</label>
                                    <div className="flex items-center gap-4 mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={docType === 'SKD'}
                                                onChange={() => handleDocTypeChange('SKD')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-slate-700 dark:text-slate-300">SKD</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={docType === 'SOP'}
                                                onChange={() => handleDocTypeChange('SOP')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-slate-700 dark:text-slate-300">SOP</span>
                                        </label>
                                    </div>

                                    {/* Classification Dropdown */}
                                    <motion.div
                                        animate={{ opacity: docType === 'SOP' ? 0.6 : 1 }}
                                    >
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Klasifikasi</label>
                                        <select
                                            value={classification}
                                            onChange={(e) => setClassification(e.target.value as 'Public' | 'Private')}
                                            disabled={docType === 'SOP'}
                                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <option value="Public">Public</option>
                                            <option value="Private">Private</option>
                                        </select>
                                    </motion.div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Unggah Berkas</label>
                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                                        <Upload size={24} className="mb-2" />
                                        <span className="text-sm">Klik untuk unggah PDF</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-6 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                                    Unggah Dokumen
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Unified Card: Filter + Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">

                {/* Filter Section (Embedded) */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-wrap gap-4 items-end bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex-1 min-w-[300px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cari Dokumen</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama dokumen..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipe</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="All">Semua Tipe</option>
                            <option value="SKD">SKD</option>
                            <option value="SOP">SOP</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Divisi</label>
                        <select
                            value={filterDivision}
                            onChange={(e) => setFilterDivision(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="All">Semua Divisi</option>
                            <option value="Finance">Finance</option>
                            <option value="HR">Human Resources</option>
                            <option value="IT">IT & Tech</option>
                            <option value="Legal">Legal</option>
                            <option value="Operations">Operations</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dari Tanggal</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {(filterDivision !== 'All' || filterType !== 'All' || startDate || endDate || searchTerm) && (
                        <button
                            onClick={() => {
                                setFilterDivision('All');
                                setFilterType('All');
                                setStartDate('');
                                setEndDate('');
                                setSearchTerm('');
                            }}
                            className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium text-sm h-[42px]"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Document Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Dokumen</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 hidden sm:table-cell">Tipe</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Divisi</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 hidden lg:table-cell">Tanggal</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 hidden xl:table-cell">Klasifikasi</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {filteredDocuments.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
                                                <FileText size={20} />
                                            </div>
                                            <span className="font-medium text-slate-700 dark:text-slate-200">{doc.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md text-xs font-semibold">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 hidden md:table-cell">{doc.division}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-500 text-sm hidden lg:table-cell">{doc.date}</td>
                                    <td className="px-6 py-4 hidden xl:table-cell">
                                        <span className={clsx(
                                            "px-2.5 py-1 rounded-full text-xs font-medium",
                                            doc.classification === 'Public' ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                        )}>
                                            {doc.classification}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {doc.isActive ? (
                                                <span className="flex items-center gap-1.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full">
                                                    <CheckCircle size={12} />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-full">
                                                    <XCircle size={12} />
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => window.open(doc.fileUrl, '_blank')}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                title="View Document"
                                            >
                                                <Eye size={18} />
                                            </button>

                                            <button
                                                onClick={() => setToggleId(doc.id)}
                                                className={clsx(
                                                    "p-2 rounded-lg transition-colors",
                                                    doc.isActive
                                                        ? "text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                                        : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                )}
                                                title={doc.isActive ? "Deactivate" : "Activate"}
                                            >
                                                <Power size={18} />
                                            </button>

                                            <button
                                                onClick={() => setDeleteId(doc.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Document"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {documents.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <FileText size={48} className="mb-4 opacity-20" />
                                            <p>Tidak ada dokumen ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    isOpen={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onConfirm={() => {
                        if (deleteId) deleteDocument(deleteId);
                    }}
                    title="Hapus Dokumen?"
                    message="Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan."
                    confirmText="Hapus"
                    variant="danger"
                />

                {/* Success Upload Modal */}
                <ConfirmModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    onConfirm={() => setShowSuccessModal(false)}
                    title="Berhasil Diunggah!"
                    message="Dokumen baru telah berhasil ditambahkan ke sistem."
                    confirmText="OK"
                    variant="success"
                />

                {/* Application Toggle Modal */}
                <ConfirmModal
                    isOpen={!!toggleId}
                    onClose={() => setToggleId(null)}
                    onConfirm={() => {
                        const doc = documents.find(d => d.id === toggleId);
                        if (doc) toggleDocument(doc.id, doc.isActive);
                    }}
                    title={documents.find(d => d.id === toggleId)?.isActive ? "Deactivate Document?" : "Activate Document?"}
                    message={
                        documents.find(d => d.id === toggleId)?.isActive
                            ? "This document will be hidden from users."
                            : "This document will be visible to users."
                    }
                    confirmText={documents.find(d => d.id === toggleId)?.isActive ? "Deactivate" : "Activate"}
                    variant={documents.find(d => d.id === toggleId)?.isActive ? "warning" : "info"}
                />
            </div>
        </div>
    );
};

export default DocumentManager;
