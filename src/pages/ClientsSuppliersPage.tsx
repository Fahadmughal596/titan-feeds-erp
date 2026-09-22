import { BookOpen, Download, Filter, MoreVertical, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';

type Partner = { sr: string; name: string; phone: string; company: string; address: string; paid: string; unpaid: string; status: string };
const CLIENTS: Partner[] = Array.from({ length: 8 }, (_, i) => ({ sr: String(i + 1), name: 'Ali Raza', phone: '92 300 1234567', company: 'Spiraltech Pvt.Ltd.', address: 'House No. 24-B, Street 12, DHA Lahore', paid: '10,000PKR', unpaid: '10,000PKR', status: 'Active' }));
const SUPPLIERS: Partner[] = CLIENTS.map((row) => ({ ...row, name: 'Ali Supplier' }));
const readSaved = (key: string, fallback: Partner[]): Partner[] => { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(value) || !value.length) return fallback; return value.map((row: unknown, i: number) => { const item = (row || {}) as Record<string, unknown>; return { sr: String(item.sr || i + 1), name: String(item.name || ''), phone: String(item.phone || item.phoneNumber || ''), company: String(item.company || item.companyName || ''), address: String(item.address || ''), paid: String(item.paid || '0 PKR'), unpaid: String(item.unpaid || '0 PKR'), status: String(item.status || 'Active') }; }).filter((row) => row.name); } catch { return fallback; } };

export default function ClientsSuppliersPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selected, setSelected] = useState<Partner | null>(null);
  const suppliers = params.get('tab') === 'suppliers';
  const rows = useMemo(() => readSaved(suppliers ? 'titan_suppliers_v1' : 'titan_clients_v1', suppliers ? SUPPLIERS : CLIENTS), [suppliers]);
  const visible = useMemo(() => rows.filter((row) => `${row.name} ${row.phone} ${row.company}`.toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const headers = suppliers ? ['Sr no.', 'Name', 'Phone Number', 'Company', 'Address', 'Paid', 'Unpaid', 'Status', 'Actions'] : ['Sr no.', 'Name', 'Phone Number', 'Address', 'Paid', 'Unpaid', 'Status', 'Actions'];
  const csvRows = visible.map((r) => suppliers ? [r.sr, r.name, r.phone, r.company, r.address, r.paid, r.unpaid, r.status] : [r.sr, r.name, r.phone, r.address, r.paid, r.unpaid, r.status]);
  const openLedger = (row: Partner) => navigate(`${suppliers ? ROUTES.SUPPLIER_LEDGER : ROUTES.CLIENT_LEDGER}?name=${encodeURIComponent(row.name)}`);
  const openSummary = (row?: Partner) => { setSelected(row || null); setSummaryOpen(true); };
  const summary = selected || visible[0];

  return <>
    <PageHeader title="CLIENTS AND SUPPLIER" />
    <div className="tabs partner-tabs"><button className={!suppliers ? 'tab active' : 'tab'} onClick={() => { setSelected(null); setParams({}); }}>Client</button><button className={suppliers ? 'tab active' : 'tab'} onClick={() => { setSelected(null); setParams({ tab: 'suppliers' }); }}>Suppliers</button></div>
    <div className="toolbar partner-toolbar"><button className="btn green" onClick={() => exportCsv(`titan-${suppliers ? 'suppliers' : 'clients'}.csv`, headers.slice(0, -1), csvRows)}><Download />Export</button><button className="btn orange" onClick={() => setFilterOpen((open) => !open)}><Filter />Filter</button><label className="search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search By Name" /></label><div className="grow" /><button className="btn gray" onClick={() => openSummary()}>Summary</button><button className="btn light" onClick={() => summary && openLedger(summary)}>Ledger</button><button className="btn blue" onClick={() => navigate(suppliers ? ROUTES.SUPPLIER_ADD : ROUTES.CLIENT_ADD)}><Plus />{suppliers ? 'Add Supplier' : 'Add Client'}</button></div>
    {filterOpen && <div className="partner-filters"><label>Status<select defaultValue="All"><option>All</option><option>Active</option><option>Inactive</option></select></label></div>}
    <div className="tablewrap partner-table"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{visible.map((row) => <tr key={`${row.sr}-${row.name}`}><td>{row.sr}</td><td><button className="table-link static-link partner-name" onClick={() => openSummary(row)}>{row.name}</button></td><td>{row.phone}</td>{suppliers && <td>{row.company}</td>}<td>{row.address}</td><td className="paid-text">{row.paid}</td><td className="unpaid-text">{row.unpaid}</td><td><span className="toggle-on" aria-label={row.status} /></td><td><div className="action-group"><button className="icon-button" aria-label="Open partner ledger" title="Ledger" onClick={() => openLedger(row)}><BookOpen /></button><button className="icon-button" aria-label="Partner actions"><MoreVertical /></button></div></td></tr>)}</tbody></table></div>
    <div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div>
    {summaryOpen && <div className="overlay" role="dialog" aria-modal="true"><section className="modal partner-summary"><div className="modalhead"><div><h2>{suppliers ? 'Supplier Summary' : 'Client Summary'}</h2><p>Receivable and payable overview</p></div><button type="button" onClick={() => setSummaryOpen(false)} aria-label="Close">×</button></div><div className="summary-grid"><div><span>{suppliers ? 'Supplier' : 'Client'} Name</span><b>{summary?.name || '—'}</b></div><div><span>Company</span><b>{summary?.company || '—'}</b></div><div><span>Paid / Credit</span><b>{summary?.paid || '0 PKR'}</b></div><div><span>Unpaid / Debit</span><b>{summary?.unpaid || '0 PKR'}</b></div><div><span>Balance</span><b>{summary ? `${summary.unpaid} outstanding` : '—'}</b></div></div><div className="invoice-actions"><button className="btn light" onClick={() => summary && openLedger(summary)}>Open Ledger</button></div></section></div>}
  </>;
}
