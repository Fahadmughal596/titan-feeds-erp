import { Download } from 'lucide-react';
import { PageHeader } from '../components/ui';
import { exportCsv } from '../utils/exportCsv';

const rows = [['Revenue', '1,200,000PKR', '980,000PKR', '+22%'], ['Expenses', '480,000PKR', '420,000PKR', '+14%'], ['Net Profit', '720,000PKR', '560,000PKR', '+28%']];
export default function FinanceAnalyticsPage() {
  return <><PageHeader title="FINANCE & ANALYTICS" /><div className="analytics-cards"><div><span>Total Revenue</span><strong>1.2M</strong></div><div><span>Total Expenses</span><strong>480K</strong></div><div><span>Net Profit</span><strong>720K</strong></div><div><span>Growth</span><strong>+22%</strong></div></div><div className="toolbar"><button className="btn green" onClick={() => exportCsv('titan-finance-analytics.csv', ['Metric', 'Current Month', 'Last Month', 'Change'], rows)}><Download />Export</button></div><div className="tablewrap analytics-table"><table><thead><tr>{['Metric', 'Current Month', 'Last Month', 'Change'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></>;
}
