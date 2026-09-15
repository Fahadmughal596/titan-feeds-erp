import { Download, Filter, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';

type Batch = { date: string; batch: string; name: string; po: string; items: string; total: string; paid: string; unpaid: string; status: string };
const SEED: Batch[] = Array.from({ length: 8 }, () => ({ date: '12-June-2026', batch: 'BAT-039', name: 'Mix Ration', po: 'PO#001', items: '21', total: '250,000PKR', paid: '200,000PKR', unpaid: '50,000PKR', status: 'Partially Paid' }));
const readBatches = (): Batch[] => { try { const saved = JSON.parse(localStorage.getItem('titan_batches_v1') || 'null'); return Array.isArray(saved) && saved.length ? [...saved, ...SEED] : SEED; } catch { return SEED; } };

export default function BatchesPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const rows = date ? readBatches().filter((row) => row.date.toLowerCase().includes(date.toLowerCase())) : readBatches();
  const csvRows = rows.map((row) => [row.date, row.batch, row.name, row.po, row.items, row.total, row.paid, row.unpaid, row.status]);
  return <>
    <PageHeader title="BATCHES" actions={<button className="btn blue" onClick={() => navigate(ROUTES.INVENTORY_BATCH_ADD)}><Plus />Add Inventory</button>} />
    <div className="tabs inventory-tabs"><button className="tab" onClick={() => navigate(ROUTES.INVENTORY)}>Inventory</button><button className="tab active">Batches</button></div>
    <div className="toolbar inventory-toolbar"><button className="btn green" onClick={() => exportCsv('titan-batches.csv', ['Date', 'Batch number', 'Batch Name', 'PO', 'Items', 'Total Amount', 'Paid', 'Unpaid', 'Status'], csvRows)}><Download />Export</button><button className="btn orange"><Filter />Filter</button><input className="date-select" value={date} onChange={(event) => setDate(event.target.value)} placeholder="Select Date" /></div>
    <div className="tablewrap inventory-table"><table><thead><tr>{['Date', 'Batch number', 'Batch Name', 'PO', 'Items', 'Total Amount', 'Paid', 'Unpaid', 'Status', 'Actions'].map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.batch}-${index}`}><td>{row.date}</td><td>{row.batch}</td><td>{row.name}</td><td>{row.po}</td><td>{row.items}</td><td>{row.total}</td><td>{row.paid}</td><td>{row.unpaid}</td><td><span className="invoice-status unpaid">{row.status}</span></td><td><button className="icon-button" aria-label="Batch actions"><MoreVertical /></button></td></tr>)}</tbody></table></div>
    <div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div>
  </>;
}
