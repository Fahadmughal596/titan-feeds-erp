import { Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { exportCsv } from '../utils/exportCsv';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Bank = { name: string; opening: string; current: string };
type Transaction = { date: string; account: string; type: string; amount: string; note: string };
const defaultBanks: Bank[] = [{ name: 'Bank Alfalah', opening: '0', current: '0' }, { name: 'Meezan Bank', opening: '0', current: '0' }];
const defaultPayables = [['1', 'Ali Supplier', 'PO-001', '250,000 PKR', 'Unpaid'], ['2', 'Feed Vendor', 'PO-002', '120,000 PKR', 'Unpaid']];

export default function AccountsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'banks';
  const [banks, setBanks] = useState<Bank[]>(() => { try { const value = JSON.parse(localStorage.getItem('titan_banks_v1') || 'null'); return Array.isArray(value) && value.length ? value : defaultBanks; } catch { return defaultBanks; } });
  const [transactions, setTransactions] = useState<Transaction[]>(() => { try { const value = JSON.parse(localStorage.getItem('titan_account_transactions_v1') || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } });
  const [modal, setModal] = useState(false);
  const [drafts, setDrafts] = useState<Transaction[]>([{ date: '', account: 'Bank Alfalah', type: 'Online', amount: '', note: '' }]);
  const setTab = (value: string) => setParams({ tab: value });
  const addDraft = () => setDrafts((current) => [...current, { date: '', account: 'Bank Alfalah', type: 'Online', amount: '', note: '' }]);
  const updateDraft = (index: number, key: keyof Transaction, value: string) => setDrafts((current) => current.map((row, i) => i === index ? { ...row, [key]: value } : row));
  const saveTransactions = () => { const next = [...transactions, ...drafts.filter((row) => row.amount)]; setTransactions(next); localStorage.setItem('titan_account_transactions_v1', JSON.stringify(next)); setModal(false); };
  const updateBank = (index: number, key: keyof Bank, value: string) => { const next = banks.map((row, i) => i === index ? { ...row, [key]: value, ...(key === 'opening' ? { current: value } : {}) } : row); setBanks(next); localStorage.setItem('titan_banks_v1', JSON.stringify(next)); };
  const totals = useMemo(() => banks.reduce((sum, bank) => sum + Number(bank.current || 0), 0), [banks]);

  return <>
    <PageHeader title="ACCOUNTS" subtitle="Banks, payables, transactions and allocations" actions={<button className="btn orange" onClick={() => navigate(ROUTES.EXPENSE_ALLOCATIONS)}>Expense Allocations</button>} />
    <div className="tabs account-tabs"><button className={tab === 'banks' ? 'tab active' : 'tab'} onClick={() => setTab('banks')}>Banks</button><button className={tab === 'payables' ? 'tab active' : 'tab'} onClick={() => setTab('payables')}>Payables</button><button className={tab === 'transactions' ? 'tab active' : 'tab'} onClick={() => setTab('transactions')}>Transactions</button></div>
    {tab === 'banks' && <><div className="account-cards">{banks.map((bank, index) => <div className="account-card" key={bank.name}><span>{bank.name}</span><label>Opening Balance<input value={bank.opening} onChange={(e) => updateBank(index, 'opening', e.target.value)} /></label><b>{Number(bank.current || 0).toLocaleString()} PKR</b></div>)}<div className="account-card total"><span>Total Balance</span><b>{totals.toLocaleString()} PKR</b></div></div><div className="toolbar"><button className="btn blue" onClick={() => setModal(true)}><Plus />Add Transaction</button><button className="btn green" onClick={() => exportCsv('titan-banks.csv', ['Bank', 'Opening Balance', 'Current Balance'], banks.map((b) => [b.name, b.opening, b.current]))}>Download Banks</button></div></>}
    {tab === 'payables' && <><div className="toolbar"><button className="btn green" onClick={() => exportCsv('titan-payables.csv', ['Sr no.', 'Supplier', 'PO Number', 'Amount', 'Status'], defaultPayables)}>Download Payables</button></div><div className="tablewrap"><table><thead><tr>{['Sr no.', 'Supplier', 'PO Number', 'Amount', 'Status'].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{defaultPayables.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></>}
    {tab === 'transactions' && <><div className="toolbar"><button className="btn blue" onClick={() => setModal(true)}><Plus />Add Transaction</button></div><div className="tablewrap"><table><thead><tr>{['Date', 'Account', 'Type', 'Amount', 'Note'].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{transactions.length ? transactions.map((row, i) => <tr key={i}><td>{row.date}</td><td>{row.account}</td><td>{row.type}</td><td>{row.amount}</td><td>{row.note}</td></tr>) : <tr><td colSpan={5}>No transactions yet.</td></tr>}</tbody></table></div></>}
    {modal && <div className="overlay" role="dialog" aria-modal="true"><section className="modal transaction-modal"><div className="modalhead"><div><h2>Add Transactions</h2><p>Cash goes to Cash Ledger; Online goes to the selected bank.</p></div><button type="button" onClick={() => setModal(false)} aria-label="Close"><X /></button></div>{drafts.map((row, index) => <div className="transaction-row" key={index}><input type="date" value={row.date} onChange={(e) => updateDraft(index, 'date', e.target.value)} /><select value={row.account} onChange={(e) => updateDraft(index, 'account', e.target.value)}><option>Cash Ledger</option>{banks.map((bank) => <option key={bank.name}>{bank.name}</option>)}</select><select value={row.type} onChange={(e) => updateDraft(index, 'type', e.target.value)}><option>Cash</option><option>Online</option></select><input type="number" value={row.amount} onChange={(e) => updateDraft(index, 'amount', e.target.value)} placeholder="Amount" /><input value={row.note} onChange={(e) => updateDraft(index, 'note', e.target.value)} placeholder="Description" /></div>)}<div className="invoice-actions"><button className="btn light" type="button" onClick={addDraft}><Plus />Another transaction</button><button className="btn orange" type="button" onClick={saveTransactions}>Save Transactions</button></div></section></div>}
  </>;
}
