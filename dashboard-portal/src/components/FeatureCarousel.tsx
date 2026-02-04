import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

import { useAdmin } from '../context/AdminContext';

const FeatureCarousel = () => {
    const { siteConfig } = useAdmin();
    const [current, setCurrent] = useState(0);

    const slides = [
        {
            id: 1,
            title: siteConfig.bannerTitle,
            subtitle: siteConfig.bannerSubtitle,
            color: "from-blue-600 to-indigo-600",
            image: siteConfig.bannerImage
        },
        {
            id: 2,
            title: "Welcome to New Semester 2026",
            subtitle: "Check your new schedule and academic status.",
            color: "from-primary to-emerald-500",
            image: ""
        },
        {
            id: 3,
            title: "Library Services Update",
            subtitle: "New digital collection available 24/7.",
            color: "from-orange-500 to-red-500",
            image: ""
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-full h-64 md:h-80 perspective-1000">
            <div className="absolute inset-0">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -10 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br ${slides[current].color} relative`}
                    >
                        {/* Abstract Shapes overlay */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 text-white z-10">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
                            >
                                {slides[current].title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg opacity-90 text-blue-50 max-w-2xl"
                            >
                                {slides[current].subtitle}
                            </motion.p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 right-8 flex gap-3 z-20">
                <button onClick={prevSlide} className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-all">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-all">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default FeatureCarousel;
