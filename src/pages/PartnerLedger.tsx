import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';

type LedgerKind = 'client' | 'supplier';
type LedgerRow = { date: string; reference: string; description: string; debit: string; credit: string; balance: string };

const fallback: LedgerRow[] = [
  { date: '12-June-2026', reference: 'INV-00193', description: 'Opening transaction', debit: '100,000 PKR', credit: '0 PKR', balance: '100,000 PKR' },
  { date: '15-June-2026', reference: 'PAY-0008', description: 'Payment received', debit: '0 PKR', credit: '40,000 PKR', balance: '60,000 PKR' },
];

export default function PartnerLedger({ kind }: { kind: LedgerKind }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const label = kind === 'client' ? 'Client' : 'Supplier';
  const partnerName = params.get('name') || (kind === 'client' ? 'Ali Raza' : 'Ali Supplier');
  const rows = fallback;
  const csvRows = rows.map((row) => [row.date, row.reference, row.description, row.debit, row.credit, row.balance]);
  return <>
    <PageHeader title={`${label.toUpperCase()} LEDGER`} subtitle={`${label} transaction history`} actions={<button className="btn light" onClick={() => navigate(ROUTES.CLIENTS_SUPPLIERS)}><ArrowLeft />Back to list</button>} />
    <div className="ledger-summary"><div><span>{label} Name</span><b>{partnerName}</b></div><div><span>Total Debit</span><b>100,000 PKR</b></div><div><span>Total Credit</span><b>40,000 PKR</b></div><div><span>Balance</span><b>60,000 PKR</b></div></div>
    <div className="toolbar ledger-toolbar"><button className="btn green" onClick={() => exportCsv(`titan-${kind}-ledger.csv`, ['Date', 'Reference', 'Description', 'Debit', 'Credit', 'Balance'], csvRows)}><Download />Download Excel</button><button className="btn light" onClick={() => window.print()}><Download />Download PDF</button></div>
    <div className="tablewrap ledger-table"><table><thead><tr>{['Date', 'Reference', 'Description', 'Debit', 'Credit', 'Balance'].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.reference}><td>{row.date}</td><td>{row.reference}</td><td>{row.description}</td><td>{row.debit}</td><td>{row.credit}</td><td>{row.balance}</td></tr>)}</tbody></table></div>
  </>;
}
