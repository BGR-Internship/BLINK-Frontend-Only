import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import CampaignPopup from '../components/CampaignPopup';
import Chatbot from '../components/Chatbot';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    variant?: 'dashboard' | 'auth';
}

const Layout = ({ children, variant = 'dashboard' }: LayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auth Layout
    if (variant === 'auth') {
        return (
            <div className="min-h-screen bg-slate-50/50 relative overflow-hidden flex items-center justify-center p-4">
                {/* Background decorations */}
                <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
                <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-x-hidden">
            {/* Background decorations */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

            <CampaignPopup />

            {/* Chatbot only shows on dashboard variant */}
            <Chatbot />

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileMenuOpen}
                setMobileOpen={setMobileMenuOpen}
            />

            <motion.div
                animate={{ marginLeft: isMobile ? 0 : (collapsed ? 80 : 280) }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col min-h-screen transition-all duration-300 overflow-x-hidden"
            >
                <div>
                    <Topbar onMenuClick={() => setMobileMenuOpen(true)} />

                    <main className="flex-1 p-4 md:p-8">
                        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
                            {children}
                        </div>
                    </main>
                </div>
            </motion.div>
        </div>
    );
};

export default Layout;
