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
    const invalidModules = new Set(['inventory', 'products', 'invoices', 'dashboard']);
    const validRows = Array.isArray(value) && value.length && value.every((row) => Array.isArray(row) && row.length >= 7 && !invalidModules.has(String(row[0] || '').trim().toLowerCase()));
    if (validRows) return value.map((r: string[]) => ({ brand: r[0] || '', product: r[1] || '', variant: r[2] || '', itemCode: r[3] || '', uom: r[4] || '', valueInKg: r[5] || '', description: r[6] || '-' }));
  } catch { /* use the Figma seed */ }
  return SEED;
};

const exportRows = (rows: ProductRow[]) => {
  const head = ['Item Code', 'Brand', 'Product', 'Variant', 'UOM', 'Packing Size', 'Description'];
  const csv = [head, ...rows.map((r) => [r.itemCode, r.brand, r.product, r.variant, r.uom, r.valueInKg, r.description])]
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

  const brands = useMemo(() => ['All', ...Array.from(new Set(rows.map((r) => r.brand).filter(Boolean)))], [rows]);
  const visible = rows.filter((row) => {
    const matchesQuery = `${row.brand} ${row.product} ${row.variant} ${row.itemCode}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (brand === 'All' || row.brand === brand);
  });

  return (
    <>
      <PageHeader title="PRODUCTS" />
      <div className="toolbar product-toolbar">
        <button className="btn green" onClick={() => exportRows(visible)}><Download />Export</button>
        <button className="btn orange" onClick={() => setFilterOpen((value) => !value)}><Filter />Filter</button>
        <label className="search"><Search /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search By Name" /></label>
        <div className="grow" />
        <button className="btn blue" onClick={() => setModal('brand')}><Plus />Add Brand</button>
        <button className="btn green" onClick={() => setModal('product')}><Plus />Add Product</button>
        <button className="btn cyan" onClick={() => setModal('variant')}><Plus />Add Variant</button>
      </div>
      {filterOpen && <div className="product-filter"><label>Brand <select value={brand} onChange={(event) => setBrand(event.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label></div>}

      <ProductTable title="Products" headers={['Item Code', 'Brand', 'Product', 'Variant', 'UOM', 'Packing Size', 'Description', 'Actions']}>
        {visible.map((row, index) => <tr key={`${row.itemCode}-${index}`}><td>{row.itemCode}</td><td>{row.brand}</td><td>{row.product}</td><td>{row.variant}</td><td>{row.uom}</td><td>{row.valueInKg}</td><td>{row.description}</td><td><button className="icon-button" aria-label="Open product details" onClick={() => navigate(ROUTES.PRODUCT_DETAILS)}><MoreVertical /></button></td></tr>)}
        {!visible.length && <tr><td colSpan={8} className="empty-cell">No product records found.</td></tr>}
      </ProductTable>

      <div className="products-pagination">
        <span>Page <select value={page} onChange={(event) => setPage(Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select> of 10</span>
        <div className="page-controls"><button onClick={() => setPage(1)}>«</button><button onClick={() => setPage(Math.max(1, page - 1))}>‹</button>{[1, 2, 3].map((item) => <button className={page === item ? 'current' : ''} key={item} onClick={() => setPage(item)}>{item}</button>)}<span>…</span><button className={page === 10 ? 'current' : ''} onClick={() => setPage(10)}>10</button><button onClick={() => setPage(Math.min(10, page + 1))}>›</button><button onClick={() => setPage(10)}>»</button></div>
      </div>
      {modal && <ProductModal kind={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); window.location.reload(); }} />}
    </>
  );
}

function ProductTable({ title, headers, children }: { title: string; headers: string[]; children: React.ReactNode }) {
  return (
    <section className="product-data-section">
      <h2>{title}</h2>
      <div className="tablewrap products-table">
        <table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{children}</tbody></table>
      </div>
    </section>
  );
}
