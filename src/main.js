import './style.css';
import { getProductCatalog, saveProductCatalog, resetProductCatalog } from './catalog.js';
import { downloadQuotePDF, printQuotePDF } from './pdf.js';

// ============================================================================
// State Management
// ============================================================================

const EMPTY_STATE = {
  quoteDate: '',
  customerName: '',
  socNumber: '',
  contactName: '',
  contactTitle: '',
  contactPhone: '',
  idnAgreement: '',
  products: [
    {
      code: '',
      description: '',
      qty: '',
      price: ''
    }
  ],
  comments: '',
  repName: '',
  repEmail: '',
  repPhone: ''
};

const QTY_OPTIONS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
];

let state = {
  ...JSON.parse(JSON.stringify(EMPTY_STATE)),
  zoomLevel: 1.0,
  catalog: getProductCatalog()
};

// ============================================================================
// DOM References
// ============================================================================

const dom = {
  // Inputs
  quoteDate: document.getElementById('input-quote-date'),
  btnSetToday: document.getElementById('btn-set-today'),
  idnAgreement: document.getElementById('input-idn-agreement'),
  customerName: document.getElementById('input-customer-name'),
  socNumber: document.getElementById('input-soc-number'),
  contactName: document.getElementById('input-contact-name'),
  contactTitle: document.getElementById('input-contact-title'),
  contactPhone: document.getElementById('input-contact-phone'),
  productsFormList: document.getElementById('products-form-list'),
  btnAddProduct: document.getElementById('btn-add-product'),
  comments: document.getElementById('input-comments'),
  repName: document.getElementById('input-rep-name'),
  repEmail: document.getElementById('input-rep-email'),
  repPhone: document.getElementById('input-rep-phone'),

  // Preview elements
  previewQuoteDate: document.getElementById('preview-quote-date'),
  previewCustomerName: document.getElementById('preview-customer-name'),
  previewSocNumber: document.getElementById('preview-soc-number'),
  previewContactName: document.getElementById('preview-contact-name'),
  previewContactTitle: document.getElementById('preview-contact-title'),
  previewContactPhone: document.getElementById('preview-contact-phone'),
  previewIdnAgreement: document.getElementById('preview-idn-agreement'),
  previewProductsTbody: document.getElementById('preview-products-tbody'),
  previewCommentsContent: document.getElementById('preview-comments-content'),
  previewRepName: document.getElementById('preview-rep-name'),
  previewRepEmail: document.getElementById('preview-rep-email'),
  previewRepPhone: document.getElementById('preview-rep-phone'),
  quoteDocumentSheet: document.getElementById('quote-document-sheet'),
  documentZoomWrapper: document.getElementById('document-zoom-wrapper'),
  documentCanvasContainer: document.getElementById('document-canvas-container'),

  // Nav & Toolbars
  btnManageCatalog: document.getElementById('btn-manage-catalog'),
  linkOpenCatalog: document.getElementById('link-open-catalog'),
  btnLoadSample: document.getElementById('btn-load-sample'),
  btnClearForm: document.getElementById('btn-clear-form'),
  btnPrintQuote: document.getElementById('btn-print-quote'),
  btnDownloadPdf: document.getElementById('btn-download-pdf'),
  btnDownloadLabel: document.getElementById('btn-download-label'),
  btnQuickDownload: document.getElementById('btn-quick-download'),
  btnZoomIn: document.getElementById('btn-zoom-in'),
  btnZoomOut: document.getElementById('btn-zoom-out'),
  btnZoomFit: document.getElementById('btn-zoom-fit'),
  zoomLevelLabel: document.getElementById('zoom-level-label'),
  catalogCountBadge: document.getElementById('catalog-count-badge'),

  // Catalog Modal
  catalogModal: document.getElementById('catalog-modal'),
  btnCloseCatalogModal: document.getElementById('btn-close-catalog-modal'),
  btnDoneCatalogModal: document.getElementById('btn-done-catalog-modal'),
  newProdCode: document.getElementById('new-prod-code'),
  newProdDesc: document.getElementById('new-prod-desc'),
  newProdPrice: document.getElementById('new-prod-price'),
  btnSaveNewProduct: document.getElementById('btn-save-new-product'),
  modalCatalogCount: document.getElementById('modal-catalog-count'),
  catalogItemsTbody: document.getElementById('catalog-items-tbody'),
  btnExportCatalogJson: document.getElementById('btn-export-catalog-json'),
  btnImportCatalogJson: document.getElementById('btn-import-catalog-json'),
  btnResetCatalog: document.getElementById('btn-reset-catalog'),
  catalogFileInput: document.getElementById('catalog-file-input'),

  // Toast
  toastContainer: document.getElementById('toast-container')
};

