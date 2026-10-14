import React, { useState, useEffect } from 'react';
import { formatInvoiceNumber, saveNumberingSettings } from '../utils/invoiceNumber.js';
import { X, Check, AlertCircle } from 'lucide-react';

export const NumberingSettingsModal = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
}) => {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings, isOpen]);

  if (!isOpen) return null;

  const previewFormatted = formatInvoiceNumber(settings);

  const handleSave = () => {
    saveNumberingSettings(settings);
    onSave(settings, previewFormatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#FAF9F6] rounded-2xl shadow-xl max-w-md w-full border border-stone-200/90 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/60 bg-stone-100/60">
          <div>
            <h3 className="font-serif-display font-medium text-stone-900 text-base">Invoice Numbering Setup</h3>
            <p className="text-xs text-stone-500">Configure sequence & auto-increment</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Live Preview Box */}
          <div className="bg-white border border-stone-200/80 rounded-xl p-4 text-center shadow-2xs">
            <span className="text-[11px] font-medium text-stone-500 uppercase tracking-widest block mb-1">
              Next Invoice Number Preview
            </span>
            <div className="text-2xl font-semibold font-mono-num text-stone-900 tracking-wider">
              {previewFormatted}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Prefix Code
              </label>
              <input
                type="text"
                value={settings.prefix}
                onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
                placeholder="e.g. INV or EM"
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">e.g. INV, EM, 2026</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Next Sequence Number
              </label>
              <input
                type="number"
                min="1"
                value={settings.nextNumber}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    nextNumber: Math.max(1, parseInt(e.target.value, 10) || 1),
                  })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 font-mono-num"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Auto-increments next</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Separator
              </label>
              <select
                value={settings.separator}
                onChange={(e) => setSettings({ ...settings, separator: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
              >
                <option value="-">Hyphen (-)</option>
                <option value="/">Slash (/)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Dot (.)</option>
                <option value="">None</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Calendar Year Prefix
              </label>
              <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.includeYear}
                  onChange={(e) => setSettings({ ...settings, includeYear: e.target.checked })}
                  className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-4 h-4"
                />
                <span className="text-xs text-stone-700 font-medium">Add {new Date().getFullYear()}</span>
              </label>
            </div>
          </div>

          {/* Auto increment toggle */}
          <div className="flex items-center justify-between p-3.5 bg-white border border-stone-200/80 rounded-xl shadow-2xs">
            <div>
              <span className="font-medium text-stone-800 text-xs block">Auto-Increment on Download</span>
              <span className="text-[11px] text-stone-500">Advance to next number upon generating PDF</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoIncrement}
                onChange={(e) => setSettings({ ...settings, autoIncrement: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900"></div>
            </label>
          </div>

          {/* Local Storage Notice */}
          <div className="flex items-start gap-2 text-[11px] text-stone-600 bg-stone-100/80 p-3 rounded-xl border border-stone-200/60">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-800 mt-0.5" />
            <p>
              Your invoice numbering sequence is saved locally in this browser. Clearing browser cookies or cache may reset your numbering configuration.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-stone-100/60 border-t border-stone-200/60">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
