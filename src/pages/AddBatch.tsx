import { useMemo, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { readFeedChoices } from '../utils/catalog';

type Item = { product: string; qty: number; rate: number };
const initialChoices = readFeedChoices();
const START_ITEMS: Item[] = Array.from({ length: 4 }, () => ({ product: initialChoices[0]?.name || 'Soyabean Meal', qty: 500, rate: 50 }));

export default function AddBatch() {
  const navigate = useNavigate();
  const storedChoices = readFeedChoices();
  const choices = storedChoices.length ? storedChoices : [{ name: 'Soyabean Meal', uom: 'KG' }];
  const [items, setItems] = useState<Item[]>(START_ITEMS);
  const [material, setMaterial] = useState('');
  const [po, setPo] = useState('');
  const [batch, setBatch] = useState('');
  const [name, setName] = useState('');
  const total = useMemo(() => items.reduce((sum, item) => sum + item.qty * item.rate, 0), [items]);
  const weight = useMemo(() => items.reduce((sum, item) => sum + Number(item.qty || 0), 0), [items]);
  const update = (index: number, key: keyof Item, value: string) => setItems((current) => current.map((item, i) => i === index ? { ...item, [key]: key === 'product' ? value : Number(value) } : item));
  const save = (event: React.FormEvent) => { event.preventDefault(); let saved: unknown = []; try { saved = JSON.parse(localStorage.getItem('titan_batches_v1') || '[]'); } catch { /* start with an empty batch list */ } const list = Array.isArray(saved) ? saved : []; list.push({ date: new Date().toLocaleDateString('en-GB'), batch, name, po: po || 'PO#001', items: String(items.length), total: `${total.toLocaleString()}PKR`, paid: '0PKR', unpaid: `${total.toLocaleString()}PKR`, status: 'Unpaid' }); localStorage.setItem('titan_batches_v1', JSON.stringify(list)); navigate(ROUTES.INVENTORY_BATCHES); };
  return <><PageHeader title="ADD INVENTORY" subtitle="Add batch" actions={<button className="btn orange" onClick={() => navigate(ROUTES.INVENTORY_BATCHES)}>List</button>} /><div className="tabs inventory-tabs"><button className="tab" onClick={() => navigate(ROUTES.INVENTORY_ADD)}>Inventory</button><button className="tab active">Batches</button></div><form onSubmit={save}><div className="formgrid two"><label><span>Select Type Of Material</span><select value={material} onChange={(event) => setMaterial(event.target.value)}><option value="">Select Material</option>{choices.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label><span>Select PO</span><select value={po} onChange={(event) => setPo(event.target.value)}><option value="">Select PO</option><option>PO#001</option></select></label><label><span>Batch Number</span><input value={batch} onChange={(event) => setBatch(event.target.value)} placeholder="Enter Batch Number" /></label><label><span>Name Of Batch</span><div className="inline"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter Name Of Batch" /><button type="button" className="btn cyan">Add References</button></div></label></div><h3 className="sectiontitle">Add Items</h3><div className="tablewrap"><table><thead><tr><th>Sr no.</th><th>Product</th><th>QTY</th><th>Purchase Rate</th><th>Sale Price</th><th>Total</th><th>Actions</th></tr></thead><tbody>{items.map((item, index) => <tr key={index}><td>{index + 1}</td><td><select value={item.product} onChange={(event) => update(index, 'product', event.target.value)}>{choices.map((choice) => <option key={choice.name}>{choice.name}</option>)}</select></td><td><input type="number" min="0" value={item.qty} onChange={(event) => update(index, 'qty', event.target.value)} /></td><td><input type="number" min="0" value={item.rate} onChange={(event) => update(index, 'rate', event.target.value)} /></td><td><input type="number" min="0" defaultValue="50" /></td><td>{(item.qty * item.rate).toLocaleString()}</td><td><button type="button" className="danger" onClick={() => setItems((current) => current.filter((_, i) => i !== index))}><Trash2 /></button></td></tr>)}<tr><td colSpan={7}><button type="button" className="plainadd" onClick={() => setItems((current) => [...current, { product: choices[0]?.name || 'Soyabean Meal', qty: 0, rate: 0 }])}><PlusCircle />Add item row</button></td></tr></tbody></table></div><div className="totals"><div><b>Total weight</b><span>{weight}Kg</span></div><div><b>Grand Total</b><span>{total.toLocaleString()}PKR</span></div></div><button className="btn orange savebtn">Add Material</button></form></>;
}
