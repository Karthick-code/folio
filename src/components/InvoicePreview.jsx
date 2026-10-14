import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { TemplateRenderer } from './Templates/TemplateRenderer.jsx';
import { downloadInvoicePdf, printInvoice } from '../utils/pdfGenerator.js';
import { Download, Printer, Eye, ZoomIn, ZoomOut, Loader2, Check, Command } from 'lucide-react';
import { PdfPreviewModal } from './PdfPreviewModal.jsx';

export const InvoicePreview = forwardRef(
  ({ data, breakdown, onInvoiceGenerated, onOpenShortcuts }, ref) => {
    const [zoom, setZoom] = useState(100);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progressStatus, setProgressStatus] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const captureRef = useRef(null);

    const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
    const modSymbol = isMac ? '⌘' : 'Ctrl+';

    const handleDownloadPdf = async () => {
      if (!captureRef.current || isGenerating) return;

      setIsGenerating(true);
      setProgressStatus('Rendering A4 document canvas...');

      try {
        const filename = data?.invoice?.invoiceNumber
          ? `${data.invoice.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
          : 'Invoice.pdf';

        await downloadInvoicePdf(captureRef.current, filename, (status) => {
          setProgressStatus(status);
        });

        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3500);

        // Trigger numbering auto-increment callback if enabled
        onInvoiceGenerated?.();
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Unable to generate PDF. You can also use the Print button to save as PDF via your browser.');
      } finally {
        setIsGenerating(false);
        setProgressStatus('');
      }
    };

    const handlePrint = () => {
      printInvoice();
    };

    // Expose methods to parent via ref for keyboard shortcuts
    useImperativeHandle(ref, () => ({
      downloadPdf: handleDownloadPdf,
      print: handlePrint,
      openPreviewModal: () => setIsPreviewModalOpen(true),
    }));

    return (
      <div className="flex flex-col h-full bg-[#EDE9E1]/80 rounded-2xl border border-stone-300/70 shadow-[0_4px_24px_-10px_rgba(28,25,23,0.06)] overflow-hidden">
        {/* Top Floating Bar for Preview Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-white/95 backdrop-blur-md border-b border-stone-200/80 no-print">
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-xs font-semibold tracking-wider text-stone-900 uppercase">
              Live A4 Proof
            </span>
            <span className="text-[11px] text-stone-400 font-mono-num hidden sm:inline">
              · 210 × 297 mm
            </span>
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-lg text-xs border border-stone-200/70">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(60, z - 15))}
              className="p-1 text-stone-500 hover:text-stone-900 rounded-md hover:bg-white transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono-num text-stone-700 font-medium">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(130, z + 15))}
              className="p-1 text-stone-500 hover:text-stone-900 rounded-md hover:bg-white transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="px-1.5 py-0.5 text-[10px] text-stone-500 hover:text-stone-900 hover:bg-white rounded-md font-medium transition-colors"
              title="Reset zoom to 100%"
            >
              Reset
            </button>
          </div>

          {/* Action Buttons: Preview, Print, Download PDF */}
          <div className="flex items-center gap-2 ml-auto">
            {onOpenShortcuts && (
              <button
                type="button"
                onClick={onOpenShortcuts}
                className="hidden xl:inline-flex items-center p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                title="Keyboard Shortcuts (Ctrl+S, Ctrl+P, Ctrl+Enter)"
              >
                <Command className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-white border border-stone-200 hover:border-stone-300 rounded-xl shadow-2xs transition-all hover:bg-stone-50"
              title="Full-screen document preview"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-white border border-stone-200 hover:border-stone-300 rounded-xl shadow-2xs transition-all hover:bg-stone-50"
              title={`Print or Save via browser printer (${modSymbol}P)`}
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span>Print</span>
              <kbd className="hidden lg:inline text-[9px] font-mono text-stone-400 bg-stone-100 px-1 py-0.2 rounded ml-0.5 border border-stone-200">
                {modSymbol}P
              </kbd>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-600 rounded-xl shadow-xs transition-all hover:shadow-sm active:scale-[0.98]"
              title={`Generate and download PDF file (${modSymbol}Enter)`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                  <kbd className="hidden lg:inline text-[9px] font-mono text-stone-300 bg-stone-800 px-1 py-0.2 rounded ml-0.5">
                    {modSymbol}↵
                  </kbd>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress notification banner if rendering */}
        {isGenerating && (
          <div className="bg-amber-50 text-amber-900 text-xs px-5 py-2.5 flex items-center justify-between border-b border-amber-200/70 no-print animate-in fade-in duration-150">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-800" />
              {progressStatus || 'Generating high-resolution A4 PDF...'}
            </span>
            <span className="text-[11px] text-amber-800 font-mono-num font-medium">Please wait...</span>
          </div>
        )}

        {/* Success toast */}
        {showSuccessToast && (
          <div className="bg-emerald-50 text-emerald-900 text-xs px-5 py-2.5 flex items-center gap-2 border-b border-emerald-200/70 animate-in fade-in duration-200 no-print">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-medium">Invoice PDF downloaded successfully! Invoice numbering sequence auto-incremented.</span>
          </div>
        )}

        {/* Scrollable Gallery Canvas Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="w-full flex justify-center"
          >
            {/* Real A4 Paper Presentation */}
            <div
              id="invoice-capture-area"
              ref={captureRef}
              className="w-[794px] min-h-[1123px] bg-white shadow-[0_20px_50px_-20px_rgba(28,25,23,0.14)] border border-stone-300/60 rounded-xs overflow-hidden print:w-full print:border-none print:shadow-none"
            >
              <TemplateRenderer data={data} breakdown={breakdown} />
            </div>
          </div>
        </div>

        {/* PDF Full Screen Preview Modal */}
        <PdfPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          onDownload={handleDownloadPdf}
          onPrint={handlePrint}
          invoiceNumber={data?.invoice?.invoiceNumber}
        >
          <TemplateRenderer data={data} breakdown={breakdown} />
        </PdfPreviewModal>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
