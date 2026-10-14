import React from 'react';

export const TaxesAndChargesForm = ({
  taxes,
  discount,
  charges,
  currency = 'INR',
  onUpdateTaxes,
  onUpdateDiscount,
  onUpdateCharges,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_10px_-2px_rgba(28,25,23,0.03)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-800/70 font-medium text-sm">05</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Adjustments & Fiscal Terms</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Discounts, taxes & balance adjustments</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Invoice-Level Discount */}
        <div className="p-4 bg-[#FAF9F7] rounded-xl border border-stone-200/70">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={discount.enabled}
                onChange={(e) => onUpdateDiscount({ ...discount, enabled: e.target.checked })}
                className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-4 h-4"
              />
              <span>Apply Overall Courtesy Discount</span>
            </label>

            {discount.enabled && (
              <div className="flex items-center gap-1 bg-stone-200/50 p-0.5 rounded-lg border border-stone-200">
                <button
                  type="button"
                  onClick={() => onUpdateDiscount({ ...discount, type: 'percent' })}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all ${
                    discount.type === 'percent' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateDiscount({ ...discount, type: 'fixed' })}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all ${
                    discount.type === 'fixed' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Fixed ({currency})
                </button>
              </div>
            )}
          </div>

          {discount.enabled && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Discount Value ({discount.type === 'percent' ? '%' : currency})
                </label>
                <input
                  type="number"
                  min="0"
                  max={discount.type === 'percent' ? '100' : undefined}
                  value={discount.value}
                  onChange={(e) => onUpdateDiscount({ ...discount, value: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Taxes */}
        <div className="p-4 bg-[#FAF9F7] rounded-xl border border-stone-200/70">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={taxes.enabled}
                onChange={(e) => onUpdateTaxes({ ...taxes, enabled: e.target.checked })}
                className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-4 h-4"
              />
              <span>Enable Tax Assessment / GST / VAT</span>
            </label>

            {taxes.enabled && (
              <div className="flex items-center gap-1 bg-stone-200/50 p-0.5 rounded-lg border border-stone-200">
                <button
                  type="button"
                  onClick={() => onUpdateTaxes({ ...taxes, mode: 'single' })}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all ${
                    taxes.mode === 'single' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Single Tax
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateTaxes({ ...taxes, mode: 'dual' })}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all ${
                    taxes.mode === 'dual' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Dual Tax (CGST + SGST)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateTaxes({ ...taxes, mode: 'per_item' })}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all ${
                    taxes.mode === 'per_item' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Per-Item Tax
                </button>
              </div>
            )}
          </div>

          {taxes.enabled && taxes.mode === 'single' && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Tax Label</label>
                <input
                  type="text"
                  value={taxes.singleTaxName}
                  onChange={(e) => onUpdateTaxes({ ...taxes, singleTaxName: e.target.value })}
                  placeholder="e.g. GST or VAT or Sales Tax"
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={taxes.singleTaxRate}
                  onChange={(e) => onUpdateTaxes({ ...taxes, singleTaxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
                />
              </div>
            </div>
          )}

          {taxes.enabled && taxes.mode === 'dual' && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Tax 1 Label</label>
                <input
                  type="text"
                  value={taxes.dualTax1Name}
                  onChange={(e) => onUpdateTaxes({ ...taxes, dualTax1Name: e.target.value })}
                  placeholder="CGST"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Rate 1 (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={taxes.dualTax1Rate}
                  onChange={(e) => onUpdateTaxes({ ...taxes, dualTax1Rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Tax 2 Label</label>
                <input
                  type="text"
                  value={taxes.dualTax2Name}
                  onChange={(e) => onUpdateTaxes({ ...taxes, dualTax2Name: e.target.value })}
                  placeholder="SGST"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Rate 2 (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={taxes.dualTax2Rate}
                  onChange={(e) => onUpdateTaxes({ ...taxes, dualTax2Rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
                />
              </div>
            </div>
          )}

          {taxes.enabled && taxes.mode === 'per_item' && (
            <p className="mt-2 text-xs text-stone-500 italic">
              Item taxes will be calculated individually from the line tax rate specified on each item.
            </p>
          )}
        </div>

        {/* Shipping & Additional Charges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Shipping */}
          <div className="p-4 bg-[#FAF9F7] rounded-xl border border-stone-200/70">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 mb-2">
              <input
                type="checkbox"
                checked={charges.shippingEnabled}
                onChange={(e) => onUpdateCharges({ ...charges, shippingEnabled: e.target.checked })}
                className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-4 h-4"
              />
              <span>Delivery / Shipping Charge</span>
            </label>

            {charges.shippingEnabled && (
              <input
                type="number"
                min="0"
                step="any"
                value={charges.shippingCharge}
                onChange={(e) => onUpdateCharges({ ...charges, shippingCharge: parseFloat(e.target.value) || 0 })}
                placeholder="Shipping fee amount"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
              />
            )}
          </div>

          {/* Additional Charges */}
          <div className="p-4 bg-[#FAF9F7] rounded-xl border border-stone-200/70">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800 mb-2">
              <input
                type="checkbox"
                checked={charges.additionalChargeEnabled}
                onChange={(e) => onUpdateCharges({ ...charges, additionalChargeEnabled: e.target.checked })}
                className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-4 h-4"
              />
              <span>Additional Service Fee</span>
            </label>

            {charges.additionalChargeEnabled && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={charges.additionalChargeLabel}
                  onChange={(e) => onUpdateCharges({ ...charges, additionalChargeLabel: e.target.value })}
                  placeholder="e.g. Travel Logistics"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={charges.additionalCharge}
                  onChange={(e) => onUpdateCharges({ ...charges, additionalCharge: parseFloat(e.target.value) || 0 })}
                  placeholder="Amount"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
                />
              </div>
            )}
          </div>
        </div>

        {/* Round-off & Amount Paid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-[#FAF9F7] rounded-xl border border-stone-200/70 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-stone-800 block">Round-Off Grand Total</span>
              <span className="text-[11px] text-stone-500">Eliminate decimal fractions</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={charges.roundOff}
                onChange={(e) => onUpdateCharges({ ...charges, roundOff: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900"></div>
            </label>
          </div>

          <div className="p-3.5 bg-[#FAF9F7] rounded-xl border border-stone-200/70">
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Advance Deposit / Amount Paid
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={charges.amountPaid || ''}
              onChange={(e) => onUpdateCharges({ ...charges, amountPaid: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 50000 (Calculates balance due)"
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-stone-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
