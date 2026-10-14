import React from 'react';
import { formatCurrency } from '../../utils/calculations.js';

export const ElegantTemplate = ({ data, breakdown }) => {
  const { business = {}, customer = {}, invoice = {}, items = [], customFields = [], payment = {}, notesTerms = {}, template = {} } = data || {};
  const currency = invoice.currency;
  const accent = template.accentColor || '#B45309';

  return (
    <div className="p-10 bg-white text-slate-800 font-sans text-[13px] leading-relaxed relative">
      {/* Delicate Double Frame or Subtle Borders */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-amber-900/10 pointer-events-none rounded-sm" />

      {/* Elegant Header */}
      <div className="pb-8 border-b border-amber-900/15 flex justify-between items-start">
        <div className="max-w-[58%]">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name || 'Studio Logo'}
              className="h-16 max-w-[220px] object-contain mb-3"
              referrerPolicy="no-referrer"
            />
          ) : null}
          <h1
            className="text-2xl font-normal tracking-wide text-slate-900 font-elegant-serif"
            style={{ letterSpacing: '0.04em' }}
          >
            {business.name || 'Creative Studio'}
          </h1>
          {business.extraInfo && (
            <p className="text-xs text-amber-900/70 italic mt-0.5 font-elegant-serif text-[14px]">
              {business.extraInfo}
            </p>
          )}

          <div className="mt-3 text-xs text-slate-600 space-y-0.5">
            {business.address && <p className="whitespace-pre-line leading-relaxed">{business.address}</p>}
            <p className="pt-0.5">
              {business.email && <span className="text-slate-800">{business.email}</span>}
              {business.email && business.phone && <span className="text-amber-800/40"> · </span>}
              {business.phone && <span>{business.phone}</span>}
            </p>
            {business.website && <p className="text-amber-900/80">{business.website}</p>}
            {(business.taxId || business.panOrBusinessId) && (
              <p className="text-[11px] text-slate-400 pt-1">
                {business.taxId && <span>GSTIN / Tax ID: {business.taxId}</span>}
                {business.taxId && business.panOrBusinessId && <span> · </span>}
                {business.panOrBusinessId && <span>PAN: {business.panOrBusinessId}</span>}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div
            className="text-3xl font-light tracking-widest font-elegant-serif uppercase"
            style={{ color: accent }}
          >
            INVOICE
          </div>
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            <p>
              <span className="text-slate-400 font-light">Invoice No:</span>{' '}
              <span className="font-semibold text-slate-900 tracking-wider font-mono-num">{invoice.invoiceNumber || 'INV-001'}</span>
            </p>
            <p>
              <span className="text-slate-400 font-light">Date of Issue:</span>{' '}
              <span className="text-slate-800">{invoice.date || '—'}</span>
            </p>
            <p>
              <span className="text-slate-400 font-light">Payment Due:</span>{' '}
              <span className="text-slate-800 font-medium">{invoice.dueDate || '—'}</span>
            </p>
            {invoice.poNumber && (
              <p>
                <span className="text-slate-400 font-light">Contract / PO:</span>{' '}
                <span className="text-slate-800">{invoice.poNumber}</span>
              </p>
            )}
            {invoice.customReference && (
              <p>
                <span className="text-slate-400 font-light">Reference:</span>{' '}
                <span className="text-slate-800">{invoice.customReference}</span>
              </p>
            )}
            <div className="pt-2">
              <span
                className="inline-block text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full border"
                style={{ borderColor: accent, color: accent }}
              >
                {(invoice.status || 'pending').replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Client & Custom Event Details */}
      <div className="grid grid-cols-2 gap-8 py-6 border-b border-amber-900/10">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-amber-900/60 font-semibold mb-1">
            PREPARED FOR
          </div>
          <div className="text-lg font-normal text-slate-900 font-elegant-serif tracking-wide text-[17px]">
            {customer.name || 'Client Name'}
          </div>
          {customer.company && <div className="text-xs text-slate-600 font-medium">{customer.company}</div>}
          {customer.address && <div className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{customer.address}</div>}
          <div className="text-xs text-slate-500 mt-1.5 space-y-0.5">
            {customer.email && <p>{customer.email}</p>}
            {customer.phone && <p>{customer.phone}</p>}
            {customer.taxId && <p>Tax ID: {customer.taxId}</p>}
          </div>

          {customer.useShippingAddress && customer.shippingAddress && (
            <div className="mt-3 pt-2 border-t border-slate-100">
              <div className="text-[9px] uppercase tracking-wider text-amber-900/60 font-semibold">Delivery Address</div>
              <p className="text-xs text-slate-600 whitespace-pre-line">{customer.shippingAddress}</p>
            </div>
          )}
        </div>

        {customFields.length > 0 && (
          <div className="bg-amber-50/40 p-4 rounded border border-amber-900/10">
            <div className="text-[10px] uppercase tracking-widest text-amber-900/70 font-semibold mb-2">
              SESSION & EVENT DETAILS
            </div>
            <div className="space-y-1.5 text-xs">
              {customFields.map((cf) => (
                <div key={cf.id} className="flex justify-between py-0.5 border-b border-amber-900/5 last:border-0">
                  <span className="text-slate-500">{cf.label}</span>
                  <span className="font-medium text-slate-800 text-right">{cf.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="py-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-800 text-[11px] uppercase tracking-wider text-slate-700">
              <th className="py-2.5 font-semibold">Service / Description</th>
              <th className="py-2.5 text-center font-semibold w-16">Qty</th>
              <th className="py-2.5 text-right font-semibold w-24">Rate</th>
              {items.some((i) => i.discountValue > 0) && (
                <th className="py-2.5 text-right font-semibold w-20">Discount</th>
              )}
              {data?.taxes?.mode === 'per_item' && (
                <th className="py-2.5 text-right font-semibold w-16">Tax %</th>
              )}
              <th className="py-2.5 text-right font-semibold w-28">Amount</th>
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
                <tr key={item.id || idx} className="page-break-inside-avoid">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-slate-900">{item.description || 'Service Package'}</p>
                    {item.unit && item.unit !== 'Qty' && (
                      <span className="text-[10px] text-amber-900/60 font-light">({item.unit})</span>
                    )}
                  </td>
                  <td className="py-3 text-center text-slate-600">{qty}</td>
                  <td className="py-3 text-right text-slate-600 font-mono-num">{formatCurrency(rate, currency)}</td>
                  {items.some((i) => i.discountValue > 0) && (
                    <td className="py-3 text-right text-amber-800 font-mono-num">
                      {item.discountValue > 0 ? (
                        item.discountType === 'percent' ? `${item.discountValue}%` : formatCurrency(item.discountValue, currency)
                      ) : '—'}
                    </td>
                  )}
                  {data?.taxes?.mode === 'per_item' && (
                    <td className="py-3 text-right text-slate-500 font-mono-num">
                      {item.taxRate ? `${item.taxRate}%` : '—'}
                    </td>
                  )}
                  <td className="py-3 text-right font-semibold text-slate-900 font-mono-num">
                    {formatCurrency(lineAmount, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="flex justify-end pt-4 pb-6 border-t border-amber-900/15 page-break-inside-avoid">
        <div className="w-80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono-num">{formatCurrency(breakdown?.rawSubtotal || 0, currency)}</span>
          </div>

          {(breakdown?.totalItemDiscounts || 0) > 0 && (
            <div className="flex justify-between text-amber-800">
              <span>Item Discounts</span>
              <span className="font-mono-num">- {formatCurrency(breakdown.totalItemDiscounts, currency)}</span>
            </div>
          )}

          {(breakdown?.invoiceDiscountAmount || 0) > 0 && (
            <div className="flex justify-between text-amber-800">
              <span>Studio Courtesy Discount {data?.discount?.type === 'percent' ? `(${data.discount.value}%)` : ''}</span>
              <span className="font-mono-num">- {formatCurrency(breakdown.invoiceDiscountAmount, currency)}</span>
            </div>
          )}

          {((breakdown?.totalItemDiscounts || 0) > 0 || (breakdown?.invoiceDiscountAmount || 0) > 0) && (
            <div className="flex justify-between text-slate-800 font-medium pt-1 border-t border-slate-100">
              <span>Taxable Subtotal</span>
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
              <span>Album Shipping & Delivery</span>
              <span className="font-mono-num">{formatCurrency(breakdown.shippingAmount, currency)}</span>
            </div>
          )}

          {(breakdown?.additionalAmount || 0) > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>{data?.charges?.additionalChargeLabel || 'Additional Service'}</span>
              <span className="font-mono-num">{formatCurrency(breakdown.additionalAmount, currency)}</span>
            </div>
          )}

          {(breakdown?.roundOffAdjustment || 0) !== 0 && (
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Round Off</span>
              <span className="font-mono-num">
                {breakdown.roundOffAdjustment > 0 ? `+${formatCurrency(breakdown.roundOffAdjustment, currency)}` : formatCurrency(breakdown.roundOffAdjustment, currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-base font-semibold text-slate-900 pt-2 border-t-2 border-slate-800">
            <span className="font-elegant-serif text-lg tracking-wide">Grand Total</span>
            <span className="font-mono-num font-bold" style={{ color: accent }}>{formatCurrency(breakdown?.grandTotal || 0, currency)}</span>
          </div>

          {(breakdown?.amountPaid || 0) > 0 && (
            <>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Advance Deposit Paid</span>
                <span className="font-mono-num">{formatCurrency(breakdown.amountPaid, currency)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Remaining Balance Due</span>
                <span className="font-mono-num text-rose-700">{formatCurrency(breakdown.balanceDue, currency)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Information & Notes */}
      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-amber-900/15 page-break-inside-avoid">
        <div>
          {payment.enabled && (
            <div className="mb-4 bg-amber-50/30 p-3 rounded border border-amber-900/10">
              <div className="text-[10px] uppercase tracking-widest text-amber-900/70 font-semibold mb-1.5">
                PAYMENT INSTRUCTIONS
              </div>
              <div className="text-xs space-y-1 text-slate-700">
                {payment.bankName && <p><span className="text-slate-400">Bank:</span> {payment.bankName}</p>}
                {payment.accountHolder && <p><span className="text-slate-400">Account:</span> {payment.accountHolder}</p>}
                {payment.accountNumber && <p><span className="text-slate-400">A/C No:</span> <span className="font-mono-num">{payment.accountNumber}</span></p>}
                {payment.ifscOrRouting && <p><span className="text-slate-400">IFSC / Code:</span> <span className="font-mono-num">{payment.ifscOrRouting}</span></p>}
                {payment.upiId && <p><span className="text-slate-400">UPI ID:</span> <span className="font-semibold text-amber-900">{payment.upiId}</span></p>}
                {payment.instructions && <p className="text-[11px] text-slate-500 italic mt-1">{payment.instructions}</p>}
              </div>
            </div>
          )}

          {notesTerms.notes && (
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-widest text-amber-900/60 font-semibold mb-0.5">Studio Note</div>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{notesTerms.notes}</p>
            </div>
          )}

          {notesTerms.terms && (
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-900/60 font-semibold mb-0.5">Agreement Terms</div>
              <p className="text-[11px] text-slate-500 whitespace-pre-line leading-relaxed">{notesTerms.terms}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end items-end text-right">
          {notesTerms.signatureEnabled && (
            <div className="pt-4">
              {notesTerms.signatureImage ? (
                <img
                  src={notesTerms.signatureImage}
                  alt="Signature"
                  className="h-12 max-w-[150px] object-contain ml-auto mb-1"
                />
              ) : (
                <div className="h-10 w-40 border-b border-amber-900/30 ml-auto mb-1" />
              )}
              <div className="font-medium text-slate-900 text-xs font-elegant-serif text-[15px]">{notesTerms.signatureName || business.name}</div>
              <div className="text-[11px] text-slate-400 italic">{notesTerms.signatureRole || 'Director of Photography'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
