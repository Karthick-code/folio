import React, { useState, useMemo, useEffect, useRef } from 'react';
import { calculateInvoice } from './utils/calculations.js';
import {
  loadNumberingSettings,
  incrementInvoiceNumber,
  formatInvoiceNumber,
} from './utils/invoiceNumber.js';
import { getCleanBlankPreset } from './utils/presets.js';
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
import { Eye, Edit3, CheckCircle, FileText, ShieldCheck, Download, ArrowRight, Layers, Sparkles } from 'lucide-react';

const DRAFT_STORAGE_KEY = 'universal_invoice_saved_draft';

export default function App() {
  const previewRef = useRef(null);

  const [numberingSettings, setNumberingSettings] = useState(() =>
    loadNumberingSettings()
  );

  // Every new session starts with a clean invoice. Saved drafts are restored only when requested.
  const [invoiceData, setInvoiceData] = useState(() => getCleanBlankPreset('INR'));
  const [showWorkspace, setShowWorkspace] = useState(false);

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

  // The editor starts blank; no business/customer sample data is preloaded.
  const handleCreateInvoice = () => {
    setInvoiceData(getCleanBlankPreset('INR'));
    setShowItemDiscount(false);
    setShowItemTax(false);
    setMobileTab('form');
    setShowWorkspace(true);
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

  if (!showWorkspace) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900 font-sans">
        <header className="relative z-10 border-b border-slate-200/80 bg-white/90">
          <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
            <a href="#home" className="flex items-center gap-3" aria-label="Folio home">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white"><FileText className="h-5 w-5" /></span>
              <span><span className="block text-xl font-extrabold tracking-tight">folioinvoices</span><span className="block text-[9px] font-bold tracking-wide text-slate-500">Create your bills, beautifully.</span></span>
            </a>
            <button onClick={handleCreateInvoice} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">Create invoice <ArrowRight className="h-4 w-4" /></button>
          </div>
        </header>
        <main id="home">
          <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.02fr_.98fr] lg:py-28">
            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-sm"><Sparkles className="h-3.5 w-3.5" /> Professional invoices, made simple</div>
              <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-[-.055em] text-slate-950 sm:text-5xl lg:text-6xl">Turn your details into a <span className="text-indigo-600">professional invoice.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Create a polished invoice in minutes. Add your own business and customer details, customize the design, preview the A4 layout, and download a PDF—without creating an account.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={handleCreateInvoice} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700">Create your invoice <ArrowRight className="h-4 w-4" /></button><a href="#how-it-works" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50">How it works</a></div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> No account required</span><span className="inline-flex items-center gap-1.5"><FileText className="h-4 w-4 text-indigo-600" /> A4 PDF export</span><span className="inline-flex items-center gap-1.5"><Download className="h-4 w-4 text-indigo-600" /> Data stays in your browser</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-100 via-violet-50 to-sky-100 blur-2xl" />
              <div className="relative rotate-[1deg] rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-7">
                <div className="flex items-start justify-between border-b border-slate-100 pb-5"><div><div className="text-xs font-extrabold uppercase tracking-[.18em] text-indigo-600">Invoice preview</div><div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Your business</div><div className="mt-1 text-xs text-slate-400">Your details appear here</div></div><div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><FileText className="h-6 w-6" /></div></div>
                <div className="grid grid-cols-2 gap-4 py-5"><div><div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bill to</div><div className="mt-2 h-2 w-24 rounded bg-slate-200"/><div className="mt-2 h-2 w-32 rounded bg-slate-100"/></div><div className="text-right"><div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invoice number</div><div className="mt-2 text-sm font-bold text-slate-700">Generated for you</div></div></div>
                <div className="overflow-hidden rounded-xl border border-slate-100"><div className="grid grid-cols-[1fr_60px_70px] bg-slate-50 px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500"><span>Description</span><span>Qty</span><span className="text-right">Amount</span></div>{[1,2,3].map((n)=><div key={n} className="grid grid-cols-[1fr_60px_70px] items-center border-t border-slate-100 px-3 py-4"><div className="h-2 w-28 rounded bg-slate-100"/><div className="h-2 w-5 rounded bg-slate-100"/><div className="ml-auto h-2 w-12 rounded bg-slate-100"/></div>)}</div>
                <div className="ml-auto mt-5 max-w-[190px] space-y-3"><div className="flex justify-between text-xs text-slate-500"><span>Subtotal</span><span>—</span></div><div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-extrabold text-slate-900"><span>Total</span><span>Calculated live</span></div></div>
                <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white"><span>Ready when you are</span><span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400"/> PDF ready</span></div>
              </div>
            </div>
          </section>
          <section id="how-it-works" className="border-y border-slate-200 bg-white py-14 sm:py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="max-w-xl"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-indigo-600">How it works</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">Everything you need. Nothing you don't.</h2><p className="mt-3 text-sm leading-6 text-slate-500">A focused workspace for making invoices without accounts, setup, or unnecessary steps.</p></div><div className="mt-9 grid gap-4 md:grid-cols-3">{[{n:'01',title:'Enter your details',body:'Add your business, customer, invoice items, taxes, and payment information.'},{n:'02',title:'Make it yours',body:'Choose a professional template and review the live A4 preview.'},{n:'03',title:'Export and send',body:'Print or download a PDF when your invoice is ready.'}].map((item)=><article key={item.n} className="rounded-2xl border border-slate-200 bg-[#fafbff] p-6"><div className="text-xs font-extrabold tracking-widest text-indigo-600">{item.n}</div><h3 className="mt-4 text-lg font-extrabold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p></article>)}</div></div></section>
        </main>
        <footer className="flex flex-col items-center justify-between gap-3 px-5 py-7 text-xs text-slate-500 sm:flex-row sm:px-8"><span>© {new Date().getFullYear()} FolioInvoices</span><span>Private by design · No sign-up · PDF export</span></footer>
      </div>
    );
  }

  return (
    <div id="top" className="min-h-screen bg-[#f5f7fb] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        onNewInvoice={handleNewInvoice}
        onReset={handleReset}
        onSaveDraft={handleSaveDraft}
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
            <p className="text-base font-bold tracking-tight text-slate-950">FolioInvoices</p>
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
