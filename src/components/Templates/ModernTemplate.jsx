import React from 'react';
import { formatCurrency } from '../../utils/calculations.js';

export const ModernTemplate = ({ data, breakdown }) => {
  const { business = {}, customer = {}, invoice = {}, items = [], customFields = [], payment = {}, notesTerms = {}, template = {} } = data || {};
  const currency = invoice.currency;
  const accent = template.accentColor || '#1C1917';

  return (
    <div className="bg-white text-slate-800 font-sans text-[13px] leading-relaxed">
      {/* Top Accent Strip */}
      <div className="h-2 w-full" style={{ backgroundColor: accent }} />

      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start pb-6 border-b border-slate-100">
          <div className="max-w-[55%]">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name || 'Business Logo'}
                className="h-14 max-w-[200px] object-contain mb-3"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{business.name || 'Business Name'}</h1>
            {business.extraInfo && <p className="text-xs text-slate-500 mt-1">{business.extraInfo}</p>}
            
            <div className="mt-3 text-xs text-slate-600 space-y-0.5">
              {business.address && <p className="whitespace-pre-line">{business.address}</p>}
              <p>
                {business.email && <span className="font-medium text-slate-700">{business.email}</span>}
                {business.email && business.phone && <span> · </span>}
                {business.phone && <span>{business.phone}</span>}
              </p>
              {business.website && <p className="text-slate-500">{business.website}</p>}
              {(business.taxId || business.panOrBusinessId) && (
                <div className="pt-1 text-[11px] text-slate-500">
                  {business.taxId && <span>Tax ID / GSTIN: <strong className="font-medium text-slate-700">{business.taxId}</strong></span>}
                  {business.taxId && business.panOrBusinessId && <span> · </span>}
                  {business.panOrBusinessId && <span>PAN / ID: <strong className="font-medium text-slate-700">{business.panOrBusinessId}</strong></span>}
                </div>
              )}
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <div
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: accent }}
            >
              INVOICE
            </div>
            <div className="text-slate-900 font-bold text-base mt-1">
              #{invoice.invoiceNumber || 'INV-001'}
            </div>

            <div className="mt-4 bg-slate-50 rounded-lg p-3 text-xs border border-slate-100 min-w-[200px] text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Issue Date</span>
                <span className="font-medium text-slate-800">{invoice.date || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date</span>
                <span className="font-semibold text-slate-900">{invoice.dueDate || '—'}</span>
              </div>
              {invoice.poNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-400">PO Number</span>
                  <span className="font-medium text-slate-800">{invoice.poNumber}</span>
                </div>
              )}
              {invoice.customReference && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference</span>
                  <span className="font-medium text-slate-800">{invoice.customReference}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-400">Status</span>
                <span
                  className="font-bold text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                  {(invoice.status || 'pending').replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Custom Fields Grid */}
        <div className="grid grid-cols-2 gap-8 py-6">
          <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Invoice For</div>
            <div className="text-base font-bold text-slate-900">{customer.name || 'Customer Name'}</div>
            {customer.company && <div className="text-xs font-semibold text-slate-700 mt-0.5">{customer.company}</div>}
            {customer.address && <div className="text-xs text-slate-600 mt-2 whitespace-pre-line">{customer.address}</div>}
            <div className="mt-2 text-xs text-slate-500 space-y-0.5">
              {customer.email && <p>Email: {customer.email}</p>}
              {customer.phone && <p>Phone: {customer.phone}</p>}
              {customer.taxId && <p>Tax ID / GSTIN: {customer.taxId}</p>}
            </div>

            {customer.useShippingAddress && customer.shippingAddress && (
              <div className="mt-3 pt-2 border-t border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Deliver To</div>
                <div className="text-xs text-slate-600 whitespace-pre-line">{customer.shippingAddress}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            {customFields.length > 0 ? (
              <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-100 h-full">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Project / Order Information</div>
                <div className="space-y-2 text-xs">
                  {customFields.map((cf) => (
                    <div key={cf.id} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                      <span className="text-slate-500 font-medium">{cf.label}</span>
                      <span className="font-semibold text-slate-800 text-right">{cf.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-end text-right">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Grand Amount</div>
                  <div className="text-2xl font-black font-mono-num" style={{ color: accent }}>
                    {formatCurrency(breakdown?.grandTotal || 0, currency)}
                  </div>
                  {(breakdown?.balanceDue || 0) > 0 && (breakdown?.amountPaid || 0) > 0 && (
                    <div className="text-xs text-rose-600 font-semibold mt-1">
                      Due: {formatCurrency(breakdown.balanceDue, currency)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="my-2 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left">
            <thead>
              <tr style={{ backgroundColor: accent }} className="text-white text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-4">Item & Description</th>
                <th className="py-2.5 px-3 text-center w-16">Qty</th>
                <th className="py-2.5 px-4 text-right w-24">Rate</th>
                {items.some((i) => i.discountValue > 0) && (
                  <th className="py-2.5 px-3 text-right w-20">Discount</th>
                )}
                {data?.taxes?.mode === 'per_item' && (
                  <th className="py-2.5 px-3 text-right w-16">Tax</th>
                )}
                <th className="py-2.5 px-4 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {items.map((item, idx) => {
                const qty = Number(item.quantity) || 0;
                const rate = Number(item.rate) || 0;
                const base = qty * rate;
                let itemDisc = 0;
                if (item.discountValue > 0) {
                  itemDisc = item.discountType === 'percent' ? (base * item.discountValue) / 100 : item.discountValue;
                }
                const net = Math.max(0, base - itemDisc);
                const tax = data?.taxes?.mode === 'per_item' && item.taxRate ? (net * item.taxRate) / 100 : 0;
                const lineAmount = net + tax;

                return (
                  <tr key={item.id || idx} className={`${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'} page-break-inside-avoid`}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.description || 'Service / Product'}</div>
                      {item.unit && item.unit !== 'Qty' && (
                        <div className="text-[10px] text-slate-400 mt-0.5">Unit: {item.unit}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">{qty}</td>
                    <td className="py-3 px-4 text-right text-slate-700 font-mono-num">{formatCurrency(rate, currency)}</td>
                    {items.some((i) => i.discountValue > 0) && (
                      <td className="py-3 px-3 text-right text-slate-500 font-mono-num">
                        {item.discountValue > 0 ? (
                          item.discountType === 'percent' ? `${item.discountValue}%` : formatCurrency(item.discountValue, currency)
                        ) : '—'}
                      </td>
                    )}
                    {data?.taxes?.mode === 'per_item' && (
                      <td className="py-3 px-3 text-right text-slate-500 font-mono-num">
                        {item.taxRate ? `${item.taxRate}%` : '—'}
                      </td>
                    )}
                    <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono-num">
                      {formatCurrency(lineAmount, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculations / Summary */}
        <div className="flex justify-end pt-4 pb-6 page-break-inside-avoid">
          <div className="w-80 bg-slate-50 rounded-lg p-4 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono-num font-medium">{formatCurrency(breakdown?.rawSubtotal || 0, currency)}</span>
            </div>

            {(breakdown?.totalItemDiscounts || 0) > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Item Discounts</span>
                <span className="font-mono-num">- {formatCurrency(breakdown.totalItemDiscounts, currency)}</span>
              </div>
            )}

            {(breakdown?.invoiceDiscountAmount || 0) > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Invoice Discount {data?.discount?.type === 'percent' ? `(${data.discount.value}%)` : ''}</span>
                <span className="font-mono-num">- {formatCurrency(breakdown.invoiceDiscountAmount, currency)}</span>
              </div>
            )}

            {((breakdown?.totalItemDiscounts || 0) > 0 || (breakdown?.invoiceDiscountAmount || 0) > 0) && (
              <div className="flex justify-between text-slate-700 font-semibold pt-1 border-t border-slate-200">
                <span>Taxable Amount</span>
                <span className="font-mono-num">{formatCurrency(breakdown.taxableSubtotal, currency)}</span>
              </div>
            )}

            {(breakdown?.taxesBreakdown || []).map((t, idx) => (
              <div key={idx} className="flex justify-between text-slate-600">
                <span>{t.name} {t.rate !== undefined ? `(${t.rate}%)` : ''}</span>
                <span className="font-mono-num">{formatCurrency(t.amount, currency)}</span>
              </div>
            ))}

            {(breakdown?.shippingAmount || 0) > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-mono-num">{formatCurrency(breakdown.shippingAmount, currency)}</span>
              </div>
            )}

            {(breakdown?.additionalAmount || 0) > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>{data?.charges?.additionalChargeLabel || 'Additional Charge'}</span>
                <span className="font-mono-num">{formatCurrency(breakdown.additionalAmount, currency)}</span>
              </div>
            )}

            {(breakdown?.roundOffAdjustment || 0) !== 0 && (
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Round Off</span>
                <span className="font-mono-num">
                  {breakdown.roundOffAdjustment > 0 ? `+${formatCurrency(breakdown.roundOffAdjustment, currency)}` : formatCurrency(breakdown.roundOffAdjustment, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t-2 border-slate-300">
              <span>Grand Total</span>
              <span className="font-mono-num" style={{ color: accent }}>{formatCurrency(breakdown?.grandTotal || 0, currency)}</span>
            </div>

            {(breakdown?.amountPaid || 0) > 0 && (
              <>
                <div className="flex justify-between text-slate-600 pt-1">
                  <span>Amount Paid</span>
                  <span className="font-mono-num font-medium">{formatCurrency(breakdown.amountPaid, currency)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-200 pt-1">
                  <span>Balance Due</span>
                  <span className="font-mono-num text-rose-600">{formatCurrency(breakdown.balanceDue, currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer: Payment & Terms */}
        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 page-break-inside-avoid">
          <div>
            {payment.enabled && (
              <div className="mb-4 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">How To Pay</div>
                <div className="text-xs space-y-1 text-slate-700">
                  {payment.bankName && <p><span className="text-slate-400 font-medium">Bank:</span> {payment.bankName}</p>}
                  {payment.accountHolder && <p><span className="text-slate-400 font-medium">Beneficiary:</span> {payment.accountHolder}</p>}
                  {payment.accountNumber && <p><span className="text-slate-400 font-medium">Account:</span> <span className="font-mono-num font-bold">{payment.accountNumber}</span></p>}
                  {payment.ifscOrRouting && <p><span className="text-slate-400 font-medium">Routing / IFSC:</span> <span className="font-mono-num">{payment.ifscOrRouting}</span></p>}
                  {payment.upiId && <p><span className="text-slate-400 font-medium">UPI ID:</span> <span className="font-bold text-slate-900">{payment.upiId}</span></p>}
                  {payment.instructions && <p className="text-[11px] text-slate-500 mt-1 italic">{payment.instructions}</p>}
                </div>
              </div>
            )}

            {notesTerms.notes && (
              <div className="mb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Notes</div>
                <p className="text-xs text-slate-600 whitespace-pre-line">{notesTerms.notes}</p>
              </div>
            )}

            {notesTerms.terms && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Terms & Conditions</div>
                <p className="text-[11px] text-slate-500 whitespace-pre-line">{notesTerms.terms}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-end items-end text-right">
            {notesTerms.signatureEnabled && (
              <div className="p-3 text-center">
                {notesTerms.signatureImage ? (
                  <img
                    src={notesTerms.signatureImage}
                    alt="Signature"
                    className="h-12 max-w-[150px] object-contain mx-auto mb-1"
                  />
                ) : (
                  <div className="h-10 w-40 border-b-2 border-slate-300 mx-auto mb-1" />
                )}
                <div className="font-bold text-slate-900 text-xs">{notesTerms.signatureName || business.name}</div>
                <div className="text-[11px] text-slate-500">{notesTerms.signatureRole || 'Authorized Signatory'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
