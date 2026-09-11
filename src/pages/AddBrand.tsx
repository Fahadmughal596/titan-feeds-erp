import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

export default function AddBrand() {
  const navigate = useNavigate(); const [name, setName] = useState(''); const [description, setDescription] = useState('');
  const submit = (e: React.FormEvent) => { e.preventDefault(); const brands = JSON.parse(localStorage.getItem('titan_brands') || '[]'); localStorage.setItem('titan_brands', JSON.stringify([... (Array.isArray(brands) ? brands : []), { name, description }])); navigate(ROUTES.PRODUCTS); };
  return <><PageHeader title="ADD BRANDS" subtitle="Create and manage product brands" actions={<button className="btn orange" onClick={() => navigate(ROUTES.PRODUCTS)}>List</button>} /><form className="product-form" onSubmit={submit}><label>Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Brand Name" /></label><label className="full">Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter Description" /></label><button className="btn orange formsubmit">Add Brand</button></form></>;
}