// ============================================================================
// Initialization & Event Binding
// ============================================================================

function initApp() {
  updateCatalogBadge();
  populateFormFields();
  renderProductRows();
  updateLivePreview();
  setupEventListeners();
  autoFitZoom();
}

function setupEventListeners() {
  // Real-time input listeners
  dom.quoteDate.addEventListener('input', e => {
    state.quoteDate = e.target.value;
    dom.previewQuoteDate.textContent = state.quoteDate || '';
  });

  dom.btnSetToday.addEventListener('click', () => {
    const today = new Date();
    const formatted = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    dom.quoteDate.value = formatted;
    state.quoteDate = formatted;
    dom.previewQuoteDate.textContent = formatted;
    showToast('Quote date set to today', 'info');
  });

  dom.idnAgreement.addEventListener('change', e => {
    state.idnAgreement = e.target.value;
    dom.previewIdnAgreement.textContent = state.idnAgreement;
  });

  dom.customerName.addEventListener('input', e => {
    state.customerName = e.target.value;
    dom.previewCustomerName.textContent = state.customerName || '';
  });

  dom.socNumber.addEventListener('input', e => {
    state.socNumber = e.target.value;
    dom.previewSocNumber.textContent = state.socNumber || '';
  });

  dom.contactName.addEventListener('input', e => {
    state.contactName = e.target.value;
    dom.previewContactName.textContent = state.contactName || '';
  });

  dom.contactTitle.addEventListener('input', e => {
    state.contactTitle = e.target.value;
    dom.previewContactTitle.textContent = state.contactTitle || '';
  });

  dom.contactPhone.addEventListener('input', e => {
    state.contactPhone = e.target.value;
    dom.previewContactPhone.textContent = state.contactPhone || '';
  });

  dom.comments.addEventListener('input', e => {
    state.comments = e.target.value;
    dom.previewCommentsContent.textContent = state.comments || '';
  });

  dom.repName.addEventListener('input', e => {
    state.repName = e.target.value;
    dom.previewRepName.textContent = state.repName || '';
  });

  dom.repEmail.addEventListener('input', e => {
    state.repEmail = e.target.value;
    dom.previewRepEmail.innerHTML = state.repEmail
      ? `<a href="mailto:${state.repEmail}">${state.repEmail}</a>`
      : '';
  });

  dom.repPhone.addEventListener('input', e => {
    state.repPhone = e.target.value;
    dom.previewRepPhone.textContent = state.repPhone || '';
  });

  // Product Add Button
  dom.btnAddProduct.addEventListener('click', () => {
    const defaultItem = state.catalog[0] || {
      code: '',
      description: '',
      defaultPrice: 0
    };
    // If the list only contains a single completely empty item, populate it instead of appending
    if (state.products.length === 1 && !state.products[0].code && !state.products[0].description && !state.products[0].price && !state.products[0].qty) {
      state.products[0] = {
        code: defaultItem.code,
        description: defaultItem.description,
        qty: '1',
        price: defaultItem.defaultPrice ? formatCurrency(defaultItem.defaultPrice) : ''
      };
    } else {
      state.products.push({
        code: defaultItem.code,
        description: defaultItem.description,
        qty: '1',
        price: defaultItem.defaultPrice ? formatCurrency(defaultItem.defaultPrice) : ''
      });
    }
    renderProductRows();
    updateLivePreview();
  });

  // Clear Form - Clears ALL entries across all sections
  dom.btnClearForm.addEventListener('click', () => {
    state = {
      ...state,
      ...JSON.parse(JSON.stringify(EMPTY_STATE))
    };
    populateFormFields();
    renderProductRows();
    updateLivePreview();
    showToast('All entries cleared', 'info');
  });

  // PDF Export and Print
  const handlePdfDownload = async () => {
    try {
      dom.btnDownloadLabel.textContent = 'Generating PDF...';
      dom.btnDownloadPdf.disabled = true;
      dom.btnQuickDownload.disabled = true;

      // Construct clean filename: LivsMed_Quote_Request_[Customer]_[Date].pdf
      const cleanCustomer = (state.customerName || 'Quote')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 30);
      const cleanDate = (state.quoteDate || 'Date')
        .replace(/[^a-zA-Z0-9_-]/g, '-');
      const filename = `LivsMed_Quote_Request_${cleanCustomer}_${cleanDate}.pdf`;

      showToast('Compiling high-resolution PDF...', 'info');

      // Temporarily ensure 100% zoom scale during canvas capture
      const currentTransform = dom.documentZoomWrapper.style.transform;
      dom.documentZoomWrapper.style.transform = 'scale(1)';

      await downloadQuotePDF(dom.quoteDocumentSheet, filename);

      dom.documentZoomWrapper.style.transform = currentTransform;
      showToast('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF Generation failed:', err);
      showToast('Failed to generate PDF. Using print fallback.', 'warning');
      printQuotePDF();
    } finally {
      dom.btnDownloadLabel.textContent = 'Download PDF';
      dom.btnDownloadPdf.disabled = false;
      dom.btnQuickDownload.disabled = false;
    }
  };

  dom.btnDownloadPdf.addEventListener('click', handlePdfDownload);
  dom.btnQuickDownload.addEventListener('click', handlePdfDownload);
  if (dom.btnPrintQuote) {
    dom.btnPrintQuote.addEventListener('click', () => {
      printQuotePDF();
    });
  }

  // Zoom Controls
  dom.btnZoomIn.addEventListener('click', () => setZoom(state.zoomLevel + 0.1));
  dom.btnZoomOut.addEventListener('click', () => setZoom(state.zoomLevel - 0.1));
  dom.btnZoomFit.addEventListener('click', autoFitZoom);

  // Catalog Modal Triggers
  dom.btnManageCatalog.addEventListener('click', openCatalogModal);
  if (dom.linkOpenCatalog) {
    dom.linkOpenCatalog.addEventListener('click', openCatalogModal);
  }
  dom.btnCloseCatalogModal.addEventListener('click', closeCatalogModal);
  dom.btnDoneCatalogModal.addEventListener('click', closeCatalogModal);

  // Close modal when clicking backdrop
  dom.catalogModal.addEventListener('click', e => {
    if (e.target === dom.catalogModal) {
      closeCatalogModal();
    }
  });

  // Add Product to Catalog
  dom.btnSaveNewProduct.addEventListener('click', handleAddNewProduct);

  // Export / Import / Reset Catalog
  dom.btnExportCatalogJson.addEventListener('click', handleExportCatalog);
  dom.btnImportCatalogJson.addEventListener('click', () => dom.catalogFileInput.click());
  dom.catalogFileInput.addEventListener('change', handleImportCatalog);
  dom.btnResetCatalog.addEventListener('click', handleResetCatalog);

  // Window resize to adjust fit
  window.addEventListener('resize', () => {
    // Only auto fit if currently near fit
  });
}

