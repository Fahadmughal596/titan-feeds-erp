import { ArrowRight, Boxes, CircleDollarSign, FileText, PackagePlus, Receipt, Users, WalletCards } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

const metrics = [
  { label: 'Total Stock Value', value: '120M', note: 'PKR', icon: Boxes, tone: 'orange' },
  { label: 'Total Stock Weight', value: '192Ton', note: 'Across inventory', icon: PackagePlus, tone: 'blue' },
  { label: 'Outstanding Invoices', value: '10M', note: '12 invoices pending', icon: Receipt, tone: 'red' },
  { label: 'This Month Expenses', value: '480K', note: '14% from last month', icon: WalletCards, tone: 'green' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const actions = [
    { label: 'Add Inventory', to: ROUTES.INVENTORY_ADD, icon: PackagePlus, tone: 'blue' },
    { label: 'Add Invoice', to: ROUTES.INVOICE_ADD, icon: FileText, tone: 'cyan' },
    { label: 'Add Expense', to: ROUTES.EXPENSE_ADD, icon: CircleDollarSign, tone: 'orange' },
    { label: 'Add Client', to: ROUTES.CLIENT_ADD, icon: Users, tone: 'green' },
  ];
  return <>
    <PageHeader title="DASHBOARD" subtitle="A quick overview of your feed business" />
    <section className="dashboard-welcome"><div><span>Welcome back</span><h2>Keep your operations moving.</h2><p>Review stock, payments and daily activity from one place.</p></div><button className="btn orange" onClick={() => navigate(ROUTES.INVENTORY)}>View Inventory <ArrowRight /></button></section>
    <section className="dashboard-metrics">{metrics.map(({ label, value, note, icon: Icon, tone }) => <div className="dashboard-metric" key={label}><div className={`metric-icon ${tone}`}><Icon /></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>)}</section>
    <div className="dashboard-columns"><section className="dashboard-panel"><div className="dashboard-panel-head"><div><h3>Quick actions</h3><p>Start a common task</p></div></div><div className="quick-actions">{actions.map(({ label, to, icon: Icon, tone }) => <button key={label} onClick={() => navigate(to)}><span className={`quick-icon ${tone}`}><Icon /></span><span>{label}</span><ArrowRight /></button>)}</div></section><section className="dashboard-panel"><div className="dashboard-panel-head"><div><h3>Recent activity</h3><p>Latest updates across your ERP</p></div><button className="panel-link" onClick={() => navigate(ROUTES.INVOICES)}>View all</button></div><div className="activity-list"><div><span className="activity-dot orange" /><p><b>Inventory batch BAT-039</b><small>Added to stock · Today</small></p><strong>+21 items</strong></div><div><span className="activity-dot green" /><p><b>Invoice INV-00193</b><small>Payment recorded · Yesterday</small></p><strong>Paid</strong></div><div><span className="activity-dot blue" /><p><b>Growth Max formula</b><small>Updated · 2 days ago</small></p><strong>Active</strong></div></div></section></div>
  </>;
}
