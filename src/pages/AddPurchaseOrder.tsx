import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { readProducts } from '../utils/catalog';

type Item = { code: string; product: string; qty: string; price: string };
const blankItem = (): Item => ({ code: '', product: '', qty: '1', price: '' });
type Supplier = { name: string; company?: string; phone?: string };

function readSuppliers(): Supplier[] {
  try {
    const rows = JSON.parse(localStorage.getItem('titan_suppliers_v1') || '[]');
    return Array.isArray(rows) ? rows.map((row) => ({ name: String(row?.name || ''), company: String(row?.company || row?.companyName || ''), phone: String(row?.phone || '') })).filter((row) => row.name) : [];
  } catch { return []; }
}

export default function AddPurchaseOrder() {
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, string>>({ paymentStatus: 'Unpaid' });
  const [items, setItems] = useState<Item[]>([blankItem()]);
  const [saved, setSaved] = useState(false);
  const products = useMemo(() => readProducts().length ? readProducts() : [{ name: 'Growth Max', itemCode: '33' }, { name: 'Maintaince Pro', itemCode: '3320' }], []);
  const suppliers = useMemo(readSuppliers, []);
  const existingOrders = useMemo(() => { try { const value = JSON.parse(localStorage.getItem('titan_purchase_orders_v1') || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }, []);
  const poNumbers = useMemo(() => Array.from(new Set(['PO-001', 'PO-002', ...existingOrders.map((row) => String(row?.number || '')).filter(Boolean)])), [existingOrders]);
  const set = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const updateItem = (index: number, field: keyof Item, value: string) => setItems((current) => current.map((item, i) => i === index ? { ...item, [field]: value } : item));
  const chooseProduct = (index: number, name: string) => { const match = products.find((product) => product.name === name); setItems((current) => current.map((item, i) => i === index ? { ...item, product: name, code: match?.itemCode || '', price: item.price || '' } : item)); };
  const chooseCode = (index: number, code: string) => { const match = products.find((product) => product.itemCode === code); setItems((current) => current.map((item, i) => i === index ? { ...item, code, product: match?.name || item.product } : item)); };
  const total = items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);

  const selectPo = (number: string) => {
    set('poNumber', number);
    try {
      const rows = JSON.parse(localStorage.getItem('titan_purchase_orders_v1') || '[]');
      const match = Array.isArray(rows) ? rows.find((row) => row?.number === number) : null;
      if (match) {
        setValues((current) => ({ ...current, supplier: String(match.supplier || ''), vendorName: String(match.vendorName || match.supplier || ''), date: String(match.date || ''), supplyDate: String(match.supplyDate || ''), paymentType: String(match.paymentType || match.terms || ''), paymentStatus: String(match.status || 'Unpaid') }));
        if (Array.isArray(match.items) && match.items.length) setItems(match.items);
      }
    } catch { /* keep the empty form */ }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const status = values.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
    const paid = status === 'Paid' ? total : 0;
    const order = { ...values, items, number: values.poNumber || '', vendor: values.supplier || values.vendor || '', vendorName: values.vendorName || values.supplier || '', supplyDate: values.supplyDate || '', amount: String(total), paid: String(paid), unpaid: String(Math.max(0, total - paid)), terms: values.paymentType || '', status };
    try {
      const current = JSON.parse(localStorage.getItem('titan_purchase_orders_v1') || '[]');
      localStorage.setItem('titan_purchase_orders_v1', JSON.stringify([...(Array.isArray(current) ? current : []), order]));
    } catch { localStorage.setItem('titan_purchase_orders_v1', JSON.stringify([order])); }
    setSaved(true);
    window.setTimeout(() => navigate(ROUTES.PURCHASE_ORDERS), 450);
  };

  return <form onSubmit={submit}>
    <PageHeader title="PURCHASE ORDER" actions={<button type="button" className="btn light" onClick={() => navigate(ROUTES.PURCHASE_ORDERS)}>List</button>} />
    <section className="invoice-form-card">
      <h2>Purchase Order Details</h2>
      <div className="formgrid three">
        <label>PO Number<select required value={values.poNumber || ''} onChange={(e) => selectPo(e.target.value)}><option value="">Select PO number</option>{poNumbers.map((number) => <option key={number}>{number}</option>)}</select></label>
        <label>Date<input required type="date" value={values.date || ''} onChange={(e) => set('date', e.target.value)} /></label>
        <label>Supply Date<input required type="date" value={values.supplyDate || ''} onChange={(e) => set('supplyDate', e.target.value)} /></label>
        <label>Payment Type<select required value={values.paymentType || ''} onChange={(e) => set('paymentType', e.target.value)}><option value="">Select payment type</option><option>Cash</option><option>Credit</option><option>Online</option></select></label>
        <label>Payment Status<select required value={values.paymentStatus || 'Unpaid'} onChange={(e) => set('paymentStatus', e.target.value)}><option>Unpaid</option><option>Paid</option></select></label>
        <label>Supplier / Vendor<select required value={values.supplier || ''} onChange={(e) => { const supplier = suppliers.find((row) => row.name === e.target.value); setValues((current) => ({ ...current, supplier: e.target.value, vendorName: supplier?.company || e.target.value, phone: supplier?.phone || '' })); }}><option value="">Select supplier</option>{suppliers.map((row) => <option key={`${row.name}-${row.phone}`} value={row.name}>{row.name}</option>)}{!suppliers.length && <option>Ali Supplier</option>}</select></label>
        <label>Advance Payment<input type="number" min="0" value={values.advancePayment || ''} onChange={(e) => set('advancePayment', e.target.value)} placeholder="0" /></label>
      </div>
      <h2>Products</h2>
      <div className="tablewrap invoice-items"><table><thead><tr>{['Sr no.', 'Item Code', 'Product', 'QTY', 'Purchase Rate', 'Total', 'Actions'].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>
        {items.map((item, index) => <tr key={index}><td>{index + 1}</td><td><select value={item.code} onChange={(e) => chooseCode(index, e.target.value)}><option value="">Select code</option>{products.filter((product) => product.itemCode).map((product) => <option key={product.itemCode} value={product.itemCode}>{product.itemCode}</option>)}</select></td><td><select value={item.product} onChange={(e) => chooseProduct(index, e.target.value)}><option value="">Select product</option>{products.map((product) => <option key={product.name}>{product.name}</option>)}</select></td><td><input type="number" min="1" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} /></td><td><input type="number" min="0" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} placeholder="0" /></td><td>{(Number(item.qty || 0) * Number(item.price || 0)).toLocaleString()}</td><td><button type="button" className="line-delete" onClick={() => setItems((current) => current.length === 1 ? current : current.filter((_, i) => i !== index))}><Trash2 /></button></td></tr>)}
        <tr><td colSpan={7}><button type="button" className="add-line" onClick={() => setItems((current) => [...current, blankItem()])}><Plus /> Add product row</button></td></tr>
      </tbody></table></div>
      <div className="invoice-totals"><div><span>Advance Payment</span><b>{Number(values.advancePayment || 0).toLocaleString()}</b></div><div><span>Grand Total</span><b>{total.toLocaleString()}</b></div></div>
      <div className="invoice-actions"><button type="submit" className="btn orange">Save Purchase Order</button></div>
      {saved && <p className="form-success">Purchase order saved.</p>}
    </section>
  </form>;
}
