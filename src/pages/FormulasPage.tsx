import { Download, Filter, MoreVertical, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

type Formula = { name: string; items: string; dm: string; cp: string; me: string; ge: string; ee: string; cf: string; tdn: string; ndf: string; adf: string; ash: string; ca: string; p: string };
const SEED: Formula[] = [
  { name: 'Growth Max', items: '10', dm: '89', cp: '9', me: '3.3', ge: '4.4', ee: '4', cf: '2.5', tdn: '88', ndf: '10', adf: '3', ash: '1.5', ca: '0.02', p: '0.28' },
  { name: 'Care Max', items: '12', dm: '89', cp: '9', me: '3.3', ge: '4.4', ee: '4', cf: '2.5', tdn: '88', ndf: '10', adf: '3', ash: '1.5', ca: '0.02', p: '0.28' },
  { name: 'Maintaince', items: '23', dm: '89', cp: '9', me: '3.3', ge: '4.4', ee: '4', cf: '2.5', tdn: '88', ndf: '10', adf: '3', ash: '1.5', ca: '0.02', p: '0.28' },
];
const HEADERS = ['Name Items', 'DM%', 'CP%', 'ME (Mcal/kg)', 'GE (Mcal/kg)', 'EE %', 'CF %', 'TDN %', 'NDF %', 'ADF %', 'Ash %', 'Ca %', 'P %'];
const exportCsv = (rows: Formula[]) => { const csv = [HEADERS, ...rows.map((r) => [r.name, r.items, r.dm, r.cp, r.me, r.ge, r.ee, r.cf, r.tdn, r.ndf, r.adf, r.ash, r.ca, r.p])].map((line) => line.map((v) => `"${v}"`).join(',')).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'titan-formulas.csv'; a.click(); };

export default function FormulasPage() {
  const navigate = useNavigate(); const [query, setQuery] = useState(''); const [page, setPage] = useState(1); const rows = useMemo(() => SEED.filter((r) => r.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return <><PageHeader title="FORMULA" /><div className="toolbar formula-toolbar"><button className="btn green" onClick={() => exportCsv(rows)}><Download />Export</button><button className="btn orange"><Filter />Filter</button><label className="search"><Search /><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search By Name" /></label><div className="grow" /><button className="btn orange" onClick={() => navigate(ROUTES.FORMULA_ADD)}><Plus />Add Formula</button></div><div className="tablewrap formula-table"><table><thead><tr>{HEADERS.map((h) => <th key={h}>{h}</th>)}<th>Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.name}><td className="formula-name"><b>{r.name}</b><small>{r.items}</small></td><td>{r.dm}</td><td>{r.cp}</td><td>{r.me}</td><td>{r.ge}</td><td>{r.ee}</td><td>{r.cf}</td><td>{r.tdn}</td><td>{r.ndf}</td><td>{r.adf}</td><td>{r.ash}</td><td>{r.ca}</td><td>{r.p}</td><td><button className="icon-button" onClick={() => navigate(ROUTES.FORMULA_DETAIL)}><MoreVertical /></button></td></tr>)}</tbody></table></div><div className="products-pagination"><span>Page <select value={page} onChange={(e) => setPage(Number(e.target.value))}>{Array.from({ length: 10 }, (_, i) => <option key={i + 1}>{i + 1}</option>)}</select> of 10</span><div className="page-controls"><button>&laquo;</button><button>&lsaquo;</button><button className="current">1</button><button>2</button><button>3</button><span>&hellip;</span><button>10</button><button>&rsaquo;</button><button>&raquo;</button></div></div></>;
}
