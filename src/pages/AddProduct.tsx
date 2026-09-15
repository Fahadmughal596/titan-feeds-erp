import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { readBrands } from '../utils/catalog';

export default function AddProduct() {
  const navigate = useNavigate();
  const brands = readBrands();
  const [name, setName] = useState(''); const [brand, setBrand] = useState(brands[0] || 'Titan Feeds'); const [description, setDescription] = useState('');
  const submit = (e: React.FormEvent) => { e.preventDefault(); let rows: unknown = []; try { rows = JSON.parse(localStorage.getItem('titan_products_v4') || '[]'); } catch { /* start with empty catalogue */ } const list = Array.isArray(rows) && (rows.length === 0 || rows.every((row) => Array.isArray(row) && row.length >= 7)) ? rows as string[][] : []; list.push([brand, name, '-', '', 'Bag', '', description || '-']); localStorage.setItem('titan_products_v4', JSON.stringify(list)); navigate(ROUTES.PRODUCTS); };
  return <><PageHeader title="ADD PRODUCTS" subtitle="Add new product to inventory" actions={<button className="btn orange" onClick={() => navigate(ROUTES.PRODUCTS)}>List</button>} /><form className="product-form" onSubmit={submit}><label>Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Product Name" /></label><label>Brand<select value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label><label className="full">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" /></label><button className="btn orange formsubmit">Add Product</button></form></>;
}
