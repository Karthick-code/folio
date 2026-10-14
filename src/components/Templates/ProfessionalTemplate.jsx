import React from 'react';
import { formatCurrency } from '../../utils/calculations.js';

export const ProfessionalTemplate = ({ data, breakdown }) => {
  const { business = {}, customer = {}, invoice = {}, items = [], customFields = [], payment = {}, notesTerms = {}, template = {} } = data || {};
  const currency = invoice.currency;
  const accent = template.accentColor || '#1E293B';

  return (
    <div className="p-8 bg-white text-slate-800 font-sans text-[12.5px] leading-relaxed">
      {/* Executive Header Box */}
      <div className="border border-slate-300 rounded-sm mb-6">
        <div className="p-5 flex justify-between items-start border-b border-slate-200 bg-slate-50/50">
          <div className="max-w-[60%]">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name || 'Company Logo'}
                className="h-12 max-w-[180px] object-contain mb-2"
                referrerPolicy="no-referrer"
              />
            ) : null}
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">{business.name || 'Company Name'}</h1>
            {business.extraInfo && <p className="text-[11px] text-slate-500">{business.extraInfo}</p>}
            <div className="text-xs text-slate-600 mt-2 space-y-0.5">
              {business.address && <p className="whitespace-pre-line">{business.address}</p>}
              <p>
                {business.phone && <span>Tel: {business.phone} </span>}
                {business.phone && business.email && <span>| </span>}
                {business.email && <span>Email: {business.email}</span>}
              </p>
              {business.website && <p>Web: {business.website}</p>}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black tracking-wider uppercase text-slate-800">
              COMMERCIAL INVOICE
            </div>
            <div className="mt-2 text-xs space-y-1">
              <p className="font-semibold text-slate-900">
                Invoice No: <span className="font-mono-num">{invoice.invoiceNumber || 'INV-001'}</span>
              </p>
              <p className="text-slate-600">
                Date: <span className="font-medium text-slate-800">{invoice.date || '—'}</span>
              </p>
              <p className="text-slate-600">
                Payment Due: <span className="font-medium text-slate-800">{invoice.dueDate || '—'}</span>
              </p>
              {invoice.poNumber && (
                <p className="text-slate-600">
                  PO Number: <span className="font-medium text-slate-800">{invoice.poNumber}</span>
                </p>
              )}
              {invoice.customReference && (
                <p className="text-slate-600">
                  Ref Code: <span className="font-medium text-slate-800">{invoice.customReference}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tax IDs & Registration Row */}
        <div className="px-5 py-2 bg-slate-100 text-[11px] text-slate-600 flex justify-between items-center border-t border-slate-200">
          <div>
            {business.taxId && <span className="mr-4"><strong>GSTIN / Tax ID:</strong> {business.taxId}</span>}
            {business.panOrBusinessId && <span><strong>Company Registration:</strong> {business.panOrBusinessId}</span>}
          </div>
          <div className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: accent }}>
            STATUS: {(invoice.status || 'pending').replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Bill To / Ship To Two Column Table */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-slate-200 p-4 rounded-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 pb-1 border-b border-slate-100">
            BILL TO (CLIENT DETAILS)
          </div>
          <div className="font-bold text-slate-900 text-[13px]">{customer.name || 'Customer Name'}</div>
          {customer.company && <div className="text-slate-700 font-medium text-xs">{customer.company}</div>}
          {customer.address && <div className="text-xs text-slate-600 mt-1 whitespace-pre-line">{customer.address}</div>}
          <div className="mt-2 text-xs text-slate-500 space-y-0.5">
            {customer.taxId && <p><strong>Tax ID / GSTIN:</strong> {customer.taxId}</p>}
            {customer.email && <p>Email: {customer.email}</p>}
            {customer.phone && <p>Tel: {customer.phone}</p>}
          </div>
        </div>

        <div className="border border-slate-200 p-4 rounded-sm">
          {customer.useShippingAddress && customer.shippingAddress ? (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 pb-1 border-b border-slate-100">
                SHIP TO (DELIVERY ADDRESS)
              </div>
              <p className="text-xs text-slate-600 whitespace-pre-line">{customer.shippingAddress}</p>
            </div>
          ) : customFields.length > 0 ? (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 pb-1 border-b border-slate-100">
                CONTRACT & SPECIFICATIONS
              </div>
              <div className="space-y-1.5 text-xs">
                {customFields.map((cf) => (
                  <div key={cf.id} className="flex justify-between py-0.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500">{cf.label}:</span>
                    <span className="font-semibold text-slate-800 text-right">{cf.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 pb-1 border-b border-slate-100">
                PAYMENT SUMMARY
              </div>
              <p className="text-xs text-slate-500 mt-1">Please remit balance prior to due date.</p>
              <div className="mt-3 text-lg font-black font-mono-num text-slate-900">
                {formatCurrency(breakdown?.grandTotal || 0, currency)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Structured Table */}
      <div className="border border-slate-300 rounded-sm overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-[11px] uppercase tracking-wider font-bold border-b border-slate-300">
              <th className="py-2.5 px-3 border-r border-slate-200 w-10 text-center">#</th>
              <th className="py-2.5 px-3 border-r border-slate-200">Description of Goods / Services</th>
              <th className="py-2.5 px-2 text-center border-r border-slate-200 w-16">Qty</th>
              <th className="py-2.5 px-3 text-right border-r border-slate-200 w-24">Unit Rate</th>
              {items.some((i) => i.discountValue > 0) && (
                <th className="py-2.5 px-2 text-right border-r border-slate-200 w-20">Discount</th>
              )}
              {data?.taxes?.mode === 'per_item' && (
                <th className="py-2.5 px-2 text-right border-r border-slate-200 w-16">Tax %</th>
              )}
              <th className="py-2.5 px-3 text-right w-28">Total Amount</th>
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
                  <td className="py-2.5 px-3 text-center text-slate-400 border-r border-slate-200">{idx + 1}</td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <span className="font-semibold text-slate-900">{item.description || 'Item Description'}</span>
                    {item.unit && item.unit !== 'Qty' && (
                      <span className="text-[10px] text-slate-400 ml-2">({item.unit})</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center text-slate-700 border-r border-slate-200">{qty}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700 font-mono-num border-r border-slate-200">{formatCurrency(rate, currency)}</td>
                  {items.some((i) => i.discountValue > 0) && (
                    <td className="py-2.5 px-2 text-right text-slate-500 font-mono-num border-r border-slate-200">
                      {item.discountValue > 0 ? (
                        item.discountType === 'percent' ? `${item.discountValue}%` : formatCurrency(item.discountValue, currency)
                      ) : '—'}
                    </td>
                  )}
                  {data?.taxes?.mode === 'per_item' && (
                    <td className="py-2.5 px-2 text-right text-slate-500 font-mono-num border-r border-slate-200">
                      {item.taxRate ? `${item.taxRate}%` : '—'}
                    </td>
                  )}
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono-num">
                    {formatCurrency(lineAmount, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financial Breakdown */}
      <div className="flex justify-end mb-6 page-break-inside-avoid">
        <div className="w-80 border border-slate-300 rounded-sm overflow-hidden text-xs">
          <div className="p-3 bg-slate-50 space-y-1.5 border-b border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Gross Subtotal</span>
              <span className="font-mono-num">{formatCurrency(breakdown?.rawSubtotal || 0, currency)}</span>
            </div>

            {(breakdown?.totalItemDiscounts || 0) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Item Level Discounts</span>
                <span className="font-mono-num">- {formatCurrency(breakdown.totalItemDiscounts, currency)}</span>
              </div>
            )}

            {(breakdown?.invoiceDiscountAmount || 0) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Invoice Discount {data?.discount?.type === 'percent' ? `(${data.discount.value}%)` : ''}</span>
                <span className="font-mono-num">- {formatCurrency(breakdown.invoiceDiscountAmount, currency)}</span>
              </div>
            )}

            {((breakdown?.totalItemDiscounts || 0) > 0 || (breakdown?.invoiceDiscountAmount || 0) > 0) && (
              <div className="flex justify-between text-slate-800 font-semibold pt-1 border-t border-slate-200">
                <span>Net Taxable Base</span>
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
                <span>Freight / Shipping</span>
                <span className="font-mono-num">{formatCurrency(breakdown.shippingAmount, currency)}</span>
              </div>
            )}

            {(breakdown?.additionalAmount || 0) > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>{data?.charges?.additionalChargeLabel || 'Handling Charge'}</span>
                <span className="font-mono-num">{formatCurrency(breakdown.additionalAmount, currency)}</span>
              </div>
            )}

            {(breakdown?.roundOffAdjustment || 0) !== 0 && (
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Rounding Adjustment</span>
                <span className="font-mono-num">
                  {breakdown.roundOffAdjustment > 0 ? `+${formatCurrency(breakdown.roundOffAdjustment, currency)}` : formatCurrency(breakdown.roundOffAdjustment, currency)}
                </span>
              </div>
            )}
          </div>

          <div className="p-3 bg-white space-y-1">
            <div className="flex justify-between text-sm font-black text-slate-900">
              <span>TOTAL DUE</span>
              <span className="font-mono-num">{formatCurrency(breakdown?.grandTotal || 0, currency)}</span>
            </div>

            {(breakdown?.amountPaid || 0) > 0 && (
              <>
                <div className="flex justify-between text-slate-600 text-xs pt-1 border-t border-slate-100">
                  <span>Amount Paid / Deposit</span>
                  <span className="font-mono-num">{formatCurrency(breakdown.amountPaid, currency)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-rose-600">
                  <span>NET BALANCE DUE</span>
                  <span className="font-mono-num">{formatCurrency(breakdown.balanceDue, currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Banking & Signatures */}
      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-300 page-break-inside-avoid">
        <div>
          {payment.enabled && (
            <div className="border border-slate-200 p-3 rounded-sm mb-3 bg-slate-50/50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Remittance & Bank Instructions
              </div>
              <div className="text-xs space-y-0.5 text-slate-700">
                {payment.bankName && <p><strong>Bank:</strong> {payment.bankName}</p>}
                {payment.accountHolder && <p><strong>Account Name:</strong> {payment.accountHolder}</p>}
                {payment.accountNumber && <p><strong>Account Number:</strong> <span className="font-mono-num">{payment.accountNumber}</span></p>}
                {payment.ifscOrRouting && <p><strong>IFSC / Routing / SWIFT:</strong> <span className="font-mono-num">{payment.ifscOrRouting}</span></p>}
                {payment.upiId && <p><strong>UPI ID:</strong> {payment.upiId}</p>}
                {payment.instructions && <p className="text-[11px] text-slate-500 italic mt-1">{payment.instructions}</p>}
              </div>
            </div>
          )}

          {notesTerms.notes && (
            <div className="mb-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notes</div>
              <p className="text-xs text-slate-600">{notesTerms.notes}</p>
            </div>
          )}

          {notesTerms.terms && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Terms & Conditions</div>
              <p className="text-[11px] text-slate-500 whitespace-pre-line">{notesTerms.terms}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-end items-end text-right">
          {notesTerms.signatureEnabled && (
            <div className="border border-slate-200 p-4 rounded-sm w-56 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Authorized Signatory</div>
              {notesTerms.signatureImage ? (
                <img
                  src={notesTerms.signatureImage}
                  alt="Signature"
                  className="h-12 max-w-[140px] object-contain mx-auto mb-1"
                />
              ) : (
                <div className="h-12 border-b border-slate-300 mx-4 mb-2" />
              )}
              <div className="font-bold text-slate-900 text-xs">{notesTerms.signatureName || business.name}</div>
              <div className="text-[10px] text-slate-500">{notesTerms.signatureRole || 'For ' + (business.name || 'Company')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
