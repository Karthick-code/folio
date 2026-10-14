import React from 'react';

export const PaymentDetailsForm = ({ payment, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_10px_-2px_rgba(28,25,23,0.03)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-800/70 font-medium text-sm">07</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Remittance & Bank Instructions</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Direct transfer & UPI accounts</span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={payment.enabled}
            onChange={(e) => onChange({ ...payment, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900"></div>
        </label>
      </div>

      {payment.enabled ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Financial Institution / Bank
              </label>
              <input
                type="text"
                value={payment.bankName}
                onChange={(e) => onChange({ ...payment, bankName: e.target.value })}
                placeholder="e.g. HDFC Bank, Chase, or Barclays"
                className="w-full px-3.5 py-2 text-sm bg-[#FBFBF9] border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Account Holder Name
              </label>
              <input
                type="text"
                value={payment.accountHolder}
                onChange={(e) => onChange({ ...payment, accountHolder: e.target.value })}
                placeholder="e.g. ENDLESS Moments Studio Pvt Ltd"
                className="w-full px-3.5 py-2 text-sm bg-[#FBFBF9] border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                Account Number / IBAN
              </label>
              <input
                type="text"
                value={payment.accountNumber}
                onChange={(e) => onChange({ ...payment, accountNumber: e.target.value })}
                placeholder="Account / IBAN Number"
                className="w-full px-3.5 py-2 text-sm bg-[#FBFBF9] border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                IFSC / Routing / SWIFT
              </label>
              <input
                type="text"
                value={payment.ifscOrRouting}
                onChange={(e) => onChange({ ...payment, ifscOrRouting: e.target.value })}
                placeholder="e.g. HDFC0000140"
                className="w-full px-3.5 py-2 text-sm bg-[#FBFBF9] border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5">
                UPI Handle / QR ID
              </label>
              <input
                type="text"
                value={payment.upiId}
                onChange={(e) => onChange({ ...payment, upiId: e.target.value })}
                placeholder="e.g. studio@hdfcbank"
                className="w-full px-3.5 py-2 text-sm bg-[#FBFBF9] border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Wire Instructions or Transfer Remarks
            </label>
            <input
              type="text"
              value={payment.instructions}
              onChange={(e) => onChange({ ...payment, instructions: e.target.value })}
              placeholder="e.g. Please quote invoice identifier in wire remarks. 50% advance received."
              className="w-full px-3.5 py-2 text-sm bg-[#FBFBF9] border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-stone-500 italic">
          Remittance details disabled. Toggle switch to display bank wire instructions or UPI handle on invoice.
        </p>
      )}
    </div>
  );
};
