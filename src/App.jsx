import React, { useState, useMemo, useEffect, useRef } from 'react';
import { calculateInvoice } from './utils/calculations.js';
import {
  loadNumberingSettings,
  incrementInvoiceNumber,
  formatInvoiceNumber,
} from './utils/invoiceNumber.js';
import {
  getEndlessMomentsPreset,
  getModernFreelancerPreset,
  getCleanBlankPreset,
} from './utils/presets.js';
import { Header } from './components/Header.jsx';
import { BusinessDetailsForm } from './components/BusinessDetailsForm.jsx';
import { CustomerDetailsForm } from './components/CustomerDetailsForm.jsx';
import { InvoiceDetailsForm } from './components/InvoiceDetailsForm.jsx';
import { InvoiceItemsForm } from './components/InvoiceItemsForm.jsx';
import { TaxesAndChargesForm } from './components/TaxesAndChargesForm.jsx';
import { CustomFieldsForm } from './components/CustomFieldsForm.jsx';
import { PaymentDetailsForm } from './components/PaymentDetailsForm.jsx';
import { NotesTermsForm } from './components/NotesTermsForm.jsx';
import { TemplateCustomizer } from './components/TemplateCustomizer.jsx';
import { InvoicePreview } from './components/InvoicePreview.jsx';
import { NumberingSettingsModal } from './components/NumberingSettingsModal.jsx';
import { ConfirmModal } from './components/ConfirmModal.jsx';
import { ShortcutsModal } from './components/ShortcutsModal.jsx';
import { Eye, Edit3, CheckCircle } from 'lucide-react';

const DRAFT_STORAGE_KEY = 'universal_invoice_saved_draft';