// ============================================================================
// Form & Live Preview Logic
// ============================================================================

function populateFormFields() {
  dom.quoteDate.value = state.quoteDate;
  dom.idnAgreement.value = state.idnAgreement;
  dom.customerName.value = state.customerName;
  dom.socNumber.value = state.socNumber;
  dom.contactName.value = state.contactName;
  dom.contactTitle.value = state.contactTitle;
  dom.contactPhone.value = state.contactPhone;
  dom.comments.value = state.comments;
  dom.repName.value = state.repName;
  dom.repEmail.value = state.repEmail;
  dom.repPhone.value = state.repPhone;
}

function updateLivePreview() {
  dom.previewQuoteDate.textContent = state.quoteDate || '';
  dom.previewCustomerName.textContent = state.customerName || '';
  dom.previewSocNumber.textContent = state.socNumber || '';
  dom.previewContactName.textContent = state.contactName || '';
  dom.previewContactTitle.textContent = state.contactTitle || '';
  dom.previewContactPhone.textContent = state.contactPhone || '';
  dom.previewIdnAgreement.textContent = state.idnAgreement || '';
  dom.previewCommentsContent.textContent = state.comments || '';
  dom.previewRepName.textContent = state.repName || '';
  dom.previewRepEmail.innerHTML = state.repEmail
    ? `<a href="mailto:${state.repEmail}">${state.repEmail}</a>`
    : '';
  dom.previewRepPhone.textContent = state.repPhone || '';

  renderDocumentProductsTable();
}

