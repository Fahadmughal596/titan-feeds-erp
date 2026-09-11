import { Download, Filter, MoreVertical, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/ui';
import { exportCsv } from '../utils/exportCsv';

type Category = { sr: string; name: string; category?: string; description: string };
const CATEGORIES: Category[] = Array.from({ length: 8 }, (_, i) => ({ sr: String(i + 1), name: i % 2 ? 'Salary' : 'Rent', description: 'Factory rent June' }));
const SUBCATEGORIES: Category[] = Array.from({ length: 8 }, (_, i) => ({ sr: String(i + 1), name: i % 2 ? 'Ali Salary' : 'Factory Rent', category: i % 2 ? 'Salary' : 'Rent', description: 'Factory rent June' }));

export default function ExpenseCategoriesPage() {
  const [sub, setSub] = useState(false);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const rows = sub ? SUBCATEGORIES : CATEGORIES;
  const visible = useMemo(() => rows.filter((row) => `${row.name} ${row.category || ''} ${row.description}`.toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const headers = sub ? ['Sr no.', 'SubCategory', 'Category', 'Description', 'Actions'] : ['Sr no.', 'Category', 'Description', 'Actions'];
  const csvRows = visible.map((r) => sub ? [r.sr, r.name, r.category, r.description] : [r.sr, r.name, r.description]);
  return <>
    <PageHeader title="EXPENSE CATEGORY" />
    <div className="tabs"><button className={!sub ? 'tab active' : 'tab'} onClick={() => setSub(false)}>Category</button><button className={sub ? 'tab active' : 'tab'} onClick={() => setSub(true)}>SubCategory</button></div>
    <div className="toolbar category-toolbar"><button className="btn green" onClick={() => exportCsv(`titan-${sub ? 'subcategories' : 'categories'}.csv`, headers.slice(0, -1), csvRows)}><Download />Export</button><button className="btn orange"><Filter />Filter</button><label className="search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by Name" /></label><div className="grow" /><button className="btn orange" onClick={() => setAdding((open) => !open)}><Plus />{sub ? 'Add Subcategory' : 'Add Category'}</button></div>
    {adding && <form className="inline-add" onSubmit={(e) => { e.preventDefault(); setAdding(false); setName(''); setDescription(''); }}><input required value={name} onChange={(e) => setName(e.target.value)} placeholder={sub ? 'Enter SubCategory' : 'Enter Category'} />{sub && <input placeholder="Enter Category" />}<input required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" /><button className="btn orange">Save</button></form>}
    <div className="tablewrap category-table"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{visible.map((row, i) => <tr key={i}><td>{row.sr}</td><td>{row.name}</td>{sub && <td>{row.category}</td>}<td>{row.description}</td><td><button className="icon-button" aria-label="Category actions"><MoreVertical /></button></td></tr>)}</tbody></table></div>
    <div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div>
  </>;
}