export default function App() {
  const previewRef = useRef(null);

  const [numberingSettings, setNumberingSettings] = useState(() =>
    loadNumberingSettings()
  );

  // Initialize with the photography studio preset (ENDLESS Moments) or saved draft
  const [invoiceData, setInvoiceData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return getEndlessMomentsPreset();
  });

  const [hasSavedDraft, setHasSavedDraft] = useState(() => {
    try {
      return !!localStorage.getItem(DRAFT_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  // Mobile active tab: 'form' | 'preview'
  const [mobileTab, setMobileTab] = useState('form');

  // Modals & Popups
  const [isNumberingModalOpen, setIsNumberingModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: '',
    onConfirm: () => {},
  });

  // Helper to trigger transient toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Column toggles for item discount & tax
  const [showItemDiscount, setShowItemDiscount] = useState(() =>
    invoiceData.items?.some((i) => i.discountValue > 0)
  );
  const [showItemTax, setShowItemTax] = useState(() =>
    invoiceData.taxes?.mode === 'per_item'
  );

  // Live calculations
  const breakdown = useMemo(() => calculateInvoice(invoiceData), [invoiceData]);

  // Handle auto-increment when PDF is generated
  const handleInvoiceGenerated = () => {
    if (numberingSettings.autoIncrement) {
      const updated = incrementInvoiceNumber();
      setNumberingSettings(updated);
    }
  };

  // Preset switch
  const handleLoadPreset = (presetKey) => {
    if (presetKey === 'endless') {
      const data = getEndlessMomentsPreset();
      setInvoiceData(data);
      setShowItemDiscount(true);
      setShowItemTax(false);
      showToast('Loaded ENDLESS Moments Photography Studio template');
    } else if (presetKey === 'freelancer') {
      const data = getModernFreelancerPreset();
      setInvoiceData(data);
      setShowItemDiscount(false);
      setShowItemTax(false);
      showToast('Loaded Freelancer & Digital Agency template');
    } else {
      const data = getCleanBlankPreset(invoiceData.invoice.currency);
      setInvoiceData(data);
      setShowItemDiscount(false);
      setShowItemTax(false);
      showToast('Loaded clean blank invoice');
    }
  };

  // Start new invoice
  const handleNewInvoice = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Start New Invoice?',
      message:
        'This will advance to the next invoice sequence number and clear the customer and items list while keeping your business details intact.',
      confirmLabel: 'Create New Invoice',
      onConfirm: () => {
        let newNumber = invoiceData.invoice.invoiceNumber;
        if (numberingSettings.autoIncrement) {
          const updated = incrementInvoiceNumber();
          setNumberingSettings(updated);
          newNumber = formatInvoiceNumber(updated);
        }

        const blank = getCleanBlankPreset(invoiceData.invoice.currency);
        setInvoiceData((prev) => ({
          ...blank,
          business: prev.business,
          template: prev.template,
          payment: prev.payment,
          invoice: {
            ...blank.invoice,
            invoiceNumber: newNumber,
            currency: prev.invoice.currency,
          },
        }));
        setConfirmModal((m) => ({ ...m, isOpen: false }));
        showToast(`Created new invoice #${newNumber}`);
      },
    });
  };

  // Reset form
  const handleReset = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Form to Blank Slate?',
      message: 'All current form fields will be reset. Unsaved data will be discarded.',
      confirmLabel: 'Reset Everything',
      onConfirm: () => {
        setInvoiceData(getCleanBlankPreset('INR'));
        setConfirmModal((m) => ({ ...m, isOpen: false }));
        showToast('Form reset to default state');
      },
    });
  };

  // Save draft locally
  const handleSaveDraft = (fromShortcut = false) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(invoiceData));
      setHasSavedDraft(true);
      showToast(
        fromShortcut
          ? 'Draft saved locally to browser storage (Ctrl+S)'
          : 'Invoice draft saved locally in your browser'
      );
    } catch {
      alert('Unable to save draft locally. Browser storage might be restricted.');
    }
  };

  // Restore draft
  const handleLoadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        setInvoiceData(JSON.parse(raw));
        showToast('Draft restored from local storage');
      }
    } catch {
      alert('Could not restore draft.');
    }
  };

  // Global Keyboard Shortcuts (Ctrl+S to save draft, Ctrl+P to print, Ctrl+Enter to generate PDF)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = typeof navigator !== 'undefined' && navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
      const hasModifier = isMac ? e.metaKey : e.ctrlKey;

      if (!hasModifier) return;

      // 1. Ctrl+S / Cmd+S -> Save Draft
      if (e.key?.toLowerCase() === 's' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleSaveDraft(true);
      }

      // 2. Ctrl+P / Cmd+P -> Print
      else if (e.key?.toLowerCase() === 'p' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        showToast('Opening print dialog (Ctrl+P)...');
        previewRef.current?.print();
      }

      // 3. Ctrl+Enter / Cmd+Enter -> Generate & Download PDF
      else if (e.key === 'Enter') {
        e.preventDefault();
        showToast('Generating PDF via shortcut (Ctrl+Enter)...');
        previewRef.current?.downloadPdf();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invoiceData]);

  return (
    <div id="top" className="min-h-screen bg-[#f5f7fb] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        onNewInvoice={handleNewInvoice}
        onReset={handleReset}
        onSaveDraft={handleSaveDraft}
        onLoadPreset={handleLoadPreset}
        hasSavedDraft={hasSavedDraft}
        onLoadDraft={handleLoadDraft}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-stone-700/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Privacy & Active Status Banner */}
      <div className="border-b border-emerald-100 bg-emerald-50/80 px-4 py-2.5 text-xs text-emerald-950 no-print">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-bold text-emerald-900">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Your data stays private
            </span>
            <span className="text-emerald-800/80">No account, no server uploads. Your invoice stays in this browser.</span>
          </div>
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <span>
              Invoice Number: <strong className="text-stone-800 font-mono-num font-semibold">{invoiceData.invoice.invoiceNumber}</strong>
            </span>
            <span>·</span>
            <span>
              Currency: <strong className="text-stone-800 font-semibold">{invoiceData.invoice.currency}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden sticky top-28 z-30 bg-slate-50/95 backdrop-blur-md border-b border-stone-200 px-4 py-2 flex items-center justify-center gap-2 no-print">
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl transition-all ${
            mobileTab === 'form'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Invoice Form
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl transition-all ${
            mobileTab === 'preview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Live A4 Preview
        </button>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 mx-auto w-full max-w-[1500px] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <section className="mb-7 flex flex-col justify-between gap-5 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_-24px_rgba(15,23,42,0.25)] sm:p-7 xl:flex-row xl:items-center no-print">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-700"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Simple, private invoicing</div>
            <h1 className="text-2xl font-bold tracking-[-0.045em] text-slate-950 sm:text-3xl">Create an invoice <span className="text-indigo-600">that looks the part.</span></h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Add your business and client details, list the work, then choose a design and export a polished A4 PDF.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 xl:min-w-[390px]">
            <div className="rounded-2xl bg-slate-50 p-3 sm:p-4"><span className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><Edit3 className="h-4 w-4" /></span><span className="block text-xs font-bold text-slate-800">Fill in</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">Your details</span></div>
            <div className="rounded-2xl bg-slate-50 p-3 sm:p-4"><span className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><Eye className="h-4 w-4" /></span><span className="block text-xs font-bold text-slate-800">Preview</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">Live changes</span></div>
            <div className="rounded-2xl bg-slate-50 p-3 sm:p-4"><span className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm"><CheckCircle className="h-4 w-4" /></span><span className="block text-xs font-bold text-slate-800">Export</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">A4 PDF</span></div>
          </div>
        </section>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 xl:gap-8">
          {/* Column 1: Comprehensive Form Controls */}
          <div
            className={`lg:col-span-7 xl:col-span-7 space-y-5 ${
              mobileTab === 'form' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* 1. Business Details */}
            <BusinessDetailsForm
              business={invoiceData.business}
              onChange={(business) => setInvoiceData({ ...invoiceData, business })}
            />

            {/* 2. Customer Details */}
            <CustomerDetailsForm
              customer={invoiceData.customer}
              onChange={(customer) => setInvoiceData({ ...invoiceData, customer })}
            />

            {/* 3. Invoice Details & Numbering */}
            <InvoiceDetailsForm
              invoice={invoiceData.invoice}
              onChange={(invoice) => setInvoiceData({ ...invoiceData, invoice })}
              onOpenNumberingSettings={() => setIsNumberingModalOpen(true)}
            />

            {/* 4. Line Items / Services */}
            <InvoiceItemsForm
              items={invoiceData.items}
              currency={invoiceData.invoice.currency}
              showItemDiscount={showItemDiscount}
              showItemTax={showItemTax}
              onChange={(items) => setInvoiceData({ ...invoiceData, items })}
              onToggleItemDiscount={() => setShowItemDiscount(!showItemDiscount)}
              onToggleItemTax={() => setShowItemTax(!showItemTax)}
            />

            {/* 5. Taxes, Discounts & Charges */}
            <TaxesAndChargesForm
              taxes={invoiceData.taxes}
              discount={invoiceData.discount}
              charges={invoiceData.charges}
              currency={invoiceData.invoice.currency}
              onUpdateTaxes={(taxes) => setInvoiceData({ ...invoiceData, taxes })}
              onUpdateDiscount={(discount) => setInvoiceData({ ...invoiceData, discount })}
              onUpdateCharges={(charges) => setInvoiceData({ ...invoiceData, charges })}
            />

            {/* 6. Custom Fields */}
            <CustomFieldsForm
              customFields={invoiceData.customFields}
              onChange={(customFields) => setInvoiceData({ ...invoiceData, customFields })}
            />

            {/* 7. Payment / Banking Details */}
            <PaymentDetailsForm
              payment={invoiceData.payment}
              onChange={(payment) => setInvoiceData({ ...invoiceData, payment })}
            />

            {/* 8. Notes & Terms & Signature */}
            <NotesTermsForm
              notesTerms={invoiceData.notesTerms}
              onChange={(notesTerms) => setInvoiceData({ ...invoiceData, notesTerms })}
            />

            {/* 9. Template Selector & Color Customizer */}
            <TemplateCustomizer
              template={invoiceData.template}
              onChange={(template) => setInvoiceData({ ...invoiceData, template })}
            />
          </div>

          {/* Column 2: Sticky Live A4 Preview & PDF Export */}
          <div
            className={`lg:col-span-5 xl:col-span-5 lg:sticky lg:top-[120px] h-auto lg:max-h-[calc(100vh-136px)] ${
              mobileTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <InvoicePreview
              ref={previewRef}
              data={invoiceData}
              breakdown={breakdown}
              onInvoiceGenerated={handleInvoiceGenerated}
              onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-7 text-xs text-slate-500 no-print">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div>
            <p className="text-base font-bold tracking-tight text-slate-950">Folio<span className="text-indigo-600">.</span> <span className="font-medium text-slate-500">Invoice Studio</span></p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Professional invoices for freelancers, studios, consultants, contractors, and growing businesses.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-stone-500">
            <button
              type="button"
              onClick={() => setIsShortcutsModalOpen(true)}
              className="hover:text-stone-900 underline decoration-stone-300 underline-offset-2 transition-colors"
            >
              Shortcuts (Ctrl+S, Ctrl+P, Ctrl+↵)
            </button>
            <span>·</span>
            <span>Private Local Storage</span>
            <span>·</span>
            <span>Vector A4 PDF</span>
            <span>·</span>
            <span>Zero Sign-up</span>
          </div>
        </div>
      </footer>

      {/* Numbering Settings Modal */}
      <NumberingSettingsModal
        isOpen={isNumberingModalOpen}
        onClose={() => setIsNumberingModalOpen(false)}
        currentSettings={numberingSettings}
        onSave={(updatedSettings, formatted) => {
          setNumberingSettings(updatedSettings);
          setInvoiceData((prev) => ({
            ...prev,
            invoice: { ...prev.invoice, invoiceNumber: formatted },
          }));
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((m) => ({ ...m, isOpen: false }))}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
