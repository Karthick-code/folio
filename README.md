# FolioInvoices

Folio is a browser-based invoice generator for freelancers, studios, consultants, contractors, and small businesses. Build an invoice with live preview, switch between professional templates, and export a polished A4 PDF.

## Features

- Business and customer details, logo upload, invoice dates, and editable invoice numbering
- Flexible line items for products, services, labour, and other work
- Optional discounts, taxes, charges, payment instructions, custom fields, notes, and terms
- Five invoice layouts with accent-color customization
- Live invoice preview and A4 PDF export / browser print
- Optional local draft save and restore
- No sign-up or backend; invoice data is processed in the browser

## Run locally

**Requirements:** Node.js 20.19+ or 22.12+ recommended for the Vite version in this project.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. To create a production build:

```bash
npm run build
 npm run preview
```

## Privacy note

Folio does not send invoice data to an application server. If you choose **Save draft**, the current draft is stored in your browser's local storage. The saved draft is specific to that browser and device, and can be removed by clearing browser storage. Invoice-number sequence settings are also browser-local and do not synchronize across devices.
