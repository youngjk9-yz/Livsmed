// Product catalog management for LivsMed Quote Request Generator
// Updated with the complete list of products, codes, and unit prices from LivsMed

export const DEFAULT_PRODUCTS = [
  {
    code: 'ACA01-LV',
    description: 'Clip Applier Medium Large-38cm-Lock-Adjustable',
    defaultPrice: 400.00
  },
  {
    code: 'ACA02-LV',
    description: 'Clip Applier Large-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: 'ACA03-LV',
    description: 'Clip Applier Large-38cm-Lock-Adjustable-With 10mm Trocar',
    defaultPrice: 385.00
  },
  {
    code: '5ACF01-LP',
    description: 'Clinch Forceps-38cm-Lock-Adjustable-Pinch lock',
    defaultPrice: 385.00
  },
  {
    code: '5ACF01-LV',
    description: 'Clinch Forceps-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: '5AUF01-LP',
    description: 'Fenestrated Forceps-38cm-Lock-Adjustable-Pinch lock',
    defaultPrice: 385.00
  },
  {
    code: '5AUF01-LV',
    description: 'Fenestrated Forceps-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: '5AUD01-LV',
    description: 'Maryland Dissector-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: '5AUD01S-LV',
    description: 'Maryland Dissector-30cm-Lock-Adjustable',
    defaultPrice: 495.00
  },
  {
    code: '5AUD02-LV',
    description: 'Precise Dissector-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: '5ANH01-LV',
    description: 'Needle Holder-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: 'ANH01-LV',
    description: 'Needle Holder-38cm-Lock-Adjustable (ANH01-LV)',
    defaultPrice: 385.00
  },
  {
    code: '5ANH01S-LV',
    description: 'Needle Holder-30cm-Lock-Adjustable',
    defaultPrice: 495.00
  },
  {
    code: '5AMHD01-LH',
    description: 'Monopolar Hook-Down-38cm-Lock-Hand Control',
    defaultPrice: 385.00
  },
  {
    code: '5AMHL01-LH',
    description: 'Monopolar Hook-Left-38cm-Lock-Hand Control',
    defaultPrice: 385.00
  },
  {
    code: '5AMHR01-LH',
    description: 'Monopolar Hook-Right-38cm-Lock-Hand Control',
    defaultPrice: 385.00
  },
  {
    code: '5AMHU01-LH',
    description: 'Monopolar Hook-Up-38cm_Lock-Hand Control',
    defaultPrice: 385.00
  },
  {
    code: '5AMT01-LH',
    description: 'Monopolar Spatula-38cm-Lock-Hand Control',
    defaultPrice: 385.00
  },
  {
    code: '5AMT01S-LH',
    description: 'Monopolar Spatula-30cm-Lock-Hand Control',
    defaultPrice: 550.80
  },
  {
    code: 'AMSU01-LV',
    description: 'Monopolar Scissors-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: 'AMSU01S-LV',
    description: '(신형-실리콘커버)Monopolar Scissors-25cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: 'AMSD01S-LV',
    description: 'Monopolar Scissors-25cm-Lock-Adjustable',
    defaultPrice: 400.00
  },
  {
    code: 'ABF01-LV',
    description: 'Bipolar Fenestrated Forceps-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: 'Shipping',
    description: 'Shipping & Handling',
    defaultPrice: 749.41
  }
];

const STORAGE_KEY = 'livsmed_quote_product_catalog_v3';

// Clear legacy caches to ensure old products are completely removed
try {
  localStorage.removeItem('livsmed_quote_product_catalog_v1');
  localStorage.removeItem('livsmed_quote_product_catalog_v2');
} catch (e) {
  // ignore
}

export function getProductCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read product catalog from localStorage:', err);
  }
  return DEFAULT_PRODUCTS;
}

export function saveProductCatalog(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('livsmed:catalog-updated', { detail: products }));
    return true;
  } catch (err) {
    console.error('Failed to save product catalog:', err);
    return false;
  }
}

export function resetProductCatalog() {
  saveProductCatalog(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}
