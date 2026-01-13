import { useAdmin } from '../../context/AdminContext';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

const SiteConfig = () => {
    const { siteConfig, updateSiteConfig } = useAdmin();

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Site Configuration</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Customize the visual assets and campaigns of the portal</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Banner Configuration */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Hero Banner</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Banner Title</label>
                            <input
                                type="text"
                                value={siteConfig.bannerTitle}
                                onChange={(e) => updateSiteConfig({ bannerTitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Banner Subtitle</label>
                            <textarea
                                value={siteConfig.bannerSubtitle}
                                onChange={(e) => updateSiteConfig({ bannerSubtitle: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Banner Image URL</label>
                            <input
                                type="text"
                                value={siteConfig.bannerImage}
                                onChange={(e) => updateSiteConfig({ bannerImage: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Popup Configuration */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Campaign Popup</h2>
                        <ToggleSwitch
                            isOn={siteConfig.popupActive}
                            onToggle={() => updateSiteConfig({ popupActive: !siteConfig.popupActive })}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Popup Title</label>
                            <input
                                type="text"
                                value={siteConfig.popupTitle}
                                onChange={(e) => updateSiteConfig({ popupTitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Popup Content</label>
                            <textarea
                                value={siteConfig.popupContent}
                                onChange={(e) => updateSiteConfig({ popupContent: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-800 dark:text-amber-200 text-sm border border-amber-100 dark:border-amber-900/30">
                            <span className="font-bold">Note:</span> The popup will only appear on page load if enabled.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SiteConfig;
