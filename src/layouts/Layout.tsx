import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/50 relative overflow-x-hidden">
            {/* Background decorations */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <motion.div
                animate={{ marginLeft: collapsed ? 80 : 280 }}
                className="flex-1 flex flex-col min-h-screen transition-all duration-300"
            >
                <Topbar />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </motion.div>
        </div>
    );
};

export default Layout;
