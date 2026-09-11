import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

const fields = [
  ['DM %', 'DM'],
  ['CP %', 'CP'],
  ['ME (Mcal/Kg)', 'ME'],
  ['GE (Mcal/Kg)', 'GE'],
  ['EE %', 'EE'],
  ['CF %', 'CF'],
  ['TDN %', 'TDN'],
  ['NDF %', 'NDF'],
  ['ADF %', 'ADF'],
  ['Ash %', 'Ash'],
  ['Ca %', 'Ca'],
  ['P %', 'P'],
] as const;

export default function AddRawMaterial() {
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<string, string>>({
    Name: '',
    UOM: '',
  });

  const update = (key: string, value: string) => {
    setValues((old) => ({ ...old, [key]: value }));
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();

    let rows: any[][] = [];

    try {
      const stored = JSON.parse(
        localStorage.getItem('titan_raw_v4') || '[]'
      );
      rows = Array.isArray(stored) ? stored : [];
    } catch {
      rows = [];
    }

    const newRow = [
      String(rows.length + 1),
      values.Name || '',
      values.UOM || '',
      values.DM || '',
      values.CP || '',
      values.ME || '',
      values.GE || '',
      values.EE || '',
      values.CF || '',
      values.TDN || '',
      values.NDF || '',
      values.ADF || '',
      values.Ash || '',
      values.Ca || '',
      values.P || '',
    ];

    localStorage.setItem(
      'titan_raw_v4',
      JSON.stringify([...rows, newRow])
    );

    navigate(ROUTES.RAW_MATERIAL);
  };

  return (
    <>
      <PageHeader title="ADD RAW MATERIAL" />

      <div className="raw-page-actions">
        <button
          type="button"
          className="btn orange"
          onClick={() => navigate(ROUTES.RAW_MATERIAL)}
        >
          List
        </button>

        <button
          type="button"
          className="btn green"
          onClick={() => navigate(ROUTES.RAW_MATERIAL_IMPORT)}
        >
          Bulk Import
        </button>
      </div>

      <form className="standalone raw-material-page" onSubmit={save}>
        <div className="formgrid two">
          <label>
            <span>Name</span>
            <input
              required
              value={values.Name || ''}
              onChange={(e) => update('Name', e.target.value)}
              placeholder="Enter Name Of Material"
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

        <button type="submit" className="btn orange raw-save">
          Add Material
        </button>
      </form>
    </>
  );
}