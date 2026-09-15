import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { readRawMaterials } from '../utils/catalog';

export default function AddStock() {
  const navigate = useNavigate();
  const storedMaterials = readRawMaterials();
  const materials = storedMaterials.length ? storedMaterials : [{ name: 'Soyabean Meal', uom: 'KG' }];
  const [material, setMaterial] = useState(materials[0]?.name || '');
  const [uom, setUom] = useState(materials[0]?.uom || 'KG');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const existing = (() => { try { const parsed = JSON.parse(localStorage.getItem('titan_stock_v1') || '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; } })();
    localStorage.setItem('titan_stock_v1', JSON.stringify([...existing, { material, uom, quantity, price }]));
    navigate(ROUTES.INVENTORY);
  };
  return <><PageHeader title="ADD INVENTORY" subtitle="Add material stock" actions={<button className="btn orange" onClick={() => navigate(ROUTES.INVENTORY)}>List</button>} /><form className="product-form inventory-form" onSubmit={save}><label>Material<select required value={material} onChange={(event) => setMaterial(event.target.value)}><option value="">Select Material</option>{materials.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>UOM<select value={uom} onChange={(event) => setUom(event.target.value)}><option>KG</option><option>Bag</option><option>Ton</option></select></label><label>Available Quantity<input required type="number" min="0" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Enter Quantity" /></label><label>Price<input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Enter Price" /></label><button className="btn orange formsubmit">Add Inventory</button></form></>;
}
