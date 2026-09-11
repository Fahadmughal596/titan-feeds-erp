import { MoreVertical } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

type BOMRow = { sr: string; batch: string; mfg: string; exp: string; bags: string; weight: string };
const SEED: BOMRow[] = Array.from({ length: 8 }, () => ({ sr: '4', batch: 'Bat#0908', mfg: '12-June-2024', exp: '12-June-2028', bags: '160', weight: '4800kg' }));

const readRows = (): BOMRow[] => {
  try {
    const value = JSON.parse(localStorage.getItem('titan_bom_v1') || 'null');
    if (Array.isArray(value) && value.length && value[0]?.batch) return value;
  } catch { /* use Figma seed */ }
  return SEED;
};

export default function BOMPage() {
  const navigate = useNavigate();
  const [rows] = useState<BOMRow[]>(readRows);
  const [page, setPage] = useState(1);
  const pageOptions = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);
  return <>
    <PageHeader title="BOM" actions={<button className="btn orange" onClick={() => navigate(ROUTES.BOM_MAKE)}>Add BOM</button>} />
    <div className="tablewrap bom-table"><table>
      <thead><tr><th>Sr no</th><th>BatchNumber</th><th>Mfg Date</th><th>Exp Date</th><th>Total Bags</th><th>Total Weight</th><th>Actions</th></tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i}><td>{row.sr}</td><td>{row.batch}</td><td>{row.mfg}</td><td>{row.exp}</td><td>{row.bags}</td><td>{row.weight}</td><td><button className="icon-button" aria-label="Make BOM" onClick={() => navigate(ROUTES.BOM_MAKE)}><MoreVertical /></button></td></tr>)}</tbody>
    </table></div>
    <div className="products-pagination bom-pagination"><span>Page <select value={page} onChange={(e) => setPage(Number(e.target.value))}>{pageOptions.map((p) => <option key={p}>{p}</option>)}</select> of 10</span><div className="page-controls"><button onClick={() => setPage(1)}>&laquo;</button><button onClick={() => setPage(Math.max(1, page - 1))}>&lsaquo;</button>{[1, 2, 3].map((p) => <button className={page === p ? 'current' : ''} key={p} onClick={() => setPage(p)}>{p}</button>)}<span>&hellip;</span><button className={page === 10 ? 'current' : ''} onClick={() => setPage(10)}>10</button><button onClick={() => setPage(Math.min(10, page + 1))}>&rsaquo;</button><button onClick={() => setPage(10)}>&raquo;</button></div></div>
  </>;
}
