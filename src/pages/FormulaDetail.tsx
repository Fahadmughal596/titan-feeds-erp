import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

const ingredients = Array.from({ length: 6 }, () => ({ name: 'Soyabean Meal', inclusion: '13' }));
export default function FormulaDetail() { const navigate = useNavigate(); return <><PageHeader title="FORMULA DETAIL" actions={<button className="btn orange" onClick={() => navigate(ROUTES.FORMULATOR)}>Close</button>} /><div className="formula-detail-card"><div className="formula-detail-head"><b>Standard</b><b>Date: 20-June-2026</b></div><div className="formula-metrics">{Array.from({ length: 6 }, (_, i) => <span key={i}><b>DM %</b><em>10%</em></span>)}</div></div><div className="tablewrap formula-detail-table"><table><thead><tr><th>Sr no</th><th>Ingredients</th><th>Inclusion%</th></tr></thead><tbody>{ingredients.map((row, i) => <tr key={i}><td>1</td><td>{row.name}</td><td>{row.inclusion}</td></tr>)}</tbody></table></div></>; }