/**
 * Calculates line item total pricing based on quantity and unit price.
 * Formats as currency (e.g. $1,925.00). Returns '' if either qty or price is empty or invalid.
 */
function calculateRowTotal(qty, price) {
  if (!qty || !price) return '';
  const numQty = parseFloat(String(qty).replace(/[^0-9.]/g, ''));
  const numPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));
  if (isNaN(numQty) || isNaN(numPrice) || numQty <= 0 || numPrice <= 0) return '';
  const total = numQty * numPrice;
  return '$' + total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Renders the products in the PDF document table.
 * Crucial: Always fills empty blank rows to reach a minimum of 7 total rows,
 * matching the exact visual height and structure of the original attached template!
 */
function renderDocumentProductsTable() {
  dom.previewProductsTbody.innerHTML = '';

  const minRows = 7;
  const items = state.products || [];

  // 1. Render actual filled rows
  items.forEach(item => {
    const tr = document.createElement('tr');
    const rowTotal = calculateRowTotal(item.qty, item.price);
    tr.innerHTML = `
      <td class="td-code">${escapeHtml(item.code || '') || '&nbsp;'}</td>
      <td class="td-desc">${escapeHtml(item.description || '') || '&nbsp;'}</td>
      <td class="td-qty">${escapeHtml(item.qty ? String(item.qty) : '') || '&nbsp;'}</td>
      <td class="td-price">${escapeHtml(item.price || '') || '&nbsp;'}</td>
      <td class="td-total">${escapeHtml(rowTotal) || '&nbsp;'}</td>
    `;
    dom.previewProductsTbody.appendChild(tr);
  });

  // 2. Pad with blank rows to maintain 7-row height matching original template
  const remaining = Math.max(0, minRows - items.length);
  for (let i = 0; i < remaining; i++) {
    const tr = document.createElement('tr');
    tr.className = 'empty-filler-row';
    tr.innerHTML = `
      <td class="td-code">&nbsp;</td>
      <td class="td-desc">&nbsp;</td>
      <td class="td-qty">&nbsp;</td>
      <td class="td-price">&nbsp;</td>
      <td class="td-total">&nbsp;</td>
    `;
    dom.previewProductsTbody.appendChild(tr);
  }
}

/**
 * Renders the interactive product cards in the left Form Editor.
 * Includes dropdown for Product Description & dropdown for Qty (Case).
 */
