import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Calendar, MapPin, Camera, Save } from 'lucide-react';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        id: 'Demo User',
        nik: '12345678',
        email: 'demo@bgrlogistics.id',
        role: 'Frontend Developer',
        division: 'IT Development',
        joinDate: 'Jan 2023',
        location: 'Jakarta HQ',
        bio: 'Passionate about building beautiful and functional user interfaces.'
    });

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUserData(prev => ({
                    ...prev,
                    id: parsed.id || prev.id,
                    nik: parsed.nik || prev.nik
                }));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // Simulate API call
        console.log("Saved profile:", userData);
    };

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
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
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
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Personal Information</h2>
                            {isEditing && (
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
                                >
                                    <Save size={18} />
                                    <span>Save Changes</span>
                                </button>
                            )}
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
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
                                            disabled
                                            value={userData.nik}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
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
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
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
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Employment Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Department</p>
                                    <p className="font-medium text-slate-700 dark:text-slate-200">{userData.division}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Joined Date</p>
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
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Account Status</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 relative z-10">Your account is fully active and has access to all assigned modules.</p>

                        <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold border border-green-200 dark:border-green-500/30 relative z-10">
                            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mr-2 animate-pulse"></span>
                            Active Employee
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
