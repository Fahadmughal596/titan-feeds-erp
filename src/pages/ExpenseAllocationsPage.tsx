import { Download, Filter, MoreVertical, Search } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../components/ui';
import { exportCsv } from '../utils/exportCsv';

const rows = Array.from({ length: 8 }, (_, i) => ['' + (i + 1), i % 2 ? 'Salary' : 'Rent', i % 2 ? 'Ali Salary' : 'Factory Rent', i % 2 ? '30%' : '20%', 'Active']);
export default function ExpenseAllocationsPage() {
  const [query, setQuery] = useState('');
  const visible = rows.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase()));
  return <><PageHeader title="EXPENSE ALLOCATIONS" /><div className="toolbar"><button className="btn green" onClick={() => exportCsv('titan-expense-allocations.csv', ['Sr no.', 'Category', 'SubCategory', 'Percentage', 'Status'], visible)}><Download />Export</button><button className="btn orange"><Filter />Filter</button><label className="search"><Search /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search By Name" /></label></div><div className="tablewrap allocation-table"><table><thead><tr>{['Sr no.', 'Category', 'SubCategory', 'Percentage', 'Status', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{visible.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}<td><button className="icon-button"><MoreVertical /></button></td></tr>)}</tbody></table></div><div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>«</button><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>…</span><button>10</button><button>›</button><button>»</button></div></div></>;
}
