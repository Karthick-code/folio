import React from 'react';

export const CustomerDetailsForm = ({ customer, onChange }) => {
  return (
    <div className="bg-white/95 rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_-4px_rgba(40,30,20,0.04)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-900/60 font-medium text-sm">02</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Client / Recipient</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Invoiced customer details</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name and Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Client / Individual Name <span className="text-amber-800">*</span>
            </label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => onChange({ ...customer, name: e.target.value })}
              placeholder="e.g. Vikram & Ananya Sharma or Jane Doe"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Company or Event Organization (Optional)
            </label>
            <input
              type="text"
              value={customer.company}
              onChange={(e) => onChange({ ...customer, company: e.target.value })}
              placeholder="e.g. The Sharma Wedding or Acme Corp"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">
            Billing Address
          </label>
          <textarea
            rows={2}
            value={customer.address}
            onChange={(e) => onChange({ ...customer, address: e.target.value })}
            placeholder="Street address, city, state, postal code, country"
            className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 resize-none"
          />
        </div>

        {/* Email, Phone, Tax ID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => onChange({ ...customer, email: e.target.value })}
              placeholder="client@domain.com"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={customer.phone}
              onChange={(e) => onChange({ ...customer, phone: e.target.value })}
              placeholder="+91 98200 00000"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 font-mono-num"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Client Tax ID / GSTIN
            </label>
            <input
              type="text"
              value={customer.taxId}
              onChange={(e) => onChange({ ...customer, taxId: e.target.value })}
              placeholder="Optional Tax / VAT ID"
              className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 font-mono-num"
            />
          </div>
        </div>

        {/* Shipping Address Toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
            <input
              type="checkbox"
              checked={customer.useShippingAddress}
              onChange={(e) => onChange({ ...customer, useShippingAddress: e.target.checked })}
              className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-4 h-4"
            />
            <span>Include separate shipping / physical venue destination</span>
          </label>

          {customer.useShippingAddress && (
            <div className="mt-2.5">
              <textarea
                rows={2}
                value={customer.shippingAddress}
                onChange={(e) => onChange({ ...customer, shippingAddress: e.target.value })}
                placeholder="Shipping or venue address if different from billing"
                className="w-full px-3.5 py-2 text-sm bg-stone-50/60 border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
