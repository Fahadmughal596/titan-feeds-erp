import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

type BatchValues = {
  date: string;
  batch: string;
  name: string;
  po: string;
  items: string;
  total: string;
  paid: string;
  status: string;
};

const initial: BatchValues = {
  date: '',
  batch: '',
  name: '',
  po: '',
  items: '',
  total: '',
  paid: '',
  status: 'Unpaid',
};

export default function AddBatch() {
  const navigate = useNavigate();
  const [values, setValues] = useState<BatchValues>(initial);
  const [saved, setSaved] = useState(false);
  const set = (key: keyof BatchValues, value: string) => setValues((current) => ({ ...current, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const total = Number(values.total || 0);
    const paid = values.status === 'Paid' ? total : Number(values.paid || 0);
    const row = { ...values, total: String(total), paid: String(paid), unpaid: String(Math.max(0, total - paid)) };
    try {
      const current = JSON.parse(localStorage.getItem('titan_batches_v4') || '[]');
      localStorage.setItem('titan_batches_v4', JSON.stringify([row, ...(Array.isArray(current) ? current : [])]));
    } catch {
      localStorage.setItem('titan_batches_v4', JSON.stringify([row]));
    }
    setSaved(true);
    window.setTimeout(() => navigate(ROUTES.INVENTORY_BATCHES), 350);
  };

  return <form onSubmit={submit}>
    <PageHeader title="ADD BATCH" actions={<button type="button" className="btn light" onClick={() => navigate(ROUTES.INVENTORY_BATCHES)}>List</button>} />
    <section className="invoice-form-card">
      <h2>Batch Details</h2>
      <div className="formgrid three">
        <label>Date<input required type="date" value={values.date} onChange={(event) => set('date', event.target.value)} /></label>
        <label>Batch Number<input required value={values.batch} onChange={(event) => set('batch', event.target.value)} placeholder="BAT-039" /></label>
        <label>Batch Name<input required value={values.name} onChange={(event) => set('name', event.target.value)} placeholder="Mix Ration" /></label>
        <label>PO Number<input value={values.po} onChange={(event) => set('po', event.target.value)} placeholder="PO#001" /></label>
        <label>Items<input type="number" min="0" value={values.items} onChange={(event) => set('items', event.target.value)} placeholder="0" /></label>
        <label>Total Amount<input type="number" min="0" value={values.total} onChange={(event) => set('total', event.target.value)} placeholder="0" /></label>
        <label>Paid Amount<input type="number" min="0" value={values.paid} onChange={(event) => set('paid', event.target.value)} placeholder="0" /></label>
        <label>Status<select value={values.status} onChange={(event) => set('status', event.target.value)}><option>Unpaid</option><option>Partially Paid</option><option>Paid</option></select></label>
      </div>
      <div className="invoice-actions"><button type="submit" className="btn orange">Save Batch</button></div>
      {saved && <p className="form-success">Batch saved.</p>}
    </section>
  </form>;
}
