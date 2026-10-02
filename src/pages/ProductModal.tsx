import { useMemo, useState } from 'react';
import { readBrands, readProducts } from '../utils/catalog';

type Kind = 'brand' | 'product' | 'variant';

export default function ProductModal({
  kind,
  onClose,
  onSaved,
}: {
  kind: Kind;
  onClose: () => void;
  onSaved: () => void;
}) {
  const brands = readBrands();
  const productNames = useMemo(() => {
    const names = Array.from(new Set(readProducts().map((item) => item.name).filter(Boolean)));
    return names.length ? names : ['Growth Max'];
  }, []);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [brand, setBrand] = useState(brands[0] || 'Titan Feeds');
  const [product, setProduct] = useState(productNames[0] || '');
  const [uom, setUom] = useState('Bag');
  const [packingSize, setPackingSize] = useState('');
  const [description, setDescription] = useState('');

  const title = kind === 'brand' ? 'Add Brand' : kind === 'product' ? 'Add Product' : 'Add Variant';
  const subtitle = kind === 'brand'
    ? 'Create and manage product brands'
    : kind === 'product'
      ? 'Add a product to the product table'
      : 'Define product variant and packing details';

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (kind === 'brand') {
      let saved: unknown = [];
      try { saved = JSON.parse(localStorage.getItem('titan_brands') || '[]'); } catch { /* empty */ }
      localStorage.setItem('titan_brands', JSON.stringify([...(Array.isArray(saved) ? saved : []), { name, description }]));
    } else {
      let saved: unknown = [];
      try { saved = JSON.parse(localStorage.getItem('titan_products_v4') || '[]'); } catch { /* empty */ }
      const rows = Array.isArray(saved) && (saved.length === 0 || saved.every((row) => Array.isArray(row) && row.length >= 7))
        ? saved as string[][]
        : [];
      rows.push(kind === 'product'
        ? [brand, name, '', code, '', '', description || '-']
        : [brand, product, name, code, uom, packingSize, description || '-']);
      localStorage.setItem('titan_products_v4', JSON.stringify(rows));
    }
    onSaved();
  };

  return (
    <div className="overlay">
      <form className={`modal product-modal ${kind}-modal`} onSubmit={save}>
        <div className="modalhead">
          <div><h2>{title}</h2><p>{subtitle}</p></div>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>

        {kind === 'brand' && (
          <>
            <label>Brand<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter Brand Name" /></label>
            <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter Description" /></label>
          </>
        )}

        {kind === 'product' && (
          <div className="modal-two">
            <label>Item Code<input required value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter Item Code" /></label>
            <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter Product Name" /></label>
            <label>Brand<select value={brand} onChange={(event) => setBrand(event.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="modal-full">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter Description" /></label>
          </div>
        )}

        {kind === 'variant' && (
          <>
            <div className="modal-two">
              <label>Item Code<input required value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter Item Code" /></label>
              <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter Variant Name" /></label>
              <label>Brand<select value={brand} onChange={(event) => setBrand(event.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>Product<select required value={product} onChange={(event) => setProduct(event.target.value)}>{productNames.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>UOM<select value={uom} onChange={(event) => setUom(event.target.value)}><option>Bag</option><option>KG</option><option>Ton</option></select></label>
              <label>Packing Size<input required value={packingSize} onChange={(event) => setPackingSize(event.target.value)} placeholder="e.g. 30KG" /></label>
            </div>
            <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter Description" /></label>
          </>
        )}

        <div className="modalactions">
          <button type="button" className="btn gray" onClick={onClose}>Cancel</button>
          <button className="btn orange">{title}</button>
        </div>
      </form>
    </div>
  );
}
