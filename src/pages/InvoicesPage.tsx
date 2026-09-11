import { Download, Filter, MoreVertical, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';

type Invoice = {
  client: string;
  number: string;
  date: string;
  terms: string;
  total: string;
  paid: string;
  unpaid: string;
  status: 'Paid' | 'Unpaid';
};

const SEED: Invoice[] = Array.from({ length: 8 }, (_, i) => ({
  client: 'Ali raza',
  number: 'INV-00193',
  date: 'March 10 2020',
  terms: i % 2 ? 'Cash' : 'Credit',
  total: '1,000,000',
  paid: '5,000,000',
  unpaid: '5,000,000',
  status: i % 3 ? 'Paid' : 'Unpaid',
}));

function readInvoices(): Invoice[] {
  try {
    const value = JSON.parse(localStorage.getItem('titan_invoices_v1') || 'null');
    if (Array.isArray(value) && value.length && value[0]?.number) return value;
  } catch { /* use Figma seed */ }
  return SEED;
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [rows] = useState<Invoice[]>(readInvoices);
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const visible = useMemo(() => rows.filter((row) => {
    const textMatch = `${row.client} ${row.number}`.toLowerCase().includes(query.toLowerCase());
    const dateMatch = !date || row.date.toLowerCase().includes(date.toLowerCase());
    const statusMatch = !status || row.status === status;
    return textMatch && dateMatch && statusMatch;
  }), [rows, query, date, status]);

  const csvRows = visible.map((r) => [r.client, r.number, r.date, r.terms, r.total, r.paid, r.unpaid, r.status]);

  return (
    <>
      <PageHeader title="INVOICES" />

      <div className="invoice-stats">
        <div><span>Total Invoices</span><strong>200</strong></div>
        <div><span>Total Amount</span><strong>20.5M</strong></div>
        <div><span>Paid Amount</span><strong>10.6M</strong></div>
        <div><span>Outstanding</span><strong>10M</strong></div>
      </div>

      <div className="toolbar invoice-toolbar">
        <button className="btn green" onClick={() => exportCsv('titan-invoices.csv', ['Client', 'Invoice Number', 'Date', 'Terms', 'Total Amount', 'Paid Amount', 'Unpaid Amount', 'Status'], csvRows)}><Download />Export</button>
        <button className="btn orange" onClick={() => setFilterOpen((open) => !open)}><Filter />Filter</button>
        <label className="search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by Invoice #" /></label>
        <div className="grow" />
        <button className="btn cyan" onClick={() => navigate(ROUTES.INVOICE_ADD)}><Plus />Add Invoice</button>
        <button className="btn green" onClick={() => navigate(ROUTES.INVOICE_IMPORT)}><Plus />Bulk Invoice</button>
      </div>

      {filterOpen && <div className="invoice-filters">
        <label>Search by Date<input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Select date" /></label>
        <label>Search by Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All status</option><option>Paid</option><option>Unpaid</option></select></label>
      </div>}

      <div className="tablewrap invoice-table"><table>
        <thead><tr>{['Client', 'Invoice Number', 'Date', 'Terms', 'Total Amount', 'Paid Amount', 'Unpaid Amount', 'Status', 'Actions'].map((head) => <th key={head}>{head}</th>)}</tr></thead>
        <tbody>{visible.map((row, index) => <tr key={`${row.number}-${index}`}>
          <td><a className="table-link" href={ROUTES.INVOICE_ADD}>{row.client}<small>92 300 1234567</small></a></td>
          <td>{row.number}</td><td>{row.date}</td><td><span className={`term ${row.terms.toLowerCase()}`}>{row.terms}</span></td>
          <td>{row.total}</td><td>{row.paid}</td><td>{row.unpaid}</td><td><span className={`invoice-status ${row.status.toLowerCase()}`}>{row.status}</span></td>
          <td><button className="icon-button" aria-label="Invoice actions"><MoreVertical /></button></td>
        </tr>)}</tbody>
      </table></div>

      <div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div>
    </>
  );
}
