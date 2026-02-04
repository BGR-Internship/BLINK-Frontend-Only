import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Trash2, FileText, Upload, Plus } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentManager = () => {
    const { documents, addDocument, deleteDocument } = useAdmin();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [division, setDivision] = useState('Finance');
    const [classification, setClassification] = useState<'Public' | 'Private'>('Public');

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        addDocument({
            title,
            division,
            classification,
            fileUrl: '#'
        });

        // Reset
        setTitle('');
        setDivision('Finance');
        setClassification('Public');
        setIsFormOpen(false);
    };

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Document Management</h1>
                    <p className="text-slate-500 mt-2">Upload and manage division documents</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    <span>Upload Document</span>
                </button>
            </header>

            {/* Upload Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleUpload} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">New Document</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Document Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Q1 Financial Report"
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Division</label>
                                    <select
                                        value={division}
                                        onChange={(e) => setDivision(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                    >
                                        <option value="Finance">Finance</option>
                                        <option value="HR">Human Resources</option>
                                        <option value="IT">IT & Tech</option>
                                        <option value="Legal">Legal</option>
                                        <option value="Operations">Operations</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Classification</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={classification === 'Public'}
                                                onChange={() => setClassification('Public')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span>Public</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={classification === 'Private'}
                                                onChange={() => setClassification('Private')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span>Private</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">File Upload</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer">
                                        <Upload size={24} className="mb-2" />
                                        <span className="text-sm">Click to upload PDF</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">
                                    Upload Document
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Document List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">Document</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Division</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Date</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {documents.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                            <FileText size={20} />
                                        </div>
                                        <span className="font-medium text-slate-700">{doc.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{doc.division}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{doc.date}</td>
                                <td className="px-6 py-4">
                                    <span className={clsx(
                                        "px-2.5 py-1 rounded-full text-xs font-medium",
                                        doc.classification === 'Public' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {doc.classification}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => deleteDocument(doc.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Document"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {documents.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center">
                                        <FileText size={48} className="mb-4 opacity-20" />
                                        <p>No documents found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentManager;
