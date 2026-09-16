import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { PageHeader } from '../components/ui';

type Item = {
  product: string;
  qty: number;
  purchaseRate: number;
};

const nutritionFields = [
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

export default function AddInventory() {
  const navigate = useNavigate();
  const nutritionPanel = useRef<HTMLElement>(null);
  const pdfInput = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState('Batches');
  const [showNutrition, setShowNutrition] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [reference, setReference] = useState('');
  const [references, setReferences] = useState<string[]>([]);
  const [reportName, setReportName] = useState('');

  const [items, setItems] = useState<Item[]>(
    Array.from({ length: 4 }, () => ({
      product: 'Soyabean Meal',
      qty: 500,
      purchaseRate: 50,
    }))
  );

  const [nutrition, setNutrition] = useState<Record<string, string>>({
    Name: '',
    UOM: '',
  });

  useEffect(() => {
    if (showNutrition) {
      nutritionPanel.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [showNutrition]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.qty * item.purchaseRate,
        0
      ),
    [items]
  );

  const weight = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [items]
  );

  const updateItem = (
    index: number,
    key: keyof Item,
    value: string
  ) => {
    setItems((old) =>
      old.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]:
                key === 'product'
                  ? value
                  : Number(value || 0),
            }
          : item
      )
    );
  };

  const addItemRow = () => {
    setItems((old) => [
      ...old,
      {
        product: 'New Material',
        qty: 0,
        purchaseRate: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((old) => old.filter((_, itemIndex) => itemIndex !== index));
  };

  const addReference = () => {
    const value = reference.trim();

    if (!value) return;

    setReferences((old) => [...old, value]);
    setReference('');
  };

  const updateNutrition = (key: string, value: string) => {
    setNutrition((old) => ({
      ...old,
      [key]: value,
    }));
  };

  const addNutritionMaterial = () => {
    const name = nutrition.Name.trim();

    if (!name) {
      alert('Material name required.');
      return;
    }

    setItems((old) => [
      ...old,
      {
        product: name,
        qty: 0,
        purchaseRate: 0,
      },
    ]);

    setShowNutrition(false);
  };

  /* Inventory tab content */
  if (tab === 'Inventory') {
    return (
      <>
        <PageHeader title="ADD INVENTORY" />

        <div className="tabs">
          <button
            type="button"
            className="tab active"
            onClick={() => setTab('Inventory')}
          >
            Inventory
          </button>
          <button
            type="button"
            className="tab"
            onClick={() => setTab('Batches')}
          >
            Batches
          </button>
        </div>

        <h3 className="sectiontitle">Inventory</h3>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Sr no.</th>
                <th>Material</th>
                <th>UOM</th>
                <th>Available QTY</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Soyabean Meal</td>
                <td>KG</td>
                <td>100Kg</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
  return (
    <>
      <PageHeader title="ADD INVENTORY" />

      <div className="tabs">
        {['Inventory', 'Batches'].map((value) => (
          <button
            type="button"
            key={value}
            className={tab === value ? 'tab active' : 'tab'}
            onClick={() => setTab(value)}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="toolbar inventory-add-toolbar"><div className="grow" /><button type="button" className="btn gray" onClick={() => navigate(ROUTES.INVENTORY_IMPORT)}><Upload />Import File</button></div>

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
            <option>PO#002</option>
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

            <button
              type="button"
              className="btn cyan"
              onClick={() => setReferenceOpen((old) => !old)}
            >
              Add References
            </button>
          </div>
        </label>
      </div>

      {referenceOpen && (
        <div className="reference-panel">
          <strong>Add References</strong>

          <div className="inline">
            <input
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Enter reference"
            />

            <button
              type="button"
              className="btn cyan"
              onClick={addReference}
            >
              Add Reference
            </button>
          </div>

          {references.map((value, index) => (
            <div className="reference-item" key={`${value}-${index}`}>
              {index + 1}. {value}
            </div>
          ))}
        </div>
      )}

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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>

                <td>
                  <input
                    value={item.product}
                    onChange={(event) =>
                      updateItem(index, 'product', event.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(event) =>
                      updateItem(index, 'qty', event.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.purchaseRate}
                    onChange={(event) =>
                      updateItem(
                        index,
                        'purchaseRate',
                        event.target.value
                      )
                    }
                  />
                </td>

                <td>
                  {(item.qty * item.purchaseRate).toLocaleString()}
                </td>

                <td className="table-actions">
                  <button
                    type="button"
                    className="table-action delete"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={6}>
                <button
                  type="button"
                  className="plainadd"
                  onClick={addItemRow}
                >
                  <PlusCircle />
                  Add item row
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showNutrition && (
        <section ref={nutritionPanel} className="nutrition-panel">
          <div className="nutrition-panel-head">
            <div>
              <h2>Add Live Nutrition Table</h2>
              <p>Add raw product to inventory</p>
            </div>

            <button
              type="button"
              className="nutrition-close"
              onClick={() => setShowNutrition(false)}
            >
              Ãƒâ€”
            </button>
          </div>

          <div className="formgrid two">
            <label>
              <span>Name</span>
              <input
                value={nutrition.Name || ''}
                onChange={(event) =>
                  updateNutrition('Name', event.target.value)
                }
                placeholder="Soyabean Meal"
              />
            </label>

            <label>
              <span>UOM</span>
              <select
                value={nutrition.UOM || ''}
                onChange={(event) =>
                  updateNutrition('UOM', event.target.value)
                }
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
            {nutritionFields.map(([label, key]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  value={nutrition[key] || ''}
                  onChange={(event) =>
                    updateNutrition(key, event.target.value)
                  }
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
            onChange={(event) =>
              setReportName(event.target.files?.[0]?.name || '')
            }
          />

          <div className="nutrition-actions">
            <button
              type="button"
              className="btn orange"
              onClick={addNutritionMaterial}
            >
              Add Material
            </button>

            <button
              type="button"
              className="btn green"
              onClick={() => pdfInput.current?.click()}
            >
              Add Report PDF
            </button>

            {reportName && <span>{reportName}</span>}
          </div>
        </section>
      )}

      <div className="totals">
        <div>
          <b>Total weight</b>
          <span>{weight}Kg</span>
        </div>

        <div>
          <b>Grand Total</b>
          <span>{total.toLocaleString()}PKR</span>
        </div>
      </div>

      <button
        type="button"
        className="btn orange savebtn"
        onClick={() => navigate(ROUTES.INVENTORY_ADD_MATERIAL)}
      >
        Add Material
      </button>
    </>
  );
}
