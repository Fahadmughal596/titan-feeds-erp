import { Download, Filter, MoreVertical } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';
import { readProducts, readRawMaterials } from '../utils/catalog';

type StockRow = { name: string; category: string; qty: string; weight: string; unitPrice: string; avgBuying: string; status: string };
type BatchRow = { date: string; batch: string; name: string; po: string; items: string; total: string; paid: string; unpaid: string; status: string };

const STOCK: StockRow[] = [
  ...Array.from({ length: 5 }, () => ({ name: 'Soya Bean Meal', category: 'Raw Material', qty: '100Kg', weight: '100Kg', unitPrice: '130', avgBuying: '125', status: 'Low Stock' })),
  { name: 'Growth Max', category: 'Finish Goods', qty: '100Bags', weight: '3000Kg', unitPrice: '4500', avgBuying: '4300', status: 'Low Stock' },
];
const BATCHES: BatchRow[] = Array.from({ length: 8 }, () => ({ date: '12-June-2026', batch: 'BAT-039', name: 'Mix Ration', po: 'PO#001', items: '21', total: '250,000PKR', paid: '200,000PKR', unpaid: '50,000PKR', status: 'Partially Paid' }));

export default function InventoryDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'inventory' | 'batches'>('inventory');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const stock = useMemo(() => {
    const raw = readRawMaterials();
    const products = readProducts();
    const source: StockRow[] = raw.length || products.length ? [
      ...raw.map((row) => ({ name: row.name, category: 'Raw Material', qty: '—', weight: '—', unitPrice: '—', avgBuying: '—', status: 'Active' })),
      ...products.map((row) => ({ name: `${row.name}${row.variant ? ` ${row.variant}` : ''}`, category: 'Finish Goods', qty: '—', weight: row.valueInKg || '—', unitPrice: '—', avgBuying: '—', status: 'Active' })),
    ] : STOCK;
    return source.filter((row) => (!category || row.category === category) && (!status || row.status === status));
  }, [category, status]);
  if (tab === 'batches') {
    const rows = BATCHES.map((r) => [r.date, r.batch, r.name, r.po, r.items, r.total, r.paid, r.unpaid, r.status]);
    return <><PageHeader title="BATCHES" actions={<button className="btn blue" onClick={() => navigate(ROUTES.INVENTORY_ADD)}>Add Inventory</button>} /><div className="tabs inventory-tabs"><button className="tab" onClick={() => setTab('inventory')}>Inventory</button><button className="tab active">Batches</button></div><div className="toolbar"><button className="btn green" onClick={() => exportCsv('titan-batches.csv', ['Date', 'Batch number', 'Batch Name', 'PO', 'Items', 'Total Amount', 'Paid', 'Unpaid', 'Status'], rows)}><Download />Export</button><button className="btn orange"><Filter />Filter</button><label className="date-select"><input placeholder="Select Date" /></label></div><div className="tablewrap inventory-table"><table><thead><tr>{['Date', 'Batch number', 'Batch Name', 'PO', 'Items', 'Total Amount', 'Paid', 'Unpaid', 'Status', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{BATCHES.map((r, i) => <tr key={i}><td>{r.date}</td><td>{r.batch}</td><td>{r.name}</td><td>{r.po}</td><td>{r.items}</td><td>{r.total}</td><td>{r.paid}</td><td>{r.unpaid}</td><td><span className="invoice-status unpaid">{r.status}</span></td><td><button className="icon-button"><MoreVertical /></button></td></tr>)}</tbody></table></div><div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div></>;
  }
  const stockRows = stock.map((r) => [r.name, r.category, r.qty, r.weight, r.unitPrice, r.avgBuying, r.status]);
  return <><PageHeader title="INVENTORY" /><div className="tabs inventory-tabs"><button className="tab active">Inventory</button><button className="tab" onClick={() => setTab('batches')}>Batches</button></div><div className="inventory-stats"><div><h3>Raw Material</h3><strong>120M</strong><span>Total Stock Value</span><strong>192Ton</strong><span>Total Stock Weight</span></div><div><h3>Finish Products</h3><strong>400</strong><span>Bags</span><strong>100Ton</strong><span>In Kg</span></div><div><h3>Low Stock</h3><strong>7</strong><span>Raw Material</span><strong>1</strong><span>Finish Goods</span></div></div><div className="toolbar inventory-toolbar"><button className="btn green" onClick={() => exportCsv('titan-inventory.csv', ['Name', 'Category', 'Available QTY', 'Weight', 'Unit Price', 'Avg Buying', 'Status'], stockRows)}><Download />Export</button><button className="btn orange" onClick={() => setFilterOpen((open) => !open)}><Filter />Filter</button>{filterOpen && <><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Select Category</option><option>Raw Material</option><option>Finish Goods</option></select><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Select Status</option><option>Low Stock</option></select></>}</div><div className="tablewrap inventory-table"><table><thead><tr>{['Name', 'Category', 'Available QTY', 'Weight', 'Unit Price', 'Avg Buying', 'Status', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{stock.map((r, i) => <tr key={i}><td>{r.name}</td><td>{r.category}</td><td>{r.qty}</td><td>{r.weight}</td><td>{r.unitPrice}</td><td>{r.avgBuying}</td><td><span className="inventory-low">{r.status}</span></td><td><button className="icon-button" aria-label="Inventory actions"><MoreVertical /></button></td></tr>)}</tbody></table></div><div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div></>;
}
