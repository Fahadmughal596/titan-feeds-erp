import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Apple, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/ui';
import { readFeedChoices } from '../utils/catalog';

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

  const [showNutrition, setShowNutrition] = useState(false);
  const [reportName, setReportName] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [supplier, setSupplier] = useState('');
  const productChoices = useMemo(() => {
    const choices = readFeedChoices();
    return choices.length ? choices : [{ name: 'Soyabean Meal' }];
  }, []);

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

  return (
    <>
      <PageHeader title="ADD INVENTORY" />

      <div className="formgrid two">
        <label>
          <span>Type Of Raw Material</span>
          <select value={materialType} onChange={(event) => setMaterialType(event.target.value)}>
            <option value="">Select Material</option>
            <option>Raw Material</option>
            <option>Finished Goods</option>
          </select>
        </label>

        <label>
          <span>PO</span>
          <input placeholder="Enter PO Number" />
        </label>

        <label>
          <span>Batch Number</span>
          <input placeholder="Enter Batch Number" />
        </label>

        <label>
          <span>Name Of Batch</span>
          <input placeholder="Enter Name Of Batch" />
        </label>

        <label>
          <span>Supplier</span>
          <select value={supplier} onChange={(event) => setSupplier(event.target.value)}>
            <option value="">Select Supplier</option>
            <option>All Supplier</option>
            <option>Supplier 1</option>
            <option>Supplier 2</option>
          </select>
        </label>
      </div>

      <h3 className="sectiontitle">Item Detail</h3>

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Product</th>
              <th>QTY</th>
              <th>Purchase</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>

                <td>
                  <select
                    id={`inventory-product-${index}`}
                    value={item.product}
                    onChange={(event) => updateItem(index, 'product', event.target.value)}
                  >
                    <option value="">Select Product</option>
                    {productChoices.map((choice) => <option key={`${choice.brand || ''}-${choice.name}-${choice.variant || ''}`} value={choice.name}>{choice.name}{choice.variant ? ` ${choice.variant}` : ''}</option>)}
                  </select>
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
                    aria-label="Delete item"
                    title="Delete item"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-button edit-action"
                    aria-label="Edit item"
                    title="Edit item"
                    onClick={() => document.getElementById(`inventory-product-${index}`)?.focus()}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-button nutrition-action"
                    aria-label="Open nutrition table"
                    title={materialType === 'Raw Material' ? 'Open nutrition table' : 'Select Raw Material to enable nutrition'}
                    disabled={materialType !== 'Raw Material'}
                    onClick={() => navigate(ROUTES.INVENTORY_ADD_MATERIAL)}
                  >
                    <Apple size={15} />
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
              className="btn orange material-action"
              onClick={addNutritionMaterial}
            >
              <Apple size={15} />
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