function renderProductRows() {
  dom.productsFormList.innerHTML = '';

  state.products.forEach((prod, index) => {
    const card = document.createElement('div');
    card.className = 'product-row-card';

    // Build Product Description dropdown options from catalog
    let catalogOptionsHtml = `<option value="">-- Select Product Description --</option>`;
    let isMatchedInCatalog = false;

    state.catalog.forEach(item => {
      const selected = (item.description === prod.description) ? 'selected' : '';
      if (selected) isMatchedInCatalog = true;
      catalogOptionsHtml += `
        <option value="${escapeHtml(item.description)}" data-code="${escapeHtml(item.code)}" data-price="${item.defaultPrice || ''}" ${selected}>
          ${escapeHtml(item.description)}
        </option>
      `;
    });

    catalogOptionsHtml += `
      <option value="__CUSTOM__" ${(!isMatchedInCatalog && prod.description) ? 'selected' : ''}>
        + Enter Custom Product...
      </option>
    `;

    // Build Qty dropdown options: 1 to 20, plus Manual Input option at the bottom
    let qtyOptionsHtml = '<option value="">-- Select Qty --</option>';
    const currentQtyStr = (prod.qty !== undefined && prod.qty !== null) ? String(prod.qty) : '';
    let isQtyMatched = false;

    QTY_OPTIONS.forEach(opt => {
      const isSel = (currentQtyStr && opt === currentQtyStr) ? 'selected' : '';
      if (isSel) isQtyMatched = true;
      qtyOptionsHtml += `<option value="${opt}" ${isSel}>${opt}</option>`;
    });

    const isCustomQty = !isQtyMatched && Boolean(prod.qty);

    qtyOptionsHtml += `
      <option value="__MANUAL__" ${isCustomQty ? 'selected' : ''}>Manual Input...</option>
    `;

    const initialTotal = calculateRowTotal(prod.qty, prod.price);

    card.innerHTML = `
      <div class="product-row-header">
        <div class="product-row-badge-group">
          <span class="product-row-badge">Item #${index + 1}</span>
          <span class="product-row-total-badge" id="product-total-badge-${index}" style="${initialTotal ? '' : 'display: none;'}">
            Total: <strong>${escapeHtml(initialTotal)}</strong>
          </span>
        </div>
        ${state.products.length > 1 ? `
          <button type="button" class="btn-remove-row" data-index="${index}" title="Remove this product row">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ` : ''}
      </div>

      <div class="form-group product-select-wrapper">
        <label>Product Description (Dropdown Menu)</label>
        <select class="product-desc-select form-select" data-index="${index}">
          ${catalogOptionsHtml}
        </select>
      </div>

      <div class="product-custom-desc-wrapper" style="display: ${(!isMatchedInCatalog && prod.description) ? 'block' : 'none'};">
        <div class="form-group">
          <label>Custom Description</label>
          <input type="text" class="product-custom-desc-input" data-index="${index}" placeholder="Type custom product description..." value="${escapeHtml(prod.description || '')}" />
        </div>
      </div>

      <div class="product-details-grid">
        <div class="form-group">
          <label>Product Code</label>
          <input type="text" class="product-code-input" data-index="${index}" placeholder="e.g. 5ACF01-LP" value="${escapeHtml(prod.code || '')}" />
        </div>

        <div class="form-group qty-form-group">
          <label>Qty (Case)</label>
          <select class="product-qty-select form-select" data-index="${index}">
            ${qtyOptionsHtml}
          </select>
          <div class="product-custom-qty-wrapper" style="display: ${isCustomQty ? 'block' : 'none'};">
            <input type="number" min="1" step="1" class="product-custom-qty-input" data-index="${index}" placeholder="Qty #" value="${isCustomQty ? escapeHtml(currentQtyStr) : ''}" />
          </div>
        </div>

        <div class="form-group">
          <label>Requested Pricing/case</label>
          <input type="text" class="product-price-input" data-index="${index}" placeholder="e.g. $1,925" value="${escapeHtml(prod.price || '')}" />
        </div>
      </div>
    `;

    // Row Event Listeners
    const descSelect = card.querySelector('.product-desc-select');
    const customDescWrapper = card.querySelector('.product-custom-desc-wrapper');
    const customDescInput = card.querySelector('.product-custom-desc-input');
    const codeInput = card.querySelector('.product-code-input');
    const qtySelect = card.querySelector('.product-qty-select');
    const customQtyWrapper = card.querySelector('.product-custom-qty-wrapper');
    const customQtyInput = card.querySelector('.product-custom-qty-input');
    const priceInput = card.querySelector('.product-price-input');
    const removeBtn = card.querySelector('.btn-remove-row');
    const totalBadge = card.querySelector(`#product-total-badge-${index}`);

    const syncCardTotalBadge = () => {
      if (!totalBadge) return;
      const t = calculateRowTotal(state.products[index].qty, state.products[index].price);
      if (t) {
        totalBadge.innerHTML = `Total: <strong>${escapeHtml(t)}</strong>`;
        totalBadge.style.display = 'inline-flex';
      } else {
        totalBadge.style.display = 'none';
      }
    };

    descSelect.addEventListener('change', e => {
      const val = e.target.value;
      if (val === '__CUSTOM__') {
        customDescWrapper.style.display = 'block';
        customDescInput.focus();
        state.products[index].description = customDescInput.value;
      } else {
        customDescWrapper.style.display = 'none';
        state.products[index].description = val;

        // Auto populate code and default price from catalog
        const selectedOpt = e.target.selectedOptions[0];
        if (selectedOpt) {
          const autoCode = selectedOpt.getAttribute('data-code');
          const autoPrice = selectedOpt.getAttribute('data-price');
          if (autoCode) {
            state.products[index].code = autoCode;
            codeInput.value = autoCode;
          }
          if (autoPrice) {
            const formattedPrice = formatCurrency(autoPrice);
            state.products[index].price = formattedPrice;
            priceInput.value = formattedPrice;
          }
        }
      }
      syncCardTotalBadge();
      updateLivePreview();
    });

    customDescInput.addEventListener('input', e => {
      state.products[index].description = e.target.value;
      updateLivePreview();
    });

    codeInput.addEventListener('input', e => {
      state.products[index].code = e.target.value;
      updateLivePreview();
    });

    qtySelect.addEventListener('change', e => {
      const val = e.target.value;
      if (val === '__MANUAL__') {
        customQtyWrapper.style.display = 'block';
        customQtyInput.focus();
        customQtyInput.select();
        state.products[index].qty = customQtyInput.value || '';
      } else {
        customQtyWrapper.style.display = 'none';
        state.products[index].qty = val;
      }
      syncCardTotalBadge();
      updateLivePreview();
    });

    customQtyInput.addEventListener('input', e => {
      state.products[index].qty = e.target.value;
      syncCardTotalBadge();
      updateLivePreview();
    });

    priceInput.addEventListener('input', e => {
      state.products[index].price = e.target.value;
      syncCardTotalBadge();
      updateLivePreview();
    });

    priceInput.addEventListener('blur', e => {
      // Auto format currency with dollar sign if digits entered
      let val = e.target.value.trim();
      if (val && !val.startsWith('$') && !isNaN(Number(val.replace(/,/g, '')))) {
        val = formatCurrency(val);
        e.target.value = val;
        state.products[index].price = val;
        syncCardTotalBadge();
        updateLivePreview();
      }
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        state.products.splice(index, 1);
        renderProductRows();
        updateLivePreview();
        showToast('Product row removed', 'info');
      });
    }

    dom.productsFormList.appendChild(card);
  });
}

