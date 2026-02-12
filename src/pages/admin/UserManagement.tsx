
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Edit2, Shield, Filter, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { User } from '../../context/AuthContext';
import ConfirmModal from '../../components/ui/ConfirmModal';

// Mock Data - Added required 'nik' field
const MOCK_USERS: User[] = [
    { id: '1', nik: '12345', name: 'Super Admin', email: 'superadmin@blink.id', role: 'super_admin', division: 'IT Development' },
    { id: '2', nik: '2001', name: 'Admin User', email: 'admin@blink.id', role: 'admin', division: 'Human Capital' },
    { id: '3', nik: '3005', name: 'Regular User', email: 'user@blink.id', role: 'user', division: 'Logistics' },
    { id: '4', nik: '4002', name: 'Rafi Zandrapribumi', email: 'zandra@upnvyk.id', role: 'admin', division: 'Finance' },
    { id: '5', nik: '5001', name: 'Siti Aminah', email: 'siti@blink.id', role: 'admin', division: 'General Affair' },
];

const RoleBadge = ({ role }: { role: string }) => {
    const styles: Record<string, string> = {
        super_admin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        admin: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        user: 'bg-slate-100 text-slate-700 border-slate-200'
    };

    const labels: Record<string, string> = {
        super_admin: 'Super Admin',
        admin: 'Admin',
        user: 'User'
    };

    return (
        <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[role] || styles.user)}>
            {labels[role] || role}
        </span>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredUsers = users.filter(user => {
        // Safe access to email since it's optional in User type
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            setUsers(prev => prev.filter(u => u.id !== deleteId));
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {/* <Shield className="text-secondary" /> */}
                        Manajemen User
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Kelola akses dan peran pengguna</p>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari pengguna..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="all">Semua Peran</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Pengguna</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">Peran</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 hidden lg:table-cell">Divisi</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                            <AnimatePresence>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-600">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800 dark:text-white">{user.name}</div>
                                                    <div className="text-slate-500 text-xs">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 hidden lg:table-cell">
                                            {user.division}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full w-fit">
                                                <CheckCircle2 size={12} /> Aktif
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg text-slate-500 transition-colors" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 rounded-lg text-slate-500 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                            <Shield size={48} className="mb-4 opacity-20" />
                            <p>Tidak ada pengguna ditemukan.</p>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Hapus Pengguna?"
                message="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                variant="danger"
            />
        </div>
    );
};

export default UserManagement;
