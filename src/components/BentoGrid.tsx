
import { useEffect, useState } from 'react';

import * as LucideIcons from 'lucide-react';
import clsx from 'clsx';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    defaultDropAnimationSideEffects,
    DropAnimation
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grid, Check, X, Search } from 'lucide-react'; // Import UI icons explicitly
import { useAuth } from '../context/AuthContext';

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
    { id: '1', title: 'VINA', description: 'Visitor integrated and administration', icon: 'Truck', color: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300', link: 'https://carolina.bgrlogistik.id/' },
    { id: '2', title: 'RAISA', description: 'Recruitment Internal Assessment Application', icon: 'Users', color: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300', link: 'https://amanda.bgrlogistik.id/' },
    { id: '3', title: 'SISKA', description: 'Sistem Informasi Kepegawaian', icon: 'Fingerprint', color: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300', link: 'https://siska.bgrlogistik.id/' },
    { id: '4', title: 'MADONA', description: 'Manajemen Dokumen Pembayaran Nasional ', icon: 'CreditCard', color: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300', link: 'https://wina.bgrlogistik.id/' },
    { id: '5', title: 'MONALISA', description: 'Monitoring, Asset, Lisense Application', icon: 'Key', color: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300', link: 'https://monalisa.bgrlogistik.id/' },
    { id: '6', title: 'DENADA', description: 'Depo Manajemen dan Agency', icon: 'Container', color: 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300', link: 'https://helpdesk.bgrlogistik.id/?c=7' },
];

const COLOR_PALETTE = [
    'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300',
    'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300',
    'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300',
    'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300',
    'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300',
    'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300',
    'bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300',
    'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300',
];

// Helper to get icon safely
const getIcon = (iconName: string) => {
    // 1. Remove XML tags if present e.g. <Truck /> -> Truck
    const cleanName = iconName.replace(/[<>/\s]/g, '');

    // 2. Fetch from Lucide
    // @ts-ignore
    const IconComponent = LucideIcons[cleanName];

    // 3. Fallback
    return IconComponent || LucideIcons.FolderKanban;
};

// --- Presentational Card Component ---
const ServiceCard = ({ service, isEditing, isOverlay = false }: { service: Service; isEditing: boolean; isOverlay?: boolean }) => {
    const Icon = getIcon(service.icon);

    // In edit mode or overlay, we use div to prevent clicking
    const Component = (!isEditing && service.link) ? 'a' : 'div';
    const linkProps = (!isEditing && service.link) ? { href: service.link, target: '_blank', rel: 'noopener noreferrer' } : {};

    return (
        <Component
            {...linkProps}
            className={clsx(
                "group relative bg-white dark:bg-slate-900/50 rounded-3xl p-4 md:p-6 h-full flex flex-col items-center text-center backdrop-blur-sm",
                // Light mode: Shadow for depth, no border for clean look. Dark mode: Border remains.
                "shadow-md dark:shadow-none border-b-4 border-transparent dark:border-slate-800",
                !isEditing && !isOverlay && "hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 dark:hover:border-primary/50 transition-all duration-300 cursor-pointer",
                isEditing && "cursor-grab",
                isOverlay && "shadow-2xl scale-105 ring-2 ring-primary/50 cursor-grabbing bg-white/95 backdrop-blur-xl z-50 transform-gpu"
            )}
        >
            {/* Shimmer Effect (Only in view mode)
            {!isEditing && !isOverlay && (
                <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent z-10 pointer-events-none" />
            )} */}

            {/* Edit Mode Indicator */}
            {isEditing && (
                <div className="absolute top-2 right-2 text-slate-300">
                    <Grid size={16} />
                </div>
            )}

            <div className="flex flex-col items-center space-y-4 relative z-0 flex-1 w-full">
                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform", !isEditing && "group-hover:scale-110", service.color)}>
                    <Icon size={28} />
                </div>
                <div>
                    <h3 className={clsx("font-bold text-slate-800 dark:text-white mb-1 transition-colors", !isEditing && "group-hover:text-primary")}>{service.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{service.description}</p>
                </div>
            </div>
        </Component>
    );
};

// --- Sortable Wrapper ---
const SortableServiceCard = ({ service, isEditing }: { service: Service; isEditing: boolean }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: service.id,
        disabled: !isEditing,
        animateLayoutChanges: () => false, // Important for DragOverlay smoothness
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={clsx("h-full outline-none", isDragging ? "opacity-50 scale-95 grayscale" : "")}>
            <ServiceCard service={service} isEditing={isEditing} />
        </div>
    );
};

const BentoGrid = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [defaultServices, setDefaultServices] = useState<Service[]>([]); // Store default order
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'super_admin';

    // Reset editing if user logs out or role changes
    useEffect(() => {
        if (!isSuperAdmin && isEditing) {
            setIsEditing(false);
        }
    }, [isSuperAdmin, isEditing]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 8,
                distance: 8,
                direction: 'vertical',
                pointerTypes: ['touch']
            }
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const API_URL = import.meta.env.VITE_POD1_API_URL || 'http://localhost:3000/api/apps';
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();

                // Map DB data to frontend model
                const mappedServices: Service[] = data.map((item: any, index: number) => ({
                    id: String(item.Id),
                    title: item.Nama_Aplikasi || 'No Title',
                    description: item.Deskripsi || item.Deskripsi_Aplikasi || '',
                    icon: item.Icon || 'FolderKanban',
                    link: item.Link || '#',
                    // Cycle through colors
                    color: COLOR_PALETTE[index % COLOR_PALETTE.length]
                })).filter((s: Service) => s.id && s.title && s.title !== 'No Title');

                setDefaultServices(mappedServices);

                // Check for saved order
                const savedOrder = localStorage.getItem('blink_services_order');
                if (savedOrder) {
                    try {
                        const parsedOrder: Service[] = JSON.parse(savedOrder);

                        // Reconstruct order
                        const fetchedMap = new Map(mappedServices.map(s => [s.id, s]));
                        const reordered: Service[] = [];
                        const savedIds = new Set();

                        parsedOrder.forEach(savedItem => {
                            // Verify ID exists in current data AND hasn't been added yet (prevent duplicates)
                            if (fetchedMap.has(savedItem.id) && !savedIds.has(savedItem.id)) {
                                reordered.push(fetchedMap.get(savedItem.id)!);
                                savedIds.add(savedItem.id);
                            }
                        });

                        mappedServices.forEach(s => {
                            if (!savedIds.has(s.id)) {
                                reordered.push(s);
                            }
                        });

                        setServices(reordered);
                    } catch (e) {
                        console.error("Failed to restore order:", e);
                        setServices(mappedServices);
                    }
                } else {
                    setServices(mappedServices);
                }
            } catch (err) {
                console.error("Error fetching services:", err);
                setServices(DUMMY_SERVICES);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            setServices((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem('blink_services_order', JSON.stringify(newOrder));
                return newOrder;
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const handleReset = () => {
        if (confirm("Reset layout to default?")) {
            setServices(defaultServices);
            localStorage.removeItem('blink_services_order');
            setIsEditing(false);
        }
    };

    const activeService = services.find(s => s.id === activeId);

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Drop Animation config for DragOverlay
    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.4',
                },
            },
        }),
    };

    return (
        <div className="py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        Aplikasi & Layanan
                        {isEditing && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Edit Mode</span>}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Akses cepat sistem perusahaan</p>
                </div>

                <div className="flex items-center gap-3">
                    {isSuperAdmin && (
                        <>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                    isEditing
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                )}
                            >
                                {isEditing ? <Check size={16} /> : <Grid size={16} />}
                                {isEditing ? 'Selesai' : 'Personalize'}
                            </button>

                            {isEditing && (
                                <button
                                    onClick={handleReset}
                                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                    title="Reset Layout"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </>
                    )}

                    <div className="relative w-full md:w-64 hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari layanan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={isEditing}
                            className={clsx(
                                "w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-slate-400 text-slate-700 dark:text-slate-200 transition-all shadow-sm",
                                isEditing && "opacity-50 cursor-not-allowed"
                            )}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-48 bg-white/60 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext items={filteredServices} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {filteredServices.map((service) => (
                                <SortableServiceCard
                                    key={service.id}
                                    service={service}
                                    isEditing={isEditing}
                                />
                            ))}
                        </div>
                    </SortableContext>

                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeId && activeService ? (
                            <ServiceCard service={activeService} isEditing={true} isOverlay={true} />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
};

export default BentoGrid;
