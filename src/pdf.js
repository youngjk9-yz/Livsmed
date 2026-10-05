import html2pdf from 'html2pdf.js';

/**
 * Generates and downloads a pristine PDF matching the attached LivsMed form.
 * Uses high-scale canvas rendering (2x DPI) for sharp text and crisp table borders.
 */
export async function downloadQuotePDF(element, filename) {
  if (!element) {
    throw new Error('Document element not found for PDF export.');
  }

  const safeFilename = filename || 'LivsMed_Quote_Request_Form.pdf';

  const opt = {
    margin: [0, 0, 0, 0],
    filename: safeFilename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      scrollY: 0,
      scrollX: 0,
      logging: false
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  return html2pdf().set(opt).from(element).save();
}

/**
 * Triggers the browser's native print-to-PDF / print dialog.
 * Supported with @media print CSS for crisp, vector-based PDF creation.
 */
export function printQuotePDF() {
  window.print();
}
