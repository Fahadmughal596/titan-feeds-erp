import { CirclePlus, CircleX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

type Item = { feed: string; variant: string; bags: string; weight: string };
const INITIAL: Item[] = [
  { feed: '', variant: '', bags: '', weight: '400.000kg' },
  { feed: '', variant: '', bags: '', weight: '400.000kg' },
  { feed: '', variant: '', bags: '', weight: '400.000kg' },
];
const updateItem = (items: Item[], index: number, key: keyof Item, value: string) => items.map((item, i) => i === index ? { ...item, [key]: value } : item);

export default function MakeBOM() {
  const navigate = useNavigate(); const [items, setItems] = useState(INITIAL);
  const totalWeight = useMemo(() => items.reduce((sum, item) => sum + (Number.parseFloat(item.weight) || 0), 0), [items]);
  const make = () => { localStorage.setItem('titan_bom_v1', JSON.stringify([{ sr: '4', batch: 'Bat#0908', mfg: '12-June-2024', exp: '12-June-2028', bags: '160', weight: '4800kg' }])); navigate(ROUTES.BOM); };
  return <>
    <PageHeader title="MAKE BOM" />
    <div className="bom-summary"><div><b>Batch Number:</b><span>Bat#0908</span><b>Mfg Date:</b><span>12-June-2024</span><b>Expiry Date:</b><span>12-June-2028</span></div><div><b>Products:</b><span>Growth Max</span><span>Mother Care</span><span>Maintained Max</span></div><div><b>Bags</b><span>100</span><span>20</span><span>40</span></div><div><b>Weight</b><span>3000Kg</span><span>600Kg</span><span>1200Kg</span></div><div><b>Total Products:</b><span>3</span><b>Total Bags:</b><span>160</span><b>Total Weight:</b><span>4800kg</span></div></div>
    <div className="bom-items">{items.map((item, i) => <div className="bom-item" key={i}><label>Feed Name<select value={item.feed} onChange={(e) => setItems((v) => updateItem(v, i, 'feed', e.target.value))}><option value="">Select The Feed</option><option>Growth Max</option><option>Mother Care</option><option>Maintained Max</option></select></label><label>Variant<select value={item.variant} onChange={(e) => setItems((v) => updateItem(v, i, 'variant', e.target.value))}><option value="">Select Variant</option><option>30Kg</option><option>20Kg</option></select></label><label>Bags To Product<select value={item.bags} onChange={(e) => setItems((v) => updateItem(v, i, 'bags', e.target.value))}><option value="">Select Variant</option><option>20</option><option>40</option><option>100</option></select></label><label>Weight<input value={item.weight} onChange={(e) => setItems((v) => updateItem(v, i, 'weight', e.target.value))} /></label><button className="bom-remove" aria-label="Remove feed row" onClick={() => setItems((v) => v.filter((_, index) => index !== i))}><CircleX /></button>{i === items.length - 1 && <button className="bom-add" aria-label="Add feed row" onClick={() => setItems((v) => [...v, { feed: '', variant: '', bags: '', weight: `${totalWeight || 400}.000kg` }])}><CirclePlus /></button>}</div>)}</div>
    <div className="bom-actions"><button className="btn orange" onClick={make}>Make BOM</button><button className="btn green" onClick={() => window.print()}>Print BOMs</button><button className="btn cyan" onClick={() => window.print()}>Print Stickers</button></div>
  </>;
}
