import { Download, Filter, MoreVertical, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';

type Partner = { sr: string; name: string; phone: string; company: string; address: string; paid: string; unpaid: string; status: string };
const CLIENTS: Partner[] = Array.from({ length: 8 }, (_, i) => ({ sr: String(i + 1), name: 'Ali Raza', phone: '92 300 1234567', company: 'Spiraltech Pvt.Ltd.', address: 'House No. 24-B, Street 12, DHA Lahore', paid: '10,000PKR', unpaid: '10,000PKR', status: 'Active' }));
const SUPPLIERS: Partner[] = CLIENTS.map((row) => ({ ...row, name: 'Ali Raza' }));
const readSaved = (key: string, fallback: Partner[]): Partner[] => { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(value) || !value.length) return fallback; return value.map((row: unknown, i: number) => { const item = (row || {}) as Record<string, unknown>; return { sr: String(item.sr || i + 1), name: String(item.name || ''), phone: String(item.phone || item.phoneNumber || ''), company: String(item.company || item.companyName || ''), address: String(item.address || ''), paid: String(item.paid || '0 PKR'), unpaid: String(item.unpaid || '0 PKR'), status: String(item.status || 'Active') }; }).filter((row) => row.name); } catch { return fallback; } };

export default function ClientsSuppliersPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const suppliers = params.get('tab') === 'suppliers';
  const rows = useMemo(() => readSaved(suppliers ? 'titan_suppliers_v1' : 'titan_clients_v1', suppliers ? SUPPLIERS : CLIENTS), [suppliers]);
  const visible = useMemo(() => rows.filter((row) => `${row.name} ${row.phone} ${row.company}`.toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const headers = suppliers ? ['Sr no.', 'Name', 'Phone Number', 'Company', 'Address', 'Paid', 'Unpaid', 'Status', 'Actions'] : ['Sr no.', 'Name', 'Phone Number', 'Address', 'Paid', 'Unpaid', 'Status', 'Actions'];
  const csvRows = visible.map((r) => suppliers ? [r.sr, r.name, r.phone, r.company, r.address, r.paid, r.unpaid, r.status] : [r.sr, r.name, r.phone, r.address, r.paid, r.unpaid, r.status]);
  return <>
    <PageHeader title="CLIENTS AND SUPPLIER" />
    <div className="tabs partner-tabs"><button className={!suppliers ? 'tab active' : 'tab'} onClick={() => setParams({})}>Client</button><button className={suppliers ? 'tab active' : 'tab'} onClick={() => setParams({ tab: 'suppliers' })}>Suppliers</button></div>
    <div className="toolbar partner-toolbar"><button className="btn green" onClick={() => exportCsv(`titan-${suppliers ? 'suppliers' : 'clients'}.csv`, headers.slice(0, -1), csvRows)}><Download />Export</button><button className="btn orange" onClick={() => setFilterOpen((open) => !open)}><Filter />Filter</button><label className="search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search By Name" /></label><div className="grow" /><button className="btn gray" onClick={() => setSummaryOpen(true)}>Summary</button><button className="btn blue" onClick={() => navigate(suppliers ? ROUTES.SUPPLIER_ADD : ROUTES.CLIENT_ADD)}><Plus />{suppliers ? 'Add Supplier' : 'Add Client'}</button></div>
    {filterOpen && <div className="partner-filters"><label>Status<select defaultValue="All"><option>All</option><option>Active</option><option>Inactive</option></select></label></div>}
    <div className="tablewrap partner-table"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{visible.map((row, i) => <tr key={i}><td>{row.sr}</td><td><a className="table-link" href={suppliers ? ROUTES.SUPPLIER_ADD : ROUTES.CLIENT_ADD}>{row.name}</a></td><td>{row.phone}</td>{suppliers && <td>{row.company}</td>}<td>{row.address}</td><td className="paid-text">{row.paid}</td><td className="unpaid-text">{row.unpaid}</td><td><span className="toggle-on" aria-label="Active" /></td><td><button className="icon-button" aria-label="Partner actions"><MoreVertical /></button></td></tr>)}</tbody></table></div>
    <div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div>
    {summaryOpen && <div className="overlay" role="dialog" aria-modal="true"><section className="modal partner-summary"><div className="modalhead"><div><h2>{suppliers ? 'Supplier Summary' : 'Client Summary'}</h2><p>Receivable and payable overview</p></div><button type="button" onClick={() => setSummaryOpen(false)} aria-label="Close">×</button></div><div className="summary-grid"><div><span>{suppliers ? 'Supplier' : 'Client'} Name</span><b>{visible[0]?.name || '—'}</b></div><div><span>Total amount</span><b>{visible[0]?.paid || '0 PKR'}</b></div><div><span>Credit</span><b>{visible[0]?.paid || '0 PKR'}</b></div><div><span>Debit</span><b>{visible[0]?.unpaid || '0 PKR'}</b></div><div><span>Balance</span><b>{visible[0] ? '0 PKR' : '—'}</b></div></div></section></div>}
  </>;
}
