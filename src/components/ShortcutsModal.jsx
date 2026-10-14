import React from 'react';
import { Command, X } from 'lucide-react';

export const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    {
      keys: [`${modKey}`, 'S'],
      action: 'Save Draft Locally',
      description: 'Saves current invoice state in local browser storage with zero external transmission',
    },
    {
      keys: [`${modKey}`, 'P'],
      action: 'Print / Vector PDF',
      description: 'Invokes browser print engine formatted for crisp vector A4 document sheets',
    },
    {
      keys: [`${modKey}`, 'Enter'],
      action: 'Download A4 PDF',
      description: 'Executes high-dpi client-side render and downloads the finalized PDF document',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#FAF9F6] rounded-2xl shadow-xl max-w-md w-full border border-stone-200/90 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/60 bg-stone-100/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white text-stone-800 border border-stone-200 shadow-2xs">
              <Command className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display font-medium text-stone-900 text-base">Studio Shortcuts</h3>
              <p className="text-xs text-stone-500">Accelerate your invoice workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 divide-y divide-stone-200/60">
          {shortcuts.map((sc, i) => (
            <div key={i} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-900">{sc.action}</p>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{sc.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                {sc.keys.map((k, ki) => (
                  <kbd
                    key={ki}
                    className="px-2 py-1 text-xs font-mono font-medium text-stone-700 bg-white border border-stone-300 rounded-md shadow-2xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-stone-100/60 border-t border-stone-200/60 text-xs text-stone-500">
          <span>Available across entire application</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-2xs transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
