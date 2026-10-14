// import React from 'react';
// import { X, Download, Printer } from 'lucide-react';

// export const PdfPreviewModal = ({
//   isOpen,
//   onClose,
//   onDownload,
//   onPrint,
//   children,
//   invoiceNumber,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-150">
//       <div className="bg-[#FAF9F6] rounded-2xl shadow-2xl max-w-4xl w-full h-[92vh] flex flex-col border border-stone-200/90 overflow-hidden">
//         {/* Top bar */}
//         <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-stone-200 text-stone-900 shrink-0">
//           <div className="flex items-center gap-3">
//             <span className="font-serif-display font-medium text-sm tracking-wide">
//               Document Proof: #{invoiceNumber || 'Draft'}
//             </span>
//             <span className="text-xs text-stone-400 hidden sm:inline">· 210 × 297 mm (A4)</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={onPrint}
//               className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors border border-stone-200/70"
//             >
//               <Printer className="w-3.5 h-3.5 text-stone-500" />
//               <span>Print</span>
//             </button>
//             <button
//               onClick={onDownload}
//               className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors"
//             >
//               <Download className="w-3.5 h-3.5" />
//               <span>Download PDF</span>
//             </button>
//             <button
//               onClick={onClose}
//               className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 ml-1 transition-colors"
//               title="Close preview"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Scrollable document area */}
//         <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#EFECE6]/80 flex justify-center items-start">
//           <div className="w-full max-w-[794px] bg-white shadow-xl rounded-xs overflow-hidden my-auto border border-stone-300/60">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from 'react';
import { X, Download, Printer } from 'lucide-react';

export const PdfPreviewModal = ({
  isOpen,
  onClose,
  onDownload,
  onPrint,
  children,
  invoiceNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#FAF9F6] rounded-2xl shadow-2xl max-w-4xl w-full h-[92vh] flex flex-col border border-stone-200/90 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-stone-200 text-stone-900 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-serif-display font-medium text-sm tracking-wide">
              Document Proof: #{invoiceNumber || 'Draft'}
            </span>
            <span className="text-xs text-stone-400 hidden sm:inline">· 210 × 297 mm (A4)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors border border-stone-200/70"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 ml-1 transition-colors"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable document area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#EFECE6]/80 flex justify-center items-start">
          <div className="w-full max-w-[794px] bg-white shadow-xl rounded-xs overflow-hidden my-auto border border-stone-300/60">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
