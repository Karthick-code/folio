const NUMBERING_STORAGE_KEY = 'universal_invoice_numbering_settings';

export const DEFAULT_NUMBERING_SETTINGS = {
  prefix: 'INV',
  nextNumber: 1001,
  separator: '-',
  autoIncrement: true,
  includeYear: false,
};

/**
 * Format invoice number from configuration
 */
export function formatInvoiceNumber(settings = DEFAULT_NUMBERING_SETTINGS) {
  const numStr = String(settings.nextNumber || 1001);
  const currentYear = new Date().getFullYear();
  const sep = settings.separator ?? '-';

  if (settings.includeYear) {
    return `${currentYear}${sep}${settings.prefix}${sep}${numStr}`;
  }

  if (!settings.prefix || !settings.prefix.trim()) {
    return numStr;
  }

  return `${settings.prefix}${sep}${numStr}`;
}

/**
 * Load numbering settings from browser localStorage safely
 */
export function loadNumberingSettings() {
  try {
    const raw = localStorage.getItem(NUMBERING_STORAGE_KEY);
    if (!raw) return DEFAULT_NUMBERING_SETTINGS;

    const parsed = JSON.parse(raw);
    return {
      prefix: typeof parsed.prefix === 'string' ? parsed.prefix : DEFAULT_NUMBERING_SETTINGS.prefix,
      nextNumber: typeof parsed.nextNumber === 'number' && !isNaN(parsed.nextNumber) ? parsed.nextNumber : DEFAULT_NUMBERING_SETTINGS.nextNumber,
      separator: typeof parsed.separator === 'string' ? parsed.separator : DEFAULT_NUMBERING_SETTINGS.separator,
      autoIncrement: typeof parsed.autoIncrement === 'boolean' ? parsed.autoIncrement : DEFAULT_NUMBERING_SETTINGS.autoIncrement,
      includeYear: typeof parsed.includeYear === 'boolean' ? parsed.includeYear : false,
    };
  } catch (e) {
    console.warn('Could not read numbering settings from localStorage', e);
    return DEFAULT_NUMBERING_SETTINGS;
  }
}

/**
 * Save numbering settings to browser localStorage
 */
export function saveNumberingSettings(settings) {
  try {
    localStorage.setItem(NUMBERING_STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.warn('Could not save numbering settings to localStorage', e);
    return false;
  }
}

/**
 * Increment the next invoice number in localStorage and return the new settings
 */
export function incrementInvoiceNumber() {
  const current = loadNumberingSettings();
  if (!current.autoIncrement) return current;

  const updated = {
    ...current,
    nextNumber: current.nextNumber + 1,
  };

  saveNumberingSettings(updated);
  return updated;
}
