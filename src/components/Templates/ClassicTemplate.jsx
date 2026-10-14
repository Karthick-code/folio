import React from 'react';
import { formatCurrency } from '../../utils/calculations.js';

export const ClassicTemplate = ({ data, breakdown }) => {
  const { business = {}, customer = {}, invoice = {}, items = [], customFields = [], payment = {}, notesTerms = {}, template = {} } = data || {};
  const currency = invoice.currency;

  return (
    <div className="p-8 bg-white text-slate-800 font-serif-display text-[13px] leading-relaxed">
      {/* Traditional Double Line Top Header */}
      <div className="border-b-4 border-double border-slate-900 pb-5 mb-6">
        <div className="flex justify-between items-start">
          <div className="max-w-[60%]">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name || 'Business Logo'}
                className="h-14 max-w-[190px] object-contain mb-2"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 font-serif-display">{business.name || 'Business Name'}</h1>
            {business.extraInfo && <p className="text-xs text-slate-600 italic mt-0.5">{business.extraInfo}</p>}
            <div className="mt-2 text-xs font-sans text-slate-700 space-y-0.5">
              {business.address && <p className="whitespace-pre-line">{business.address}</p>}
              <p>
                {business.phone && <span>Phone: {business.phone}</span>}
                {business.phone && business.email && <span> · </span>}
                {business.email && <span>Email: {business.email}</span>}
              </p>
              {business.website && <p>{business.website}</p>}
              {(business.taxId || business.panOrBusinessId) && (
                <p className="text-[11px] text-slate-500">
                  {business.taxId && <span>Tax ID: {business.taxId} </span>}
                  {business.panOrBusinessId && <span>PAN: {business.panOrBusinessId}</span>}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-3xl font-normal tracking-wider uppercase text-slate-900 border-b border-slate-300 pb-1 inline-block">
              INVOICE
            </h2>
            <div className="mt-3 font-sans text-xs space-y-1">
              <p><strong className="text-slate-900 font-serif-display">Invoice No:</strong> <span className="font-mono-num">{invoice.invoiceNumber || 'INV-001'}</span></p>
              <p><strong className="text-slate-900 font-serif-display">Date:</strong> {invoice.date || '—'}</p>
              <p><strong className="text-slate-900 font-serif-display">Payment Due:</strong> {invoice.dueDate || '—'}</p>
              {invoice.poNumber && <p><strong className="text-slate-900 font-serif-display">P.O. Number:</strong> {invoice.poNumber}</p>}
              {invoice.customReference && <p><strong className="text-slate-900 font-serif-display">Reference:</strong> {invoice.customReference}</p>}
              <div className="pt-1">
                <span className="inline-block uppercase tracking-wider text-[10px] font-bold px-2 py-0.5 border border-slate-800">
                  {(invoice.status || 'pending').replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To & Info */}
      <div className="grid grid-cols-2 gap-8 mb-6 font-sans">
        <div className="border-l-2 border-slate-800 pl-4">
          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1 font-serif-display">
            Invoiced To:
          </div>
          <div className="font-bold text-slate-950 text-base">{customer.name || 'Customer Name'}</div>
          {customer.company && <div className="text-slate-700 text-xs font-medium">{customer.company}</div>}
          {customer.address && <div className="text-xs text-slate-600 mt-1 whitespace-pre-line">{customer.address}</div>}
          <div className="text-xs text-slate-500 mt-1 space-y-0.5">
            {customer.email && <p>Email: {customer.email}</p>}
            {customer.phone && <p>Tel: {customer.phone}</p>}
            {customer.taxId && <p>Tax ID: {customer.taxId}</p>}
          </div>

          {customer.useShippingAddress && customer.shippingAddress && (
            <div className="mt-3 pt-2 border-t border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Shipping Destination:</div>
              <p className="text-xs text-slate-600 whitespace-pre-line">{customer.shippingAddress}</p>
            </div>
          )}
        </div>

        {customFields.length > 0 && (
          <div className="border border-slate-200 p-3 bg-slate-50/50">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-2 font-serif-display border-b border-slate-200 pb-1">
              Order Specifics
            </div>
            <div className="space-y-1.5 text-xs">
              {customFields.map((cf) => (
                <div key={cf.id} className="flex justify-between py-0.5 border-b border-slate-100 last:border-0">
                  <span className="text-slate-600 font-medium">{cf.label}:</span>
                  <span className="font-semibold text-slate-900 text-right">{cf.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-6 font-sans">
        <table className="w-full text-left border-t-2 border-b-2 border-slate-900">
          <thead>
            <tr className="border-b border-slate-300 text-[11px] uppercase tracking-wider text-slate-800 font-serif-display font-bold">
              <th className="py-2.5">Item Description</th>
              <th className="py-2.5 text-center w-16">Quantity</th>
              <th className="py-2.5 text-right w-24">Unit Price</th>
              {items.some((i) => i.discountValue > 0) && (
                <th className="py-2.5 text-right w-20">Discount</th>
              )}
              {data?.taxes?.mode === 'per_item' && (
                <th className="py-2.5 text-right w-16">Tax</th>
              )}
              <th className="py-2.5 text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
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
                  <td className="py-3 pr-2">
                    <p className="font-medium text-slate-900">{item.description || 'Service Description'}</p>
                    {item.unit && item.unit !== 'Qty' && (
                      <span className="text-[10px] text-slate-400">({item.unit})</span>
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
                  <td className="py-3 text-right font-bold text-slate-900 font-mono-num">
                    {formatCurrency(lineAmount, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="flex justify-end mb-6 font-sans page-break-inside-avoid">
        <div className="w-80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-700">
            <span>Subtotal:</span>
            <span className="font-mono-num">{formatCurrency(breakdown?.rawSubtotal || 0, currency)}</span>
          </div>

          {(breakdown?.totalItemDiscounts || 0) > 0 && (
            <div className="flex justify-between text-emerald-800">
              <span>Less: Item Discounts</span>
              <span className="font-mono-num">- {formatCurrency(breakdown.totalItemDiscounts, currency)}</span>
            </div>
          )}

          {(breakdown?.invoiceDiscountAmount || 0) > 0 && (
            <div className="flex justify-between text-emerald-800">
              <span>Less: Invoice Discount {data?.discount?.type === 'percent' ? `(${data.discount.value}%)` : ''}</span>
              <span className="font-mono-num">- {formatCurrency(breakdown.invoiceDiscountAmount, currency)}</span>
            </div>
          )}

          {((breakdown?.totalItemDiscounts || 0) > 0 || (breakdown?.invoiceDiscountAmount || 0) > 0) && (
            <div className="flex justify-between text-slate-900 font-semibold pt-1 border-t border-slate-200">
              <span>Taxable Subtotal:</span>
              <span className="font-mono-num">{formatCurrency(breakdown.taxableSubtotal, currency)}</span>
            </div>
          )}

          {(breakdown?.taxesBreakdown || []).map((t, idx) => (
            <div key={idx} className="flex justify-between text-slate-700">
              <span>{t.name} {t.rate !== undefined ? `(${t.rate}%)` : ''}:</span>
              <span className="font-mono-num">{formatCurrency(t.amount, currency)}</span>
            </div>
          ))}

          {(breakdown?.shippingAmount || 0) > 0 && (
            <div className="flex justify-between text-slate-700">
              <span>Freight / Shipping:</span>
              <span className="font-mono-num">{formatCurrency(breakdown.shippingAmount, currency)}</span>
            </div>
          )}

          {(breakdown?.additionalAmount || 0) > 0 && (
            <div className="flex justify-between text-slate-700">
              <span>{data?.charges?.additionalChargeLabel || 'Additional Fee'}:</span>
              <span className="font-mono-num">{formatCurrency(breakdown.additionalAmount, currency)}</span>
            </div>
          )}

          {(breakdown?.roundOffAdjustment || 0) !== 0 && (
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Round Off:</span>
              <span className="font-mono-num">
                {breakdown.roundOffAdjustment > 0 ? `+${formatCurrency(breakdown.roundOffAdjustment, currency)}` : formatCurrency(breakdown.roundOffAdjustment, currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t-2 border-slate-900 font-serif-display">
            <span>TOTAL AMOUNT:</span>
            <span className="font-mono-num">{formatCurrency(breakdown?.grandTotal || 0, currency)}</span>
          </div>

          {(breakdown?.amountPaid || 0) > 0 && (
            <>
              <div className="flex justify-between text-slate-700 pt-1">
                <span>Paid / Advance:</span>
                <span className="font-mono-num">{formatCurrency(breakdown.amountPaid, currency)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-rose-700 border-t border-slate-300 pt-1">
                <span>BALANCE OWED:</span>
                <span className="font-mono-num">{formatCurrency(breakdown.balanceDue, currency)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment & Terms Section */}
      <div className="border-t-2 border-double border-slate-900 pt-5 grid grid-cols-2 gap-8 font-sans page-break-inside-avoid">
        <div>
          {payment.enabled && (
            <div className="mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-serif-display mb-1.5">
                Bank & Payment Instructions
              </h3>
              <div className="space-y-0.5 text-xs text-slate-700">
                {payment.bankName && <p><strong>Bank:</strong> {payment.bankName}</p>}
                {payment.accountHolder && <p><strong>Beneficiary:</strong> {payment.accountHolder}</p>}
                {payment.accountNumber && <p><strong>Account Number:</strong> <span className="font-mono-num">{payment.accountNumber}</span></p>}
                {payment.ifscOrRouting && <p><strong>IFSC / Routing:</strong> <span className="font-mono-num">{payment.ifscOrRouting}</span></p>}
                {payment.upiId && <p><strong>UPI ID:</strong> {payment.upiId}</p>}
                {payment.instructions && <p className="text-[11px] text-slate-600 italic mt-1">{payment.instructions}</p>}
              </div>
            </div>
          )}

          {notesTerms.notes && (
            <div className="mb-2">
              <div className="text-[11px] uppercase font-bold text-slate-600 font-serif-display">Client Notes</div>
              <p className="text-xs text-slate-600 italic">{notesTerms.notes}</p>
            </div>
          )}

          {notesTerms.terms && (
            <div>
              <div className="text-[11px] uppercase font-bold text-slate-600 font-serif-display">Terms of Payment</div>
              <p className="text-[11px] text-slate-500 whitespace-pre-line">{notesTerms.terms}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end items-end text-right">
          {notesTerms.signatureEnabled && (
            <div className="text-center w-52">
              {notesTerms.signatureImage ? (
                <img
                  src={notesTerms.signatureImage}
                  alt="Signature"
                  className="h-12 max-w-[150px] object-contain mx-auto mb-1"
                />
              ) : (
                <div className="h-12 border-b border-slate-400 mx-auto mb-1" />
              )}
              <div className="font-bold text-slate-900 text-xs font-serif-display">{notesTerms.signatureName || business.name}</div>
              <div className="text-[10px] text-slate-500 uppercase">{notesTerms.signatureRole || 'Authorized Signatory'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
