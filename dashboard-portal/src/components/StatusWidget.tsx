import { motion } from 'framer-motion';
import { Clock, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';

const StatusWidget = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="space-y-6">
            {/* User Status Card */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start gap-4"
            >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    FZ
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800">Fadhil Zaky Budianto</h3>
                    <p className="text-xs text-slate-500 mb-2">50000216</p>
                    <button className="text-xs font-medium text-primary hover:text-secondary transition-colors flex items-center gap-1">
                        Account Settings <MoreHorizontal size={14} />
                    </button>
                </div>
            </motion.div>

            {/* Calendar / Date Widget */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
                <div className="flex items-center gap-2 mb-4 text-primary">
                    <CalendarIcon size={20} />
                    <h3 className="font-bold text-slate-800">{dateStr}</h3>
                </div>

                <div className="space-y-3">
                    <div className="pl-4 border-l-2 border-slate-200 py-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Upcoming</p>
                        <p className="text-sm font-medium text-slate-800">System Maintenance</p>
                        <div className="flex items-center gap-1 text-xs text-secondary mt-1">
                            <Clock size={12} /> 22:00 - 23:30
                        </div>
                    </div>
                    <div className="pl-4 border-l-2 border-primary py-1 bg-primary/5 rounded-r-lg">
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Today</p>
                        <p className="text-sm font-medium text-slate-800">Out of Work Period</p>
                        <p className="text-xs text-slate-500 mt-1">Enjoy your holiday!</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StatusWidget;
