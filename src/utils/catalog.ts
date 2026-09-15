export type ProductOption = {
  name: string;
  brand?: string;
  variant?: string;
  itemCode?: string;
  uom?: string;
  valueInKg?: string;
};

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
      if (Array.isArray(row)) return { name: String(row[1] || ''), uom: String(row[2] || '') };
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
