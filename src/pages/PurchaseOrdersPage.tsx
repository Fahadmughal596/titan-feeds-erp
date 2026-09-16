import { Download, Filter, MoreVertical, Search, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';

type PurchaseOrder = { sr: string; number: string; date: string; vendor: string; supplyDate: string; amount: string; terms: string; status: string };
const SEED: PurchaseOrder[] = Array.from({ length: 8 }, (_, i) => ({ sr: String(i + 1), number: 'PO-001', date: '12-June-2026', vendor: 'Ali Supplier', supplyDate: '20-June-2026', amount: '250,000PKR', terms: i % 2 ? 'Cash' : 'Credit', status: i % 3 ? 'Paid' : 'Unpaid' }));

function readOrders(): PurchaseOrder[] {
  try {
    const value = JSON.parse(localStorage.getItem('titan_purchase_orders_v1') || 'null');
    if (Array.isArray(value) && value.length && value[0]?.number) return value;
  } catch { /* use Figma seed */ }
  return SEED;
}

export default function PurchaseOrdersPage() {
  const navigate = useNavigate();
  const [rows] = useState<PurchaseOrder[]>(readOrders);
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [status, setStatus] = useState('');
  const visible = useMemo(() => rows.filter((row) => `${row.number} ${row.vendor}`.toLowerCase().includes(query.toLowerCase()) && (!status || row.status === status)), [rows, query, status]);
  const csvRows = visible.map((r) => [r.sr, r.number, r.date, r.vendor, r.supplyDate, r.amount, r.terms, r.status]);
  return <>
    <PageHeader title="PURCHASE ORDER" />
    <div className="toolbar purchase-toolbar">
      <button className="btn green" onClick={() => exportCsv('titan-purchase-orders.csv', ['Sr no', 'PO Number', 'Date', 'Vendor Name', 'Supply date', 'Amount', 'Terms', 'Status'], csvRows)}><Download />Export</button>
      <button className="btn orange" onClick={() => setFilterOpen((open) => !open)}><Filter />Filter</button>
      <label className="search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by Invoice #" /></label>
      <div className="grow" /><button className="btn blue" onClick={() => navigate(`${ROUTES.PURCHASE_ORDERS}/add`)}><Plus />Add Purchase Order</button>
    </div>
    {filterOpen && <div className="purchase-filters"><label>Search by Date<input placeholder="Select date" /></label><label>Search by Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All status</option><option>Paid</option><option>Unpaid</option></select></label></div>}
    <div className="tablewrap purchase-table"><table><thead><tr>{['Sr no', 'PO Number', 'Date', 'Vendor Name', 'Supply date', 'Amount', 'Terms', 'Status', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{visible.map((row, i) => <tr key={`${row.number}-${i}`}><td>{row.sr}</td><td>{row.number}</td><td>{row.date}</td><td>{row.vendor}</td><td>{row.supplyDate}</td><td>{row.amount}</td><td><span className={`term ${row.terms.toLowerCase()}`}>{row.terms}</span></td><td><span className={`invoice-status ${row.status.toLowerCase()}`}>{row.status}</span></td><td><button className="icon-button" aria-label="Purchase order actions"><MoreVertical /></button></td></tr>)}</tbody></table></div>
    <div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div>
  </>;
}
