import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Generates an A4 PDF from a DOM element using html2canvas-pro and jsPDF.
 * Accurately supports single and multi-page invoices with professional formatting,
 * including modern CSS color spaces (oklab, oklch, lab, rgb, hex).
 */
export async function generateInvoicePdf(element, options = {}) {
  const { onProgress } = options;

  onProgress?.('Preparing invoice layout for PDF rendering...');

  // Save original styling
  const originalWidth = element.style.width;
  const originalTransform = element.style.transform;
  const originalBoxShadow = element.style.boxShadow;

  try {
    element.style.transform = 'none';
    element.style.boxShadow = 'none';

    onProgress?.('Rendering high-resolution document canvas...');

    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for crisp high-DPI text
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // Standard 96 DPI A4 width in pixels (210mm)
      onclone: (clonedDoc) => {
        const captureNode = clonedDoc.getElementById('invoice-capture-area');
        if (captureNode) {
          captureNode.style.backgroundColor = '#ffffff';
          captureNode.style.boxShadow = 'none';
          captureNode.style.transform = 'none';
        }
      },
    });

    onProgress?.('Generating PDF document...');

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 0;

    // Calculate image dimensions in PDF mm
    const imgWidth = pdfWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;

    // First page
    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Additional pages if invoice content spans multiple pages
    while (heightLeft > 5) {
      position = -(pageNumber * pdfHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
      pageNumber++;
    }

    onProgress?.('Finalizing PDF file...');

    const blob = pdf.output('blob');
    return blob;
  } finally {
    // Restore original styles
    element.style.width = originalWidth;
    element.style.transform = originalTransform;
    element.style.boxShadow = originalBoxShadow;
  }
}

/**
 * Triggers direct download of the invoice PDF
 */
export async function downloadInvoicePdf(element, filename = 'Invoice.pdf', onProgress) {
  const blob = await generateInvoicePdf(element, { filename, onProgress });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Triggers standard browser print dialog
 */
export function printInvoice() {
  window.print();
}
