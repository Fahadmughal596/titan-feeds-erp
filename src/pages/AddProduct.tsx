import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

export default function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState(''); const [brand, setBrand] = useState('Titan Feeds'); const [description, setDescription] = useState('');
  const submit = (e: React.FormEvent) => { e.preventDefault(); const rows = JSON.parse(localStorage.getItem('titan_products_v4') || '[]'); const list = Array.isArray(rows) && rows[0]?.length ? rows : []; list.push([brand, name, '-', '', 'Bag', '', description || '-']); localStorage.setItem('titan_products_v4', JSON.stringify(list)); navigate(ROUTES.PRODUCTS); };
  return <><PageHeader title="ADD PRODUCTS" subtitle="Add new product to inventory" actions={<button className="btn orange" onClick={() => navigate(ROUTES.PRODUCTS)}>List</button>} /><form className="product-form" onSubmit={submit}><label>Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Product Name" /></label><label>Brand<select value={brand} onChange={(e) => setBrand(e.target.value)}><option>Titan Feeds</option><option>Other</option></select></label><label className="full">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" /></label><button className="btn orange formsubmit">Add Product</button></form></>;
}
