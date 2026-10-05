// Product catalog management for LivsMed Quote Request Generator
// Updated with the official product codes, descriptions, and unit prices from LivsMed price list

export const DEFAULT_PRODUCTS = [
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
    defaultPrice: 495.00
  },
  {
    code: '5AUD01-LV',
    description: 'Maryland Dissector-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: '5ANH01-LV',
    description: 'Needle Holder-38cm-Lock-Adjustable',
    defaultPrice: 385.00
  },
  {
    code: '5ANH01-LV',
    description: 'Needle Holder-38cm-Lock-Adjustable ($535)',
    defaultPrice: 535.00
  },
  {
    code: '5ANH01S-LV',
    description: 'Needle Holder-30cm-Lock-Adjustable',
    defaultPrice: 495.00
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
    code: '5AMHL01-LH',
    description: 'Monopolar Hook-Left-38cm-Lock-Hand Control ($495)',
    defaultPrice: 495.00
  },
  {
    code: '5AMHU01-LH',
    description: 'Monopolar Hook-Up-38cm_Lock-Hand Control',
    defaultPrice: 385.00
  },
  {
    code: 'ABD02-L',
    description: 'Bipolar Precise Dissector-38cm-Lock',
    defaultPrice: 585.00
  },
  {
    code: 'Shipping',
    description: 'Shipping & Handling',
    defaultPrice: 79.33
  }
];

const STORAGE_KEY = 'livsmed_quote_product_catalog_v2';

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
