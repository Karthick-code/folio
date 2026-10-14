import React from 'react';
import { CURRENCIES } from '../utils/calculations.js';
import { SlidersHorizontal } from 'lucide-react';

export const InvoiceDetailsForm = ({
  invoice,
  onChange,
  onOpenNumberingSettings,
}) => {
  return (
    <div className="bg-white/95 rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_-4px_rgba(40,30,20,0.04)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-900/60 font-medium text-sm">03</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Invoice Metadata</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Numbering, dates & currency</span>
        </div>

        <button
          type="button"
          onClick={onOpenNumberingSettings}
          className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-xl font-medium transition-colors border border-stone-200/60"
          title="Configure sequence numbering & auto-increment"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
          <span>Numbering Setup</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Invoice Number & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Invoice Identifier <span className="text-amber-800">*</span>
            </label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => onChange({ ...invoice, invoiceNumber: e.target.value })}
              placeholder="e.g. INV-1001"
              className="w-full px-3.5 py-2 text-sm font-mono-num font-semibold bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 tracking-wide"
            />
            <span className="text-[11px] text-stone-400 mt-1 block">Editable anytime; auto-increments upon generation</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Invoice Currency
            </label>
            <select
              value={invoice.currency}
              onChange={(e) => onChange({ ...invoice, currency: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 font-medium"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date and Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Issue Date
            </label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => onChange({ ...invoice, date: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Payment Due Date
            </label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => onChange({ ...invoice, dueDate: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Settlement Status
            </label>
            <select
              value={invoice.status}
              onChange={(e) => onChange({ ...invoice, status: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 font-medium"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="due">Due on Receipt</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* PO & Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              PO Number / Work Order No (Optional)
            </label>
            <input
              type="text"
              value={invoice.poNumber}
              onChange={(e) => onChange({ ...invoice, poNumber: e.target.value })}
              placeholder="e.g. PO-8921"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Agreement / Custom Contract Code (Optional)
            </label>
            <input
              type="text"
              value={invoice.customReference}
              onChange={(e) => onChange({ ...invoice, customReference: e.target.value })}
              placeholder="e.g. Wedding Contract 2026-08"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
