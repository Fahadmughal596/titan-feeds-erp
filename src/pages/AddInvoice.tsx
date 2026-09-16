import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { readProducts } from '../utils/catalog';

type Item = { code: string; product: string; qty: string; price: string; discount: string };
const blankItem = (): Item => ({ code: '', product: '', qty: '1', price: '', discount: '0' });
type Client = { name: string; company: string; phone: string; email: string; address: string };
const loadClients = (): Client[] => {
  try {
    const raw = JSON.parse(localStorage.getItem('titan_clients_v1') || localStorage.getItem('clients') || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.map((row: unknown) => {
      if (Array.isArray(row)) return { name: String(row[1] || ''), company: String(row[3] || ''), phone: String(row[2] || ''), email: '', address: String(row[4] || '') };
      const item = (row || {}) as Record<string, unknown>;
      return { name: String(item.name || item.clientName || ''), company: String(item.company || item.companyName || ''), phone: String(item.phone || item.phoneNumber || ''), email: String(item.email || ''), address: String(item.address || '') };
    }).filter((row) => row.name);
  } catch { return []; }
};

export default function AddInvoice() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([blankItem()]);
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const products = useMemo(() => {
    const savedProducts = readProducts();
    return savedProducts.length ? savedProducts : [{ name: 'Growth Max', itemCode: '33', variant: '30Kg' }, { name: 'Maintaince Pro', itemCode: '3320', variant: '20Kg' }];
  }, []);
  const clients = useMemo(loadClients, []);
  const set = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));
  const updateItem = (index: number, field: keyof Item, value: string) => setItems((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const chooseCode = (index: number, code: string) => { const match = products.find((product) => product.itemCode === code); setItems((current) => current.map((item, i) => i === index ? { ...item, code, product: match?.name || item.product, price: item.price || (match?.itemCode === '33' ? '4500' : match?.itemCode === '3320' ? '5200' : '') } : item)); };
  const chooseProduct = (index: number, productName: string) => { const match = products.find((product) => product.name === productName); setItems((current) => current.map((item, i) => i === index ? { ...item, product: productName, code: match?.itemCode || item.code, price: item.price || (match?.itemCode === '33' ? '4500' : match?.itemCode === '3320' ? '5200' : '') } : item)); };
  const itemTotal = (item: Item) => Math.max(0, Number(item.qty || 0) * Number(item.price || 0) - Number(item.discount || 0));
  const netTotal = items.reduce((sum, item) => sum + itemTotal(item), 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('last_invoice', JSON.stringify({ ...values, items }));
    setSaved(true);
    window.setTimeout(() => navigate(ROUTES.INVOICES), 450);
  };

  return <form onSubmit={submit}>
    <PageHeader title="INVOICES" actions={<button type="button" className="btn orange" onClick={() => navigate(ROUTES.INVOICES)}>List</button>} />
    <section className="invoice-form-card">
      <h2>Invoice Details</h2>
      <div className="formgrid three">
        <label>Invoice Number<input required value={values.invoiceNumber || ''} onChange={(e) => set('invoiceNumber', e.target.value)} placeholder="Enter Invoice Number" /></label>
        <label>Date<input required type="date" value={values.date || ''} onChange={(e) => set('date', e.target.value)} /></label>
        <label>Payment Terms<select required value={values.terms || ''} onChange={(e) => set('terms', e.target.value)}><option value="">Select Payment Terms</option><option>Credit</option><option>Cash</option></select></label>
      </div>
      <h2>Client Detail</h2>
      <div className="formgrid three">
        <label>Select Client<select value={values.clientName || ''} onChange={(e) => { const client = clients.find((row) => row.name === e.target.value); set('clientName', e.target.value); if (client) setValues((current) => ({ ...current, clientName: client.name, companyName: client.company, phoneNumber: client.phone, email: client.email, address: client.address })); }}><option value="">Select existing client</option>{clients.map((client) => <option key={`${client.name}-${client.phone}`} value={client.name}>{client.name}</option>)}</select></label>
        {['companyName', 'phoneNumber', 'email'].map((field) => <label key={field}>{field === 'companyName' ? 'Company Name' : field === 'phoneNumber' ? 'Phone Number' : 'Email'}<input value={values[field] || ''} onChange={(e) => set(field, e.target.value)} placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`} /></label>)}
        <label className="full">Address<textarea value={values.address || ''} onChange={(e) => set('address', e.target.value)} placeholder="Enter Address" /></label>
      </div>
      <h2>Add Items</h2>
      <div className="tablewrap invoice-items"><table><thead><tr>{['Sr no.', 'Item Code', 'Product', 'QTY', 'Unit Price', 'Discount', 'Total', 'Actions'].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>
        {items.map((item, index) => <tr key={index}><td>{index + 1}</td><td><select value={item.code} onChange={(e) => chooseCode(index, e.target.value)}><option value="">Select Code</option>{products.filter((product) => product.itemCode).map((product) => <option key={product.itemCode} value={product.itemCode}>{product.itemCode}</option>)}</select></td><td><select value={item.product} onChange={(e) => chooseProduct(index, e.target.value)}><option value="">Select Product</option>{Array.from(new Set(products.map((product) => product.name))).map((name) => <option key={name}>{name}</option>)}</select><small className="invoice-item-price">Price: {item.price || '—'}</small></td><td><input type="number" min="1" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} /></td><td><input type="number" min="0" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} placeholder="4500" /></td><td><input type="number" min="0" value={item.discount} onChange={(e) => updateItem(index, 'discount', e.target.value)} placeholder="100" /></td><td>{itemTotal(item).toLocaleString()}</td><td><button type="button" className="line-delete" onClick={() => setItems((current) => current.length === 1 ? current : current.filter((_, i) => i !== index))}><Trash2 /></button></td></tr>)}
        <tr><td colSpan={8}><button type="button" className="add-line" onClick={() => setItems((current) => [...current, blankItem()])}><Plus /> Add item row</button></td></tr>
      </tbody></table></div>
      <div className="invoice-totals"><div><span>Net Total</span><b>{netTotal.toLocaleString()}</b></div><div><span>Discount</span><b>0</b></div><div><span>Grand Total</span><b>{netTotal.toLocaleString()}</b></div></div>
      <div className="invoice-actions"><button type="submit" className="btn orange">Save &amp; Print</button><button type="submit" className="btn cyan">Save</button></div>
      {saved && <p className="form-success">Invoice saved.</p>}
    </section>
  </form>;
}
