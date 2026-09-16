import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

export default function AddExpense() {
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, string>>({});
  const set = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); localStorage.setItem('last_expense', JSON.stringify(values)); try { const current = JSON.parse(localStorage.getItem('titan_expenses_v1') || '[]'); localStorage.setItem('titan_expenses_v1', JSON.stringify([...(Array.isArray(current) ? current : []), values])); } catch { localStorage.setItem('titan_expenses_v1', JSON.stringify([values])); } navigate(ROUTES.EXPENSES); };
  return <form onSubmit={submit}><PageHeader title="ADD EXPENSE" actions={<button type="button" className="btn light" onClick={() => navigate(ROUTES.EXPENSES)}>List</button>} /><section className="partner-form-card"><div className="formgrid two"><label>Category<select required value={values.category || ''} onChange={(e) => set('category', e.target.value)}><option value="">Select Category</option><option>Rent</option><option>Salary</option></select></label><label>Sub Category<input required value={values.subCategory || ''} onChange={(e) => set('subCategory', e.target.value)} placeholder="Enter Sub Category" /></label><label>Date<input required type="date" value={values.date || ''} onChange={(e) => set('date', e.target.value)} /></label><label>Amount<input required value={values.amount || ''} onChange={(e) => set('amount', e.target.value)} placeholder="Enter Amount" /></label><label className="full">Description<textarea value={values.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Enter Description" /></label></div><button className="btn orange">Add Expense</button></section></form>;
}
