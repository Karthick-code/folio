import React, { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';

export const BusinessDetailsForm = ({ business, onChange }) => {
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert('Logo file size is over 2.5MB. Please choose a smaller image for best PDF export performance.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange({ ...business, logoUrl: event.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({ ...business, logoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white/95 rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_-4px_rgba(40,30,20,0.04)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-900/60 font-medium text-sm">01</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Business Profile</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Your studio or commercial identity</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name and Logo Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Business / Studio Name <span className="text-amber-800">*</span>
            </label>
            <input
              type="text"
              value={business.name}
              onChange={(e) => onChange({ ...business, name: e.target.value })}
              placeholder="e.g. ENDLESS Moments Studio or Acme Design"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Brand Logo
            </label>
            {business.logoUrl ? (
              <div className="flex items-center gap-2 p-1.5 border border-stone-200/90 rounded-xl bg-stone-50/80">
                <img
                  src={business.logoUrl}
                  alt="Logo preview"
                  className="h-8 w-8 object-contain rounded-lg bg-white border border-stone-200 p-0.5"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-stone-700 truncate">Logo attached</p>
                  <p className="text-[10px] text-stone-400">Processed locally</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-stone-300 hover:border-stone-500 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-50/40 hover:bg-stone-50 transition-all"
                >
                  <Upload className="w-3 h-3 text-stone-400" />
                  <span>Attach Logo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">
            Registered Address
          </label>
          <textarea
            rows={2}
            value={business.address}
            onChange={(e) => onChange({ ...business, address: e.target.value })}
            placeholder="Studio location, street, suite, city, state, postal code"
            className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 resize-none"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={business.email}
              onChange={(e) => onChange({ ...business, email: e.target.value })}
              placeholder="inquiries@yourstudio.com"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={business.phone}
              onChange={(e) => onChange({ ...business, phone: e.target.value })}
              placeholder="+91 98451 00000 or (555) 000-0000"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 font-mono-num"
            />
          </div>
        </div>

        {/* Website & Tax IDs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Website
            </label>
            <input
              type="text"
              value={business.website}
              onChange={(e) => onChange({ ...business, website: e.target.value })}
              placeholder="www.yourstudio.com"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              GSTIN / Tax Registration ID
            </label>
            <input
              type="text"
              value={business.taxId}
              onChange={(e) => onChange({ ...business, taxId: e.target.value })}
              placeholder="e.g. 29AABCU9603R1ZM"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              PAN / Business ID
            </label>
            <input
              type="text"
              value={business.panOrBusinessId}
              onChange={(e) => onChange({ ...business, panOrBusinessId: e.target.value })}
              placeholder="e.g. AABCU9603R"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 font-mono-num"
            />
          </div>
        </div>

        {/* Extra Tagline or Info */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">
            Tagline or Studio Specialties (Optional)
          </label>
          <input
            type="text"
            value={business.extraInfo}
            onChange={(e) => onChange({ ...business, extraInfo: e.target.value })}
            placeholder="e.g. Candid Wedding Stories, Editorial Portraits & Cinematic Films"
            className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
          />
        </div>
      </div>
    </div>
  );
};
