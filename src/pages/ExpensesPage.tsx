import { Download, Filter, MoreVertical, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';

type Expense = { sr: string; category: string; subCategory: string; date: string; description: string; amount: string };
const SEED: Expense[] = Array.from({ length: 8 }, (_, i) => ({ sr: String(i + 1), category: 'Rent', subCategory: 'Factory Rent', date: '12-June-2026', description: 'Factory rent June', amount: '10,000PKR' }));

export default function ExpensesPage() {
  const navigate = useNavigate();
  const [rows] = useState<Expense[]>(SEED);
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const visible = useMemo(() => rows.filter((row) => (!category || row.category === category) && (!from || row.date.includes(from)) && (!to || row.date.includes(to))), [rows, category, from, to]);
  const csvRows = visible.map((r) => [r.sr, r.category, r.subCategory, r.date, r.description, r.amount]);
  return <>
    <PageHeader title="Expenses" />
    <div className="toolbar expenses-toolbar"><button className="btn green" onClick={() => exportCsv('titan-expenses.csv', ['Sr no.', 'Category', 'Sub Category', 'Date', 'Description', 'Amount'], csvRows)}><Download />Export</button><button className="btn orange" onClick={() => setFilterOpen((open) => !open)}><Filter />Filter</button><div className="grow" /><button className="btn orange" onClick={() => navigate(ROUTES.EXPENSE_ADD)}><Plus />Add Expense</button><button className="btn green" onClick={() => navigate(ROUTES.CLIENT_ADD)}><Plus />Add Client</button><button className="btn orange" onClick={() => navigate(ROUTES.EXPENSE_CATEGORIES)}><Plus />Add Category</button></div>
    {filterOpen && <div className="expense-filters"><label>Select the Category<select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Select the Category</option><option>Rent</option><option>Salary</option></select></label><label>Date<input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Select date" /></label><label>Date<input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Select date" /></label></div>}
    <div className="tablewrap expense-table"><table><thead><tr>{['Sr no.', 'Category', 'Sub Category', 'Date', 'Description', 'Amount', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{visible.map((row, i) => <tr key={i}><td>{row.sr}</td><td><u>{row.category}</u></td><td>{row.subCategory}</td><td>{row.date}</td><td>{row.description}</td><td>{row.amount}</td><td><button className="icon-button" aria-label="Expense actions"><MoreVertical /></button></td></tr>)}</tbody></table></div>
    <div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div>
  </>;
}
