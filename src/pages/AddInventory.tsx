import { useMemo, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

type Item = { product: string; qty: number; rate: number };

const START_ITEMS: Item[] = Array.from({ length: 4 }, () => ({
  product: 'Soyabean Meal',
  qty: 500,
  rate: 50,
}));

export default function AddInventory() {
  const [tab, setTab] = useState('Inventory');
  const [items, setItems] = useState<Item[]>(START_ITEMS);
  const navigate = useNavigate();

  const total = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.rate, 0), [items]);
  const weight = useMemo(() => items.reduce((sum, i) => sum + Number(i.qty || 0), 0), [items]);

  const update = (index: number, key: keyof Item, value: string) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: key === 'product' ? value : Number(value) } : item
      )
    );
  };

  const addRow = () => setItems((prev) => [...prev, { product: 'Soyabean Meal', qty: 0, rate: 0 }]);
  const removeRow = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const save = () => navigate(ROUTES.INVENTORY);

  return (
    <>
      <PageHeader title="ADD INVENTORY" />

      <div className="tabs">
        {['Inventory', 'Batches'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'tab active' : 'tab'}>
            {t}
          </button>
        ))}
      </div>

      <div className="formgrid two">
        <label>
          <span>Select Type Of Material</span>
          <select>
            <option>Select Material</option>
            <option>Raw Material</option>
            <option>Finished Goods</option>
          </select>
        </label>
        <label>
          <span>Select PO</span>
          <select>
            <option>Select PO</option>
            <option>PO#001</option>
          </select>
        </label>
        <label>
          <span>Batch Number</span>
          <input placeholder="Enter Batch Number" />
        </label>
        <label>
          <span>Name Of Batch</span>
          <div className="inline">
            <input placeholder="Enter Name Of Batch" />
            <button type="button" className="btn cyan">
              Add References
            </button>
          </div>
        </label>
      </div>

      <h3 className="sectiontitle">Add Items</h3>

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Product</th>
              <th>QTY</th>
              <th>Purchase Rate</th>
              <th>Total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <input
                    value={item.product}
                    onChange={(e) => update(i, 'product', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => update(i, 'qty', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => update(i, 'rate', e.target.value)}
                  />
                </td>
                <td>{(item.qty * item.rate).toLocaleString()}</td>
                <td>
                  <div className="icons">
                    <button className="danger" onClick={() => removeRow(i)} aria-label="Remove row">
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={6}>
                <button className="plainadd" onClick={addRow}>
                  <PlusCircle />
                  Add item row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="totals">
        <div>
          <b>Total weight</b>
          <span>{weight}Kg</span>
        </div>
        <div>
          <b>Grand Total</b>
          <span>{total.toLocaleString()}</span>
        </div>
      </div>

      <button className="btn orange savebtn" onClick={save}>
        Add Material
      </button>
    </>
  );
}
