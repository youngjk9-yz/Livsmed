// Product catalog management for LivsMed Quote Request Generator
// Users can provide or update products later via the UI Catalog Manager

export const DEFAULT_PRODUCTS = [
  {
    code: '5ACF01-LP',
    description: 'ArtiSential Clinch Forcep',
    spec: '38cm, Pinch Lock',
    defaultPrice: 1925
  },
  {
    code: '5ACF01-LV',
    description: 'ArtiSential Clinch Forcep (Lever Lock)',
    spec: '38cm, Lever Lock',
    defaultPrice: 1925
  },
  {
    code: '5AFF01-LP',
    description: 'ArtiSential Fenestrated Forcep',
    spec: '38cm, Pinch Lock',
    defaultPrice: 1925
  },
  {
    code: '5AFF01-LV',
    description: 'ArtiSential Fenestrated Forcep (Lever Lock)',
    spec: '38cm, Lever Lock',
    defaultPrice: 1925
  },
  {
    code: '5AMD01-LP',
    description: 'ArtiSential Maryland Dissector',
    spec: '38cm, Pinch Lock',
    defaultPrice: 1925
  },
  {
    code: '5AMD01-LV',
    description: 'ArtiSential Maryland Dissector (Lever Lock)',
    spec: '38cm, Lever Lock',
    defaultPrice: 1925
  },
  {
    code: '5ABF01-LP',
    description: 'ArtiSential Bipolar Fenestrated Forcep',
    spec: '38cm, Bipolar',
    defaultPrice: 2150
  },
  {
    code: '5AMH01',
    description: 'ArtiSential Monopolar Spatula / Hook',
    spec: '38cm, Monopolar',
    defaultPrice: 1850
  },
  {
    code: '5ANH01',
    description: 'ArtiSential Needle Holder',
    spec: '38cm, Precision Jaw',
    defaultPrice: 2200
  },
  {
    code: '5ACA01',
    description: 'ArtiSential Clip Applier',
    spec: '38cm, Medium/Large',
    defaultPrice: 2350
  },
  {
    code: '8ACF01-LP',
    description: 'ArtiSential 8mm Clinch Forcep',
    spec: '8mm Shaft, Heavy Grip',
    defaultPrice: 2050
  },
  {
    code: '8AFF01-LP',
    description: 'ArtiSential 8mm Fenestrated Forcep',
    spec: '8mm Shaft, Grasper',
    defaultPrice: 2050
  },
  {
    code: 'AS-VS01',
    description: 'ArtiSeal Vessel Sealing Instrument',
    spec: 'Bipolar Advanced Sealer',
    defaultPrice: 2450
  }
];

const STORAGE_KEY = 'livsmed_quote_product_catalog_v1';

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
