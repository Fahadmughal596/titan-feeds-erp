import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

type CostRow = { type: string; percentage: string };
const INITIAL: CostRow[] = [
  { type: 'COGs', percentage: '50' }, { type: 'Bag Cost', percentage: '5' },
  { type: 'COGs', percentage: '23' }, { type: 'COGs', percentage: '23' },
  { type: 'COGs', percentage: '23' }, { type: 'COGs', percentage: '23' },
];

export default function ProductDetails() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(INITIAL);
  const update = (index: number, key: keyof CostRow, value: string) => setRows((current) => current.map((row, i) => i === index ? { ...row, [key]: value } : row));
  return <>
    <PageHeader title="PRODUCT DETAILS" actions={<button className="btn orange" onClick={() => navigate(ROUTES.PRODUCTS)}>List</button>} />
    <div className="product-summary"><span><b>Variant:</b> 30kg</span><span><b>Product:</b> Growth Max</span><span><b>Sale Price Today:</b> Growth Max</span></div>
    <div className="tablewrap product-details-table"><table>
      <thead><tr><th>Sr no.</th><th>Expense Type</th><th>Percentage</th></tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i}><td>5</td><td><input value={row.type} onChange={(e) => update(i, 'type', e.target.value)} /></td><td><input value={row.percentage} onChange={(e) => update(i, 'percentage', e.target.value)} /></td></tr>)}<tr className="total-row"><td>Total</td><td>10</td><td>100%</td></tr></tbody>
    </table></div>
  </>;
}
