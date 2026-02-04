import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import clsx from 'clsx';

// Reusing ToggleSwitch component
const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
    <div
        className={clsx(
            "w-14 h-8 flex items-center bg-slate-200 rounded-full p-1 cursor-pointer transition-colors duration-300",
            isOn && "bg-primary"
        )}
        onClick={onToggle}
    >
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            className="bg-white w-6 h-6 rounded-full shadow-md"
            style={{ marginLeft: isOn ? 'auto' : '0' }}
        />
    </div>
);

const SiteConfig = () => {
    const { siteConfig, updateSiteConfig } = useAdmin();

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Site Configuration</h1>
                <p className="text-slate-500 mt-2">Customize the visual assets and campaigns of the portal</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Banner Configuration */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Hero Banner</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Banner Title</label>
                            <input
                                type="text"
                                value={siteConfig.bannerTitle}
                                onChange={(e) => updateSiteConfig({ bannerTitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Banner Subtitle</label>
                            <textarea
                                value={siteConfig.bannerSubtitle}
                                onChange={(e) => updateSiteConfig({ bannerSubtitle: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Banner Image URL</label>
                            <input
                                type="text"
                                value={siteConfig.bannerImage}
                                onChange={(e) => updateSiteConfig({ bannerImage: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Popup Configuration */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">Campaign Popup</h2>
                        <ToggleSwitch
                            isOn={siteConfig.popupActive}
                            onToggle={() => updateSiteConfig({ popupActive: !siteConfig.popupActive })}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Popup Title</label>
                            <input
                                type="text"
                                value={siteConfig.popupTitle}
                                onChange={(e) => updateSiteConfig({ popupTitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Popup Content</label>
                            <textarea
                                value={siteConfig.popupContent}
                                onChange={(e) => updateSiteConfig({ popupContent: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="p-4 bg-amber-50 rounded-xl text-amber-800 text-sm">
                            <span className="font-bold">Note:</span> The popup will only appear on page load if enabled.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SiteConfig;
