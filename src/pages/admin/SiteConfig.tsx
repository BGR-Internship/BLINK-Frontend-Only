import { useAdmin } from '../../context/AdminContext';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';

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

                    <div className="space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Popup Title</label>
                            <input
                                type="text"
                                value={siteConfig.popupTitle || ''}
                                onChange={(e) => updateSiteConfig({ popupTitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Enter announcement title"
                            />
                        </div>

                        {/* Image List */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Active Banners</label>
                            <div className="grid grid-cols-2 gap-4">
                                {siteConfig.popupImages.map((img, index) => (
                                    <div key={index} className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <img src={img} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => {
                                                const newImages = siteConfig.popupImages.filter((_, i) => i !== index);
                                                updateSiteConfig({ popupImages: newImages });
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Remove Image"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {siteConfig.popupImages.length === 0 && (
                                    <div className="col-span-2 py-8 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                        <span className="text-sm">No images added</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add New Image */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Add New Image URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="new-image-url"
                                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
                                    placeholder="https://example.com/banner.jpg"
                                />
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('new-image-url') as HTMLInputElement;
                                        if (input.value.trim()) {
                                            updateSiteConfig({ popupImages: [...siteConfig.popupImages, input.value.trim()] });
                                            input.value = '';
                                        }
                                    }}
                                    className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-xl transition-colors flex items-center gap-2 font-medium"
                                >
                                    <Plus size={20} />
                                    Add
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                Currently supports Image URLs. For local files, please add them to the project assets and reference them.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SiteConfig;
