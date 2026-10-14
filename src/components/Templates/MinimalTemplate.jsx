import React from 'react';
import { formatCurrency } from '../../utils/calculations.js';

export const MinimalTemplate = ({ data, breakdown }) => {
  const { business = {}, customer = {}, invoice = {}, items = [], customFields = [], payment = {}, notesTerms = {}, template = {} } = data || {};
  const currency = invoice.currency;
  const accent = template.accentColor || '#0f172a';

  return (
    <div className="p-10 bg-white text-slate-800 leading-relaxed font-sans text-[13px]">
      {/* Header */}
      <div className="flex justify-between items-start pb-8 border-b border-slate-200">
        <div className="max-w-[60%]">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name || 'Business Logo'}
              className="h-14 max-w-[200px] object-contain mb-3"
              referrerPolicy="no-referrer"
            />
          ) : null}
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{business.name || 'Your Business Name'}</h1>
          {business.extraInfo && <p className="text-xs text-slate-500 mt-0.5">{business.extraInfo}</p>}
          <div className="mt-2 text-xs text-slate-600 space-y-0.5">
            {business.address && <p className="whitespace-pre-line">{business.address}</p>}
            <p>
              {business.email && <span>{business.email}</span>}
              {business.email && business.phone && <span> · </span>}
              {business.phone && <span>{business.phone}</span>}
            </p>
            {business.website && <p>{business.website}</p>}
            {(business.taxId || business.panOrBusinessId) && (
              <p className="text-[11px] text-slate-500 mt-1">
                {business.taxId && <span>Tax/GSTIN: {business.taxId} </span>}
                {business.taxId && business.panOrBusinessId && <span>· </span>}
                {business.panOrBusinessId && <span>PAN/ID: {business.panOrBusinessId}</span>}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-light tracking-wide text-slate-900 uppercase">INVOICE</div>
          <div className="mt-2 space-y-1 text-xs">
            <p>
              <span className="text-slate-400">Invoice No:</span>{' '}
              <span className="font-semibold text-slate-900">{invoice.invoiceNumber || 'INV-001'}</span>
            </p>
            <p>
              <span className="text-slate-400">Date:</span>{' '}
              <span className="text-slate-700">{invoice.date || '—'}</span>
            </p>
            <p>
              <span className="text-slate-400">Due Date:</span>{' '}
              <span className="text-slate-700">{invoice.dueDate || '—'}</span>
            </p>
            {invoice.poNumber && (
              <p>
                <span className="text-slate-400">PO / Ref:</span>{' '}
                <span className="text-slate-700">{invoice.poNumber}</span>
              </p>
            )}
            {invoice.customReference && (
              <p>
                <span className="text-slate-400">Ref:</span>{' '}
                <span className="text-slate-700">{invoice.customReference}</span>
              </p>
            )}
          </div>

          <div className="mt-3">
            <span
              className="inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 border"
              style={{ borderColor: accent, color: accent }}
            >
              {(invoice.status || 'pending').replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Bill To & Custom Fields */}
      <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-100">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Billed To</h2>
          <div className="font-semibold text-slate-900 text-[14px]">{customer.name || 'Customer Name'}</div>
          {customer.company && <div className="text-slate-600 text-xs font-medium">{customer.company}</div>}
          {customer.address && <div className="text-xs text-slate-600 mt-1 whitespace-pre-line">{customer.address}</div>}
          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
            {customer.email && <p>{customer.email}</p>}
            {customer.phone && <p>{customer.phone}</p>}
            {customer.taxId && <p>Tax ID / GSTIN: {customer.taxId}</p>}
          </div>

          {customer.useShippingAddress && customer.shippingAddress && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Shipping Address</h3>
              <p className="text-xs text-slate-600 whitespace-pre-line">{customer.shippingAddress}</p>
            </div>
          )}
        </div>

        {customFields.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Details</h2>
            {customFields.map((cf) => (
              <div key={cf.id} className="flex justify-between text-xs py-0.5 border-b border-slate-50">
                <span className="text-slate-500">{cf.label}</span>
                <span className="font-medium text-slate-800 text-right">{cf.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="py-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-300 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="py-2 font-semibold">Item & Description</th>
              <th className="py-2 text-center font-semibold w-16">Qty</th>
              <th className="py-2 text-right font-semibold w-24">Rate</th>
              {items.some((i) => i.discountValue > 0) && (
                <th className="py-2 text-right font-semibold w-20">Discount</th>
              )}
              {data?.taxes?.mode === 'per_item' && (
                <th className="py-2 text-right font-semibold w-16">Tax %</th>
              )}
              <th className="py-2 text-right font-semibold w-28">Amount</th>
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
                    <p className="font-medium text-slate-900">{item.description || 'Service / Product'}</p>
                    {item.unit && item.unit !== 'Qty' && (
                      <span className="text-[10px] text-slate-400">Unit: {item.unit}</span>
                    )}
                  </td>
                  <td className="py-3 text-center text-slate-700">{qty}</td>
                  <td className="py-3 text-right text-slate-700 font-mono-num">{formatCurrency(rate, currency)}</td>
                  {items.some((i) => i.discountValue > 0) && (
                    <td className="py-3 text-right text-slate-500 font-mono-num">
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
      <div className="flex justify-end pt-4 pb-6 border-t border-slate-200 page-break-inside-avoid">
        <div className="w-72 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-mono-num">{formatCurrency(breakdown?.rawSubtotal || 0, currency)}</span>
          </div>

          {(breakdown?.totalItemDiscounts || 0) > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Item Discounts</span>
              <span className="font-mono-num">- {formatCurrency(breakdown.totalItemDiscounts, currency)}</span>
            </div>
          )}

          {(breakdown?.invoiceDiscountAmount || 0) > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Invoice Discount {data?.discount?.type === 'percent' ? `(${data.discount.value}%)` : ''}</span>
              <span className="font-mono-num">- {formatCurrency(breakdown.invoiceDiscountAmount, currency)}</span>
            </div>
          )}

          {((breakdown?.totalItemDiscounts || 0) > 0 || (breakdown?.invoiceDiscountAmount || 0) > 0) && (
            <div className="flex justify-between text-slate-700 font-medium pt-1 border-t border-slate-100">
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
              <span>Shipping & Delivery</span>
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

          <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
            <span>Total</span>
            <span className="font-mono-num" style={{ color: accent }}>{formatCurrency(breakdown?.grandTotal || 0, currency)}</span>
          </div>

          {(breakdown?.amountPaid || 0) > 0 && (
            <>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>Amount Paid</span>
                <span className="font-mono-num">{formatCurrency(breakdown.amountPaid, currency)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Balance Due</span>
                <span className="font-mono-num text-rose-600">{formatCurrency(breakdown.balanceDue, currency)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment & Terms Section */}
      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 page-break-inside-avoid">
        <div>
          {payment.enabled && (
            <div className="mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Payment Details</h3>
              <div className="space-y-1 text-xs text-slate-600">
                {payment.bankName && <p><span className="text-slate-400">Bank:</span> {payment.bankName}</p>}
                {payment.accountHolder && <p><span className="text-slate-400">A/C Name:</span> {payment.accountHolder}</p>}
                {payment.accountNumber && <p><span className="text-slate-400">A/C No:</span> <span className="font-mono-num">{payment.accountNumber}</span></p>}
                {payment.ifscOrRouting && <p><span className="text-slate-400">IFSC / Routing:</span> <span className="font-mono-num">{payment.ifscOrRouting}</span></p>}
                {payment.upiId && <p><span className="text-slate-400">UPI ID:</span> <span className="font-semibold text-slate-800">{payment.upiId}</span></p>}
                {payment.instructions && <p className="text-[11px] text-slate-500 mt-1 italic">{payment.instructions}</p>}
              </div>
            </div>
          )}

          {notesTerms.notes && (
            <div className="mt-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Notes</h3>
              <p className="text-xs text-slate-600 whitespace-pre-line">{notesTerms.notes}</p>
            </div>
          )}

          {notesTerms.terms && (
            <div className="mt-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Terms & Conditions</h3>
              <p className="text-[11px] text-slate-500 whitespace-pre-line">{notesTerms.terms}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end items-end text-right">
          {notesTerms.signatureEnabled && (
            <div className="pt-6">
              {notesTerms.signatureImage ? (
                <img
                  src={notesTerms.signatureImage}
                  alt="Signature"
                  className="h-12 max-w-[150px] object-contain ml-auto mb-1"
                />
              ) : (
                <div className="h-10 w-36 border-b border-slate-300 ml-auto mb-1" />
              )}
              <p className="font-semibold text-slate-900 text-xs">{notesTerms.signatureName || business.name}</p>
              <p className="text-[11px] text-slate-500">{notesTerms.signatureRole || 'Authorized Signatory'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
