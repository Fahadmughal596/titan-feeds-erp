import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';
import { LIST_PAGES } from '../routes/pageConfig';
import ListPage from './ListPage';

type InventoryRow = string[];

function readInventoryRows(): InventoryRow[] {
  try {
    const stored = JSON.parse(
      localStorage.getItem('titan_inventory_v1') || '[]'
    );

    if (!Array.isArray(stored)) return [];

    return stored.filter(
      (row: unknown) => Array.isArray(row) && row.length >= 4
    );
  } catch {
    return [];
  }
}

export default function InventoryPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [rows, setRows] = useState<InventoryRow[]>([]);

  const activeTab =
    params.get('tab') === 'batches' ? 'batches' : 'inventory';

  useEffect(() => {
    setRows(readInventoryRows());
  }, [activeTab]);

  const batchConfig = LIST_PAGES.find(
    (page) => page.path === ROUTES.INVENTORY
  );

  if (activeTab === 'batches' && batchConfig) {
    return (
      <>
        <div className="tabs">
          <button
            type="button"
            className="tab"
            onClick={() => setParams({})}
          >
            Inventory
          </button>

          <button type="button" className="tab active">
            Batches
          </button>
        </div>

        <ListPage
          key="inventory-batches"
          title="Batches"
          headers={batchConfig.headers}
          seed={batchConfig.seed}
          keyName={batchConfig.keyName}
          addLabel="Add Inventory"
        />
      </>
    );
  }

  return (
    <>
      <div className="tabs">
        <button type="button" className="tab active">
          Inventory
        </button>

        <button
          type="button"
          className="tab"
          onClick={() => setParams({ tab: 'batches' })}
        >
          Batches
        </button>
      </div>

      <PageHeader title="Inventory" />

      <div className="toolbar">
        <div className="grow" />

        <button
          type="button"
          className="btn orange"
          onClick={() => navigate(ROUTES.INVENTORY_ADD)}
        >
          Add Inventory
        </button>
      </div>

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Material</th>
              <th>UOM</th>
              <th>Available Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty">
                  No stock records available.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={`${row[0]}-${index}`}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td className="table-actions">⋮</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}