export type ProductOption = {
  name: string;
  brand?: string;
  variant?: string;
  itemCode?: string;
  uom?: string;
  valueInKg?: string;
};
export type BrandRecord = { name: string; productItem?: string; description?: string };
export type CatalogueRecord = { brandName: string; products: string; items: string; description?: string };

const parse = (key: string): unknown => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};

/** Products saved by Add Product/Add Variant, with the legacy row format supported. */
export const readProducts = (): ProductOption[] => {
  const value = parse('titan_products_v4');
  if (!Array.isArray(value)) return [];
  return value
    .map((row): ProductOption | null => {
      if (Array.isArray(row)) {
        return { brand: row[0] || '', name: row[1] || '', variant: row[2] || '', itemCode: row[3] || '', uom: row[4] || '', valueInKg: row[5] || '' };
      }
      if (row && typeof row === 'object') {
        const item = row as Record<string, unknown>;
        return { brand: String(item.brand || ''), name: String(item.name || item.product || ''), variant: String(item.variant || ''), itemCode: String(item.itemCode || ''), uom: String(item.uom || ''), valueInKg: String(item.valueInKg || '') };
      }
      return null;
    })
    .filter((row): row is ProductOption => Boolean(row?.name));
};

/** Raw materials are valid feed choices when adding inventory/batches. */
export const readRawMaterials = (): ProductOption[] => {
  const value = parse('titan_raw_v4');
  if (!Array.isArray(value)) return [];
  return value
    .map((row): ProductOption | null => {
      if (Array.isArray(row)) {
        // Current raw-material rows include Sr no, Brand, Product, UOM;
        // older rows used Sr no, Name, UOM. Support both for saved data.
        const modern = row.length >= 16;
        return { name: String(row[modern ? 2 : 1] || ''), brand: String(row[modern ? 1 : ''] || ''), uom: String(row[modern ? 3 : 2] || '') };
      }
      if (row && typeof row === 'object') {
        const item = row as Record<string, unknown>;
        return { name: String(item.name || item.material || ''), uom: String(item.uom || item.UOM || '') };
      }
      return null;
    })
    .filter((row): row is ProductOption => Boolean(row?.name));
};

export const readBrands = (): string[] => {
  const value = parse('titan_brands');
  const saved = Array.isArray(value)
    ? value.map((brand) => (typeof brand === 'string' ? brand : String(brand?.name || ''))).filter(Boolean)
    : [];
  const fromProducts = readProducts().map((product) => product.brand || '').filter(Boolean);
  return Array.from(new Set(['Titan Feeds', ...saved, ...fromProducts]));
};

export const readBrandRecords = (): BrandRecord[] => {
  const value = parse('titan_brands');
  return Array.isArray(value) ? value.map((brand) => typeof brand === 'string' ? { name: brand } : { name: String(brand?.name || ''), productItem: String(brand?.productItem || ''), description: String(brand?.description || '') }).filter((brand) => brand.name) : [];
};

export const readCatalogueRecords = (): CatalogueRecord[] => {
  const value = parse('titan_brand_catalogue');
  return Array.isArray(value) ? value.map((entry) => ({ brandName: String(entry?.brandName || ''), products: String(entry?.products || ''), items: String(entry?.items || ''), description: String(entry?.description || '') })).filter((entry) => entry.brandName) : [];
};

/** Combines finished products and raw materials without duplicate names. */
export const readFeedChoices = (): ProductOption[] => {
  const combined = [...readProducts(), ...readRawMaterials()];
  const seen = new Set<string>();
  return combined.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
