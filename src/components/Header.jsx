// import React from 'react';
// import { Plus, RotateCcw, Bookmark, Sparkles, Command, FileText, ChevronDown } from 'lucide-react';

// export const Header = ({
//   onNewInvoice,
//   onReset,
//   onSaveDraft,
//   onLoadPreset,
//   hasSavedDraft,
//   onLoadDraft,
//   onOpenShortcuts,
// }) => {
//   const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().includes('MAC');
//   const modSymbol = isMac ? '⌘' : 'Ctrl+';

//   return (
//     <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl no-print">
//       <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 xl:px-8">
//         <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label="Folio home">
//           <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/10 transition-transform group-hover:-rotate-3">
//             <FileText className="h-5 w-5" strokeWidth={1.8} />
//           </span>
//           <span className="min-w-0">
//             <span className="block text-[19px] font-bold leading-5 tracking-[-0.045em] text-slate-950">folio<span className="text-indigo-600">.</span></span>
//             <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500 sm:block">Invoice studio</span>
//           </span>
//         </a>

//         <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 lg:flex">
//           <span className="flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400"><Sparkles className="h-3.5 w-3.5" /> Start with</span>
//           <button type="button" onClick={() => onLoadPreset('endless')} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm" title="Photography studio sample">Photography</button>
//           <button type="button" onClick={() => onLoadPreset('freelancer')} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm">Freelancer</button>
//           <button type="button" onClick={() => onLoadPreset('blank')} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm">Blank</button>
//         </div>

//         <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
//           {hasSavedDraft && <button type="button" onClick={onLoadDraft} className="hidden rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 sm:inline-flex">Restore</button>}
//           <button type="button" onClick={onSaveDraft} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" title={`Save draft locally (${modSymbol}S)`}>
//             <Bookmark className="h-4 w-4 text-slate-500" /><span className="hidden sm:inline">Save draft</span>
//           </button>
//           <button type="button" onClick={onNewInvoice} className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white shadow-md shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 sm:px-4">
//             <Plus className="h-4 w-4" /><span>New invoice</span>
//           </button>
//           {onOpenShortcuts && <button type="button" onClick={onOpenShortcuts} className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 md:inline-flex" title="Keyboard shortcuts"><Command className="h-4 w-4" /></button>}
//           <button type="button" onClick={onReset} className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:inline-flex" title="Reset invoice"><RotateCcw className="h-4 w-4" /></button>
//         </div>
//       </div>
//       <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2 lg:hidden">
//         <div className="mx-auto flex max-w-[1500px] items-center gap-2 overflow-x-auto text-xs">
//           <span className="shrink-0 font-semibold text-slate-400">QUICK START</span>
//           <button type="button" onClick={() => onLoadPreset('endless')} className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">Photography</button>
//           <button type="button" onClick={() => onLoadPreset('freelancer')} className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">Freelancer</button>
//           <button type="button" onClick={() => onLoadPreset('blank')} className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">Blank invoice</button>
//         </div>
//       </div>
//     </header>
//   );
// };

import React from 'react';
import { Plus, RotateCcw, Bookmark, Sparkles, Command, FileText, ChevronDown } from 'lucide-react';

export const Header = ({
  onNewInvoice,
  onReset,
  onSaveDraft,
  onLoadPreset,
  hasSavedDraft,
  onLoadDraft,
  onOpenShortcuts,
}) => {
  const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().includes('MAC');
  const modSymbol = isMac ? '⌘' : 'Ctrl+';

  return (
    <header className="sticky top-100 z-1000 border-b border-slate-200 bg-white [backdrop-filter:none] no-print">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 xl:px-8">
        <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label="Folio home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/10 transition-transform group-hover:-rotate-3">
            <FileText className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block text-[19px] font-bold leading-5 tracking-[-0.045em] text-slate-950">folio<span className="text-indigo-600">.</span></span>
            <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500 sm:block">Invoice studio</span>
          </span>
        </a>

        {/* <div className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 lg:flex">
          <span className="flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400"><Sparkles className="h-3.5 w-3.5" /> Start with</span>
          <button type="button" onClick={() => onLoadPreset('endless')} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm" title="Photography studio sample">Photography</button>
          <button type="button" onClick={() => onLoadPreset('freelancer')} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm">Freelancer</button>
          <button type="button" onClick={() => onLoadPreset('blank')} className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm">Blank</button>
        </div> */}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {hasSavedDraft && <button type="button" onClick={onLoadDraft} className="hidden rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 sm:inline-flex">Restore</button>}
          <button type="button" onClick={onSaveDraft} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" title={`Save draft locally (${modSymbol}S)`}>
            <Bookmark className="h-4 w-4 text-slate-500" /><span className="hidden sm:inline">Save draft</span>
          </button>
          <button type="button" onClick={onNewInvoice} className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white shadow-md shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 sm:px-4">
            <Plus className="h-4 w-4" /><span>New invoice</span>
          </button>
          {onOpenShortcuts && <button type="button" onClick={onOpenShortcuts} className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 md:inline-flex" title="Keyboard shortcuts"><Command className="h-4 w-4" /></button>}
          <button type="button" onClick={onReset} className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:inline-flex" title="Reset invoice"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="border-t border-slate-100 bg-white px-4 py-2 lg:hidden">
        <div className="mx-auto flex max-w-[1500px] items-center gap-2 overflow-x-auto text-xs">
          <span className="shrink-0 font-semibold text-slate-400">QUICK START</span>
          <button type="button" onClick={() => onLoadPreset('endless')} className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">Photography</button>
          <button type="button" onClick={() => onLoadPreset('freelancer')} className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">Freelancer</button>
          <button type="button" onClick={() => onLoadPreset('blank')} className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">Blank invoice</button>
        </div>
      </div>
    </header>
  );
};
