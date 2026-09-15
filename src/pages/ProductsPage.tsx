import { Download, Filter, MoreVertical, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import ProductModal from './ProductModal';

export type ProductRow = {
  brand: string;
  product: string;
  variant: string;
  itemCode: string;
  uom: string;
  valueInKg: string;
  description: string;
};

const SEED: ProductRow[] = [
  { brand: 'Titan Feeds', product: 'Growth Max', variant: '30Kg', itemCode: '33', uom: 'Bag', valueInKg: '30KG', description: '-' },
  { brand: 'Titan Feeds', product: 'Growth Max', variant: '30Kg', itemCode: '35', uom: 'Bag', valueInKg: '30KG', description: '-' },
  { brand: 'Titan Feeds', product: 'Growth Max', variant: '20Kg', itemCode: '3320', uom: 'Bag', valueInKg: '30KG', description: '-' },
  { brand: 'Titan Feeds', product: 'Maintaince Pro', variant: '30Kg', itemCode: '3350', uom: 'Bag', valueInKg: '30KG', description: '-' },
];

const readRows = (): ProductRow[] => {
  try {
    const value = JSON.parse(localStorage.getItem('titan_products_v4') || 'null');
    if (Array.isArray(value) && value.length && Array.isArray(value[0])) {
      return value.map((r: string[]) => ({ brand: r[0] || '', product: r[1] || '', variant: r[2] || '', itemCode: r[3] || '', uom: r[4] || '', valueInKg: r[5] || '', description: r[6] || '-' }));
    }
    if (Array.isArray(value) && value.length && value[0]?.product) return value;
  } catch { /* use the Figma seed */ }
  return SEED;
};

const exportRows = (rows: ProductRow[]) => {
  const head = ['Brand', 'Product', 'Variant', 'Item Code', 'UOM', 'Value In KG', 'Description'];
  const csv = [head, ...rows.map((r) => [r.brand, r.product, r.variant, r.itemCode, r.uom, r.valueInKg, r.description])]
    .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'titan-products.csv';
  link.click();
  URL.revokeObjectURL(url);
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const [rows] = useState<ProductRow[]>(readRows);
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [brand, setBrand] = useState('All');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<'brand' | 'product' | 'variant' | null>(null);
  const brands = useMemo(() => ['All', ...Array.from(new Set(rows.map((r) => r.brand)))], [rows]);
  const visible = rows.filter((row) => {
    const matchesQuery = `${row.brand} ${row.product} ${row.variant}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (brand === 'All' || row.brand === brand);
  });
  const catalogue = useMemo(() => {
    const grouped = new Map<string, { products: Set<string>; items: number; variants: Set<string> }>();
    rows.forEach((row) => {
      const current = grouped.get(row.brand) || { products: new Set<string>(), items: 0, variants: new Set<string>() };
      current.products.add(row.product); current.items += 1; if (row.variant) current.variants.add(row.variant);
      grouped.set(row.brand, current);
    });
    return Array.from(grouped, ([name, value]) => ({ name, products: Array.from(value.products).join(', '), items: value.items, variants: value.variants.size }));
  }, [rows]);

  return (
    <>
      <PageHeader title="PRODUCTS" />
      <div className="toolbar product-toolbar">
        <button className="btn green" onClick={() => exportRows(visible)}><Download />Export</button>
        <button className="btn orange" onClick={() => setFilterOpen((v) => !v)}><Filter />Filter</button>
        <label className="search"><Search /><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search By Name" /></label>
        <div className="grow" />
        <button className="btn blue" onClick={() => setModal('brand')}><Plus />Add Brand</button>
        <button className="btn green" onClick={() => setModal('product')}><Plus />Add Product</button>
        <button className="btn cyan" onClick={() => setModal('variant')}><Plus />Add Variant</button>
      </div>
      {filterOpen && <div className="product-filter"><label>Brand <select value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((b) => <option key={b}>{b}</option>)}</select></label></div>}
      <div className="tablewrap products-table">
        <table>
          <thead><tr>{['Brand', 'Product', 'Variant', 'Item Code', 'UOM', 'Value In KG', 'Description', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {visible.map((row, i) => <tr key={`${row.itemCode}-${i}`}>
              <td>{row.brand}</td><td>{row.product}</td><td>{row.variant}</td><td>{row.itemCode}</td><td>{row.uom}</td><td>{row.valueInKg}</td><td>{row.description}</td>
              <td><button className="icon-button" aria-label="Open product details" onClick={() => navigate(ROUTES.PRODUCT_DETAILS)}><MoreVertical /></button></td>
            </tr>)}
            {!visible.length && <tr><td colSpan={8} className="empty-cell">No product records found.</td></tr>}
          </tbody>
        </table>
      </div>
      <section className="brand-catalogue">
        <div className="brand-catalogue-head"><h2>Brand Catalogue</h2><span>Products and item summary by brand</span></div>
        <div className="tablewrap catalogue-table"><table><thead><tr><th>Brand Name</th><th>Brand Products</th><th>Items</th><th>Variants</th></tr></thead><tbody>{catalogue.map((entry) => <tr key={entry.name}><td>{entry.name}</td><td>{entry.products || '-'}</td><td>{entry.items}</td><td>{entry.variants}</td></tr>)}{!catalogue.length && <tr><td colSpan={4} className="empty-cell">No brands found.</td></tr>}</tbody></table></div>
      </section>
      <div className="products-pagination">
        <span>Page <select value={page} onChange={(e) => setPage(Number(e.target.value))}>{Array.from({ length: 10 }, (_, i) => <option key={i + 1}>{i + 1}</option>)}</select> of 10</span>
        <div className="page-controls"><button onClick={() => setPage(1)} aria-label="First page">«</button><button onClick={() => setPage(Math.max(1, page - 1))} aria-label="Previous page">‹</button>{[1, 2, 3].map((p) => <button className={page === p ? 'current' : ''} key={p} onClick={() => setPage(p)}>{p}</button>)}<span>…</span><button className={page === 10 ? 'current' : ''} onClick={() => setPage(10)}>10</button><button onClick={() => setPage(Math.min(10, page + 1))} aria-label="Next page">›</button><button onClick={() => setPage(10)} aria-label="Last page">»</button></div>
      </div>
      {modal && <ProductModal kind={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); window.location.reload(); }} />}
    </>
  );
}
