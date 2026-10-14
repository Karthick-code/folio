export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
};

/**
 * Accurately round numbers to decimal places avoiding floating point imprecision
 */
export function round(value, decimals = 2) {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Format currency with proper symbol and locale formatting
 */
export function formatCurrency(amount, currencyCode = 'INR', showSymbol = true) {
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const safeAmount = isNaN(amount) ? 0 : amount;

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
    }).format(safeAmount);

    return showSymbol ? `${config.symbol} ${formatted}` : formatted;
  } catch {
    const fallbackFormatted = safeAmount.toFixed(currencyCode === 'JPY' ? 0 : 2);
    return showSymbol ? `${config.symbol} ${fallbackFormatted}` : fallbackFormatted;
  }
}

/**
 * Calculate amount for a single item
 */
export function calculateItemAmount(item, taxMode = 'single') {
  const qty = Math.max(0, Number(item.quantity) || 0);
  const rate = Math.max(0, Number(item.rate) || 0);
  const base = round(qty * rate);

  let discount = 0;
  if (item.discountValue > 0) {
    if (item.discountType === 'percent') {
      discount = round(base * (Math.min(100, item.discountValue) / 100));
    } else {
      discount = round(Math.min(base, item.discountValue));
    }
  }

  const net = round(Math.max(0, base - discount));

  let tax = 0;
  if (taxMode === 'per_item' && item.taxRate > 0) {
    tax = round(net * (item.taxRate / 100));
  }

  const total = round(net + tax);

  return { base, discount, net, tax, total };
}

/**
 * Complete calculation engine for the invoice
 */
export function calculateInvoice(data) {
  const { items = [], discount = {}, taxes = {}, charges = {} } = data || {};

  let rawSubtotal = 0;
  let totalItemDiscounts = 0;
  let perItemTaxTotal = 0;

  // 1. Process items
  items.forEach((item) => {
    const itemCalc = calculateItemAmount(item, taxes.mode);
    rawSubtotal = round(rawSubtotal + itemCalc.base);
    totalItemDiscounts = round(totalItemDiscounts + itemCalc.discount);
    if (taxes.enabled && taxes.mode === 'per_item') {
      perItemTaxTotal = round(perItemTaxTotal + itemCalc.tax);
    }
  });

  const subtotalAfterItemDiscounts = round(Math.max(0, rawSubtotal - totalItemDiscounts));

  // 2. Invoice-level discount
  let invoiceDiscountAmount = 0;
  if (discount.enabled && discount.value > 0) {
    if (discount.type === 'percent') {
      invoiceDiscountAmount = round(subtotalAfterItemDiscounts * (Math.min(100, discount.value) / 100));
    } else {
      invoiceDiscountAmount = round(Math.min(subtotalAfterItemDiscounts, discount.value));
    }
  }

  const taxableSubtotal = round(Math.max(0, subtotalAfterItemDiscounts - invoiceDiscountAmount));

  // 3. Tax calculations
  const taxesBreakdown = [];
  let totalTax = 0;

  if (taxes.enabled) {
    if (taxes.mode === 'single') {
      const rate = Math.max(0, Number(taxes.singleTaxRate) || 0);
      const taxAmt = round(taxableSubtotal * (rate / 100));
      taxesBreakdown.push({
        name: taxes.singleTaxName || 'Tax / GST',
        rate,
        amount: taxAmt,
      });
      totalTax = taxAmt;
    } else if (taxes.mode === 'dual') {
      const rate1 = Math.max(0, Number(taxes.dualTax1Rate) || 0);
      const rate2 = Math.max(0, Number(taxes.dualTax2Rate) || 0);
      const tax1 = round(taxableSubtotal * (rate1 / 100));
      const tax2 = round(taxableSubtotal * (rate2 / 100));

      taxesBreakdown.push({
        name: taxes.dualTax1Name || 'CGST',
        rate: rate1,
        amount: tax1,
      });
      taxesBreakdown.push({
        name: taxes.dualTax2Name || 'SGST',
        rate: rate2,
        amount: tax2,
      });
      totalTax = round(tax1 + tax2);
    } else if (taxes.mode === 'per_item') {
      taxesBreakdown.push({
        name: 'Item-Level Taxes Total',
        amount: perItemTaxTotal,
      });
      totalTax = perItemTaxTotal;
    }
  }

  // 4. Additional charges & shipping
  const shippingAmount = charges.shippingEnabled ? round(Math.max(0, Number(charges.shippingCharge) || 0)) : 0;
  const additionalAmount = charges.additionalChargeEnabled ? round(Math.max(0, Number(charges.additionalCharge) || 0)) : 0;

  // 5. Pre-round total
  const preRoundTotal = round(taxableSubtotal + totalTax + shippingAmount + additionalAmount);

  // 6. Round off
  let grandTotal = preRoundTotal;
  let roundOffAdjustment = 0;

  if (charges.roundOff) {
    grandTotal = Math.round(preRoundTotal);
    roundOffAdjustment = round(grandTotal - preRoundTotal);
  }

  // 7. Amount Paid & Balance Due
  const amountPaid = round(Math.max(0, Number(charges.amountPaid) || 0));
  const balanceDue = round(Math.max(0, grandTotal - amountPaid));

  return {
    rawSubtotal,
    totalItemDiscounts,
    subtotalAfterItemDiscounts,
    invoiceDiscountAmount,
    taxableSubtotal,
    taxesBreakdown,
    totalTax,
    shippingAmount,
    additionalAmount,
    preRoundTotal,
    roundOffAdjustment,
    grandTotal,
    amountPaid,
    balanceDue,
  };
}
