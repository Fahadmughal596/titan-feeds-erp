import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

const rows = ['1', '2', '3', '4', '4', '4', '4', '4'];
export default function FormulaHistory() { const navigate = useNavigate(); return <><PageHeader title="FORMULA HISTORY" /><div className="tablewrap formula-history"><table><thead><tr><th>Sr no</th><th>Date</th><th>Number of Ingredients</th><th>Actions</th></tr></thead><tbody>{rows.map((sr, i) => <tr key={i}><td>{sr}</td><td>12-June-2026</td><td>10</td><td><div className="formula-history-actions"><button className="btn red" onClick={() => navigate(ROUTES.FORMULA_DETAIL)}>Open Detial</button><button className="btn cyan">Use as Default</button></div></td></tr>)}</tbody></table></div><div className="products-pagination"><span>Page <select defaultValue="1"><option>1</option></select> of 10</span><div className="page-controls"><button>&laquo;</button><button>&lsaquo;</button><button className="current">1</button><button>2</button><button>3</button><span>&hellip;</span><button>10</button><button>&rsaquo;</button><button>&raquo;</button></div></div></>; }
