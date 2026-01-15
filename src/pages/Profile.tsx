import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Calendar, MapPin, Camera, Save } from 'lucide-react';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({
        id: '',
        nik: '',
        email: '',
        role: '',
        division: '',
        joinDate: '',
        location: '',
        bio: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user');
                if (res.ok) {
                    const data = await res.json();
                    // Map DB snake_case columns to component camelCase if needed, 
                    // or ideally ensure API returns matching keys. 
                    // Assuming API implementation in api/user.ts returns raw rows which match keys or we map them here.
                    // Based on our schema: full_name -> id(name), nik->nik, email->email, role->role, division->division, join_date->joinDate, location->location, bio->bio
                    // Let's assume strict mapping for now or fallback.
                    setUserData({
                        id: data.full_name || 'User',
                        nik: data.nik || '',
                        email: data.email || '',
                        role: data.role || '',
                        division: data.division || '',
                        joinDate: data.join_date || '', // Note: schema has join_date
                        location: data.location || '',
                        bio: data.bio || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: userData.id, // mapped to full_name in API
                    nik: userData.nik,
                    email: userData.email,
                    location: userData.location,
                    bio: userData.bio
                })
            });

            if (res.ok) {
                setIsEditing(false);
                // Optional: Show success toast
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    if (isLoading) {
        return <div className="w-full h-96 flex items-center justify-center animate-pulse text-slate-400">Loading Profile...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto space-y-8 pb-12"
        >
            {/* Header Section with Cover */}
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                {/* Cover Image */}
                <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-cyan-500 relative">
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Profile Info Overlay */}
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-4 flex justify-between items-end">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden bg-white shadow-md">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${userData.id}&background=1893A0&color=fff&size=256`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-2 right-2 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors shadow-lg">
                                <Camera size={16} />
                            </button>
                        </div>

                        <div className="mb-2 hidden sm:block">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-6 py-2.5 rounded-xl font-medium transition-all bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-primary text-slate-700 dark:text-slate-200 hover:text-primary"
                            >
                                {isEditing ? 'Batal' : 'Edit Profil'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{userData.id}</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{userData.role} • {userData.division}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Info Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Informasi Pribadi</h2>
                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
                                >
                                    <Save size={18} />
                                    <span>Simpan Perubahan</span>
                                </button>
                            )}
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={userData.id}
                                            onChange={(e) => setUserData({ ...userData, id: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">NIK</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            disabled // NIK should likely be read-only
                                            value={userData.nik}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Alamat Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Lokasi</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={userData.location}
                                            onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                                <textarea
                                    disabled={!isEditing}
                                    value={userData.bio}
                                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all resize-none"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Key Details */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Detail Pekerjaan</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Departemen</p>
                                    <p className="font-medium text-slate-700 dark:text-slate-200">{userData.division}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tanggal Bergabung</p>
                                    <p className="font-medium text-slate-700 dark:text-slate-200">{userData.joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <User size={120} className="text-slate-800 dark:text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Status Akun</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 relative z-10">Akun Anda aktif dan memiliki akses ke semua modul yang ditugaskan.</p>

                        <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold border border-green-200 dark:border-green-500/30 relative z-10">
                            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mr-2 animate-pulse"></span>
                            Karyawan Aktif
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
