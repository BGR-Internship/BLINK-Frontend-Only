import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, BookOpen, Clock, Fingerprint, FolderKanban, Mail, GraduationCap, Search, Truck, Users, CreditCard, Key, Container } from 'lucide-react';
import clsx from 'clsx';

// Type definition simulating backend response
type Service = {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    link: string;
};

// Dummy Data
// Dummy Data removed - fetching from API


const IconMap: Record<string, any> = {
    Wifi, BookOpen, Clock, Fingerprint, FolderKanban, Mail, GraduationCap, Truck, Users, CreditCard, Key, Container
};

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
    const Icon = IconMap[service.icon] || FolderKanban;

    const CardComponent = service.link ? motion.a : motion.div;
    const linkProps = service.link ? { href: service.link, target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
        <CardComponent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            {...linkProps}
            className="group relative bg-white dark:bg-slate-800 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden block"
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-4 relative z-0">
                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", service.color)}>
                    <Icon size={28} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{service.description}</p>
                </div>
            </div>
        </CardComponent>
    );
};

const BentoGrid = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/services');
                if (!res.ok) throw new Error('Failed to fetch services');
                const data = await res.json();
                setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
                // Fallback to empty or could show error state
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Aplikasi & Layanan</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Akses cepat sistem perusahaan</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari layanan..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-slate-400 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-white/60 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {services.length > 0 ? (
                        services.map((service, idx) => (
                            <ServiceCard key={service.id} service={service} index={idx} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-slate-400">
                            <FolderKanban size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Tidak ada layanan ditemukan.</p>
                            <p className="text-xs mt-2">Pastikan database terhubung.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BentoGrid;
