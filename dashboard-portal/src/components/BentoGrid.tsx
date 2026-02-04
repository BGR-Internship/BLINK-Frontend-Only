import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, BookOpen, Clock, Fingerprint, FolderKanban, ShieldCheck, Mail, GraduationCap } from 'lucide-react';
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
const DUMMY_SERVICES = [
    { id: '1', title: 'Carolina', description: 'WifiX, LAN configurations', icon: 'Wifi', color: 'bg-blue-100 text-blue-600', link: 'https://carolina.bgrlogistik.id/' },
    { id: '2', title: 'Amanda', description: 'Course materials & assignments', icon: 'BookOpen', color: 'bg-emerald-100 text-emerald-600', link: 'https://amanda.bgrlogistik.id/' },
    { id: '3', title: 'Siska', description: 'Employee attendance logs', icon: 'Fingerprint', color: 'bg-indigo-100 text-indigo-600', link: 'https://siska.bgrlogistik.id/' },
    { id: '4', title: 'Wina', description: 'Campus social network', icon: 'GraduationCap', color: 'bg-purple-100 text-purple-600', link: 'https://wina.bgrlogistik.id/' },
    { id: '5', title: 'Monalisa', description: 'Email, Word, Excel, Teams', icon: 'Mail', color: 'bg-sky-100 text-sky-600', link: 'https://monalisa.bgrlogistik.id/' },
    { id: '6', title: 'Samantha', description: 'Adobe, Matlab software keys', icon: 'ShieldCheck', color: 'bg-orange-100 text-orange-600', link: 'https://helpdesk.bgrlogistik.id/?c=7' },
];

const IconMap: Record<string, any> = {
    Wifi, BookOpen, Clock, Fingerprint, FolderKanban, ShieldCheck, Mail, GraduationCap
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
            className="group relative bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden block"
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-4 relative z-0">
                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", service.color)}>
                    <Icon size={28} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{service.description}</p>
                </div>
            </div>
        </CardComponent>
    );
};

const BentoGrid = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating API Call
        setTimeout(() => {
            setServices(DUMMY_SERVICES);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="py-2">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Applications & Services</h2>
                <button className="text-sm font-medium text-primary hover:text-secondary transition-colors">View All</button>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-white/60 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {services.map((service, idx) => (
                        <ServiceCard key={service.id} service={service} index={idx} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BentoGrid;
