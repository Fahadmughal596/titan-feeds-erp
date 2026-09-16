import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

const fields = [
  ['DM %', 'DM'], ['CP %', 'CP'], ['ME (Mcal/Kg)', 'ME'], ['GE (Mcal/Kg)', 'GE'],
  ['EE %', 'EE'], ['CF %', 'CF'], ['TDN %', 'TDN'], ['NDF %', 'NDF'],
  ['ADF %', 'ADF'], ['Ash %', 'Ash'], ['Ca %', 'Ca'], ['P %', 'P'],
] as const;

export default function AddMaterialNutrition() {
  const navigate = useNavigate();
  const pdfInput = useRef<HTMLInputElement>(null);

  const [pdfName, setPdfName] = useState('');
  const [values, setValues] = useState<Record<string, string>>({
    Name: '',
    UOM: '',
  });

  const update = (key: string, value: string) => {
    setValues((old) => ({ ...old, [key]: value }));
  };

  const saveMaterial = (event: React.FormEvent) => {
    event.preventDefault();

    let rawRows: any[][] = [];
    let inventoryRows: any[][] = [];

    try {
      rawRows = JSON.parse(localStorage.getItem('titan_raw_v4') || '[]');
      inventoryRows = JSON.parse(
        localStorage.getItem('titan_inventory_v1') || '[]'
      );
    } catch {
      rawRows = [];
      inventoryRows = [];
    }

    const name = values.Name.trim();

    // Raw-material table uses the V01 order:
    // Sr no → Brand → Product → UOM → nutrition fields.
    const rawRow = [
      String(rawRows.length + 1), '', name, values.UOM || '', values.DM || '',
      values.CP || '', values.ME || '', values.GE || '', values.EE || '',
      values.CF || '', values.TDN || '', values.NDF || '', values.ADF || '',
      values.Ash || '', values.Ca || '', values.P || '',
    ];

    const inventoryRow = [
      String(inventoryRows.length + 1),
      name,
      values.UOM || 'KG',
      '0',
    ];

    localStorage.setItem(
      'titan_raw_v4',
      JSON.stringify([...rawRows, rawRow])
    );

    localStorage.setItem(
      'titan_inventory_v1',
      JSON.stringify([...inventoryRows, inventoryRow])
    );

    navigate(`${ROUTES.INVENTORY}?tab=inventory`);
  };

  return (
    <>
      <PageHeader
        title="ADD LIVE NUTRITION TABLE"
        subtitle="Add raw product to inventory"
      />

      <form className="standalone nutrition-page" onSubmit={saveMaterial}>
        <div className="formgrid two">
          <label>
            <span>Name</span>
            <input
              required
              value={values.Name || ''}
              onChange={(e) => update('Name', e.target.value)}
              placeholder="Soyabean Meal"
            />
          </label>

          <label>
            <span>UOM</span>
            <select
              required
              value={values.UOM || ''}
              onChange={(e) => update('UOM', e.target.value)}
            >
              <option value="">Select UOM</option>
              <option value="KG">KG</option>
              <option value="Bag">Bag</option>
              <option value="Ton">Ton</option>
            </select>
          </label>
        </div>

        <h3 className="sectiontitle">Formula Standard</h3>

        <div className="formgrid nutrition-grid">
          {fields.map(([label, key]) => (
            <label key={key}>
              <span>{label}</span>
              <input
                value={values[key] || ''}
                onChange={(e) => update(key, e.target.value)}
                placeholder={`Enter ${label}`}
              />
            </label>
          ))}
        </div>

        <input
          ref={pdfInput}
          type="file"
          accept=".pdf"
          hidden
          onChange={(e) => setPdfName(e.target.files?.[0]?.name || '')}
        />

        <div className="nutrition-actions">
          <button type="submit" className="btn orange">
            Add Material
          </button>

          <button
            type="button"
            className="btn green"
            onClick={() => pdfInput.current?.click()}
          >
            Add Report PDF
          </button>

          {pdfName && <span>{pdfName}</span>}
        </div>
      </form>
    </>
  );
}
