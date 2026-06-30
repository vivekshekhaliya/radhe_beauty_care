import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/Modal';
import MediaManager from '../components/MediaManager';
import { toast } from 'sonner';

interface SettingsData {
  website_name: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  address: string;
  google_map_link: string;
  business_hours: string;
  logo_path: string | null;
  favicon_path: string | null;
  footer_text: string;
  seo_metadata: {
    title: string;
    description: string;
    keywords: string;
  };
}

const SettingsPage: React.FC = () => {
  const [formData, setFormData] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Media Manager Modal
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'logo_path' | 'favicon_path' | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/settings');
      if (response.data.success) {
        setFormData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSubmitLoading(true);
    const payload = {
      ...formData,
      seo_metadata: JSON.stringify(formData.seo_metadata) // stringify JSON
    };

    try {
      const response = await api.post('/settings', payload);
      if (response.data.success) {
        toast.success('Website settings updated successfully.');
        setFormData(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to update website settings.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleSelectMedia = (url: string) => {
    if (formData && mediaTarget) {
      setFormData({
        ...formData,
        [mediaTarget]: url
      });
    }
    setIsMediaModalOpen(false);
    setMediaTarget(null);
  };

  if (isLoading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-xs uppercase tracking-widest font-sans font-bold">Loading configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-white tracking-wide">Website Settings</h2>
        <p className="text-xs text-muted font-sans font-light mt-1">Configure global details, business contact cards, social links, logo, and general SEO metadata</p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: General & Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Info Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-5">
              <h3 className="text-sm font-serif font-bold text-primary border-b border-white/5 pb-2.5 flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                <span>General Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Website Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.website_name}
                    onChange={(e) => setFormData({ ...formData, website_name: e.target.value })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Business Hours</label>
                  <input
                    type="text"
                    value={formData.business_hours}
                    onChange={(e) => setFormData({ ...formData, business_hours: e.target.value })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Contact Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Business Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Google Maps Embed Link</label>
                <input
                  type="text"
                  value={formData.google_map_link}
                  onChange={(e) => setFormData({ ...formData, google_map_link: e.target.value })}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Footer Copyright Text</label>
                <input
                  type="text"
                  value={formData.footer_text}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Social Links Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-5">
              <h3 className="text-sm font-serif font-bold text-primary border-b border-white/5 pb-2.5">
                Social Media Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Facebook URL</label>
                  <input
                    type="text"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">YouTube Channel</label>
                  <input
                    type="text"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Assets & SEO */}
          <div className="space-y-6">
            
            {/* Logos & Assets */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-5">
              <h3 className="text-sm font-serif font-bold text-primary border-b border-white/5 pb-2.5">
                Site Logos & Assets
              </h3>

              {/* Logo Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">Website Header Logo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.logo_path || ''}
                    onChange={(e) => setFormData({ ...formData, logo_path: e.target.value || null })}
                    placeholder="Logo path..."
                    className="flex-grow px-3 py-2.5 bg-[#050505] border border-white/10 text-white rounded-xl text-xs outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('logo_path');
                      setIsMediaModalOpen(true);
                    }}
                    className="px-3.5 bg-primary hover:bg-peacock text-black hover:text-white text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Select
                  </button>
                </div>
                {formData.logo_path && (
                  <div className="w-20 p-2 bg-dark rounded-xl border border-white/10 flex items-center justify-center">
                    <img 
                      src={formData.logo_path.startsWith('http') ? formData.logo_path : `http://localhost:8000/storage/${formData.logo_path}`} 
                      alt="Logo Thumb" 
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Favicon Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">Site Favicon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.favicon_path || ''}
                    onChange={(e) => setFormData({ ...formData, favicon_path: e.target.value || null })}
                    placeholder="Favicon path..."
                    className="flex-grow px-3 py-2.5 bg-[#050505] border border-white/10 text-white rounded-xl text-xs outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('favicon_path');
                      setIsMediaModalOpen(true);
                    }}
                    className="px-3.5 bg-primary hover:bg-peacock text-black hover:text-white text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Select
                  </button>
                </div>
                {formData.favicon_path && (
                  <div className="w-12 h-12 bg-dark rounded-xl border border-white/10 flex items-center justify-center">
                    <img 
                      src={formData.favicon_path.startsWith('http') ? formData.favicon_path : `http://localhost:8000/storage/${formData.favicon_path}`} 
                      alt="Favicon Thumb" 
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-5">
              <h3 className="text-sm font-serif font-bold text-primary border-b border-white/5 pb-2.5">
                Default Site SEO
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_metadata?.title || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo_metadata: { ...formData.seo_metadata, title: e.target.value }
                  })}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">SEO Meta Keywords</label>
                <input
                  type="text"
                  value={formData.seo_metadata?.keywords || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo_metadata: { ...formData.seo_metadata, keywords: e.target.value }
                  })}
                  placeholder="comma separated values"
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-primary">SEO Meta Description</label>
                <textarea
                  value={formData.seo_metadata?.description || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo_metadata: { ...formData.seo_metadata, description: e.target.value }
                  })}
                  rows={3}
                  className="px-4 py-3 bg-[#050505] border border-white/10 focus:border-primary text-white outline-none rounded-xl text-sm resize-none"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitLoading}
            className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-peacock disabled:bg-primary/50 text-black hover:text-white font-sans font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            {isSubmitLoading ? (
              <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            ) : (
              <Save className="w-4.5 h-4.5" />
            )}
            <span>Save All Configurations</span>
          </button>
        </div>
      </form>

      {/* Media Asset Modal */}
      <Modal
        isOpen={isMediaModalOpen}
        onClose={() => { setIsMediaModalOpen(false); setMediaTarget(null); }}
        title="Select Media Asset"
        size="2xl"
      >
        <MediaManager onSelect={handleSelectMedia} isModalMode={true} />
      </Modal>

    </div>
  );
};

export default SettingsPage;