// ============================================================================
// Catalog Manager Modal Logic
// ============================================================================

function openCatalogModal() {
  state.catalog = getProductCatalog();
  renderCatalogModalTable();
  dom.catalogModal.style.display = 'flex';
}

function closeCatalogModal() {
  dom.catalogModal.style.display = 'none';
  // Re-render form rows so any new catalog items are in the dropdown menus
  renderProductRows();
}

function updateCatalogBadge() {
  const count = state.catalog.length;
  if (dom.catalogCountBadge) {
    dom.catalogCountBadge.textContent = count;
  }
  if (dom.modalCatalogCount) {
    dom.modalCatalogCount.textContent = count;
  }
}

function renderCatalogModalTable() {
  updateCatalogBadge();
  dom.catalogItemsTbody.innerHTML = '';

  state.catalog.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(item.code || '')}</strong></td>
      <td>${escapeHtml(item.description || '')}</td>
      <td>${item.defaultPrice ? formatCurrency(item.defaultPrice) : '-'}</td>
      <td style="text-align: center;">
        <button type="button" class="btn-delete-catalog-item" data-index="${index}" title="Delete from catalog">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    `;

    tr.querySelector('.btn-delete-catalog-item').addEventListener('click', () => {
      state.catalog.splice(index, 1);
      saveProductCatalog(state.catalog);
      renderCatalogModalTable();
      showToast(`Removed product from catalog`, 'info');
    });

    dom.catalogItemsTbody.appendChild(tr);
  });
}

function handleAddNewProduct() {
  const code = dom.newProdCode.value.trim();
  const desc = dom.newProdDesc.value.trim();
  const price = parseFloat(dom.newProdPrice.value) || 0;

  if (!code || !desc) {
    showToast('Please provide both a Product Code and Description.', 'warning');
    return;
  }

  const newItem = {
    code,
    description: desc,
    defaultPrice: price
  };

  state.catalog.unshift(newItem);
  saveProductCatalog(state.catalog);

  // Clear inputs
  dom.newProdCode.value = '';
  dom.newProdDesc.value = '';
  dom.newProdPrice.value = '';

  renderCatalogModalTable();
  showToast(`Added "${desc}" to product catalog!`, 'success');
}

function handleExportCatalog() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.catalog, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', 'livsmed_products_catalog.json');
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  showToast('Catalog exported to JSON', 'info');
}

function handleImportCatalog(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported) && imported.length > 0) {
        state.catalog = imported;
        saveProductCatalog(state.catalog);
        renderCatalogModalTable();
        showToast(`Successfully imported ${imported.length} products!`, 'success');
      } else {
        showToast('Invalid JSON format. Expected an array of products.', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Error reading JSON file.', 'warning');
    }
    dom.catalogFileInput.value = '';
  };
  reader.readAsText(file);
}

function handleResetCatalog() {
  if (confirm('Are you sure you want to reset the product catalog to the default LivsMed instruments?')) {
    state.catalog = resetProductCatalog();
    renderCatalogModalTable();
    showToast('Catalog reset to default LivsMed products', 'info');
  }
}

// ============================================================================
// Zoom & Fit Controls
// ============================================================================

function setZoom(level) {
  const clamped = Math.min(Math.max(level, 0.4), 1.8);
  state.zoomLevel = clamped;
  dom.documentZoomWrapper.style.transform = `scale(${clamped})`;
  dom.zoomLevelLabel.textContent = `${Math.round(clamped * 100)}%`;
}

function autoFitZoom() {
  if (!dom.documentCanvasContainer) return;
  const containerWidth = dom.documentCanvasContainer.clientWidth - 48; // padding
  const sheetWidthPx = 8.5 * 96; // 816px Letter width at standard DPI
  const scale = Math.min(1.0, containerWidth / sheetWidthPx);
  setZoom(Math.max(0.65, scale));
}

// ============================================================================
// Helpers & Utilities
// ============================================================================

function formatCurrency(amount) {
  if (typeof amount === 'string' && amount.startsWith('$')) {
    return amount;
  }
  const num = Number(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return amount;
  return '$' + num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
