import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

export default function PartnerForm({ kind }: { kind: 'client' | 'supplier' }) {
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const set = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); localStorage.setItem(`last_${kind}`, JSON.stringify(values)); const key = kind === 'client' ? 'titan_clients_v1' : 'titan_suppliers_v1'; let current: unknown[] = []; try { const parsed = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(parsed)) current = parsed; } catch { /* start a new list */ } localStorage.setItem(key, JSON.stringify([...current, values])); setSaved(true); window.setTimeout(() => navigate(ROUTES.CLIENTS_SUPPLIERS), 400); };
  const label = kind === 'client' ? 'Client' : 'Supplier';
  return <form onSubmit={submit}><PageHeader title={`ADD ${label.toUpperCase()}`} subtitle={`Add new ${label.toLowerCase()} details quickly`} actions={<button type="button" className="btn light" onClick={() => navigate(ROUTES.CLIENTS_SUPPLIERS)}>List</button>} /><section className="partner-form-card"><div className="formgrid two"><label>Name<input required value={values.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="Enter Client Name" /></label><label>Company Name<input value={values.company || ''} onChange={(e) => set('company', e.target.value)} placeholder="Enter Company Name" /></label><label>Phone Number<input required value={values.phone || ''} onChange={(e) => set('phone', e.target.value)} placeholder="Enter Phone Number" /></label><label>Email<input type="email" value={values.email || ''} onChange={(e) => set('email', e.target.value)} placeholder="Enter Email" /></label><label className="full">Address<input value={values.address || ''} onChange={(e) => set('address', e.target.value)} placeholder="Enter Address" /></label></div><button className="btn orange" type="submit">Add {label}</button>{saved && <p className="form-success">{label} saved.</p>}</section></form>;
}
