import { useEffect, useMemo, useState } from 'react';
import { DataTable, ModalForm, PageHeader, Toolbar } from '../components/ui';

type Props = {
  title: string;
  headers: string[];
  seed: any[][];
  keyName: string;
  addLabel?: string;
  tabs?: string[];
};

type EditTarget = { values?: Record<string, string>; index?: number };

/** Columns that are generated, not typed by the user. */
const NON_INPUT_HEADERS = ['Sr no.', 'Sr no', 'Actions'];

/**
 * Generic table screen. Rows live in localStorage under `keyName` so edits
 * survive a refresh; swapping that for API calls later only touches this file.
 */
export default function ListPage({ title, headers, seed, keyName, addLabel = 'Add New', tabs }: Props) {
  const columnCount = headers.length;

  const initial = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(keyName) || 'null');
      const usable =
        Array.isArray(stored) &&
        stored.every((row: any) => Array.isArray(row) && row.length === columnCount);
      if (usable) return stored;
    } catch {
      // Ignore unreadable storage and fall back to the seed rows.
    }
    return seed;
  }, [keyName, columnCount, seed]);

  const [rows, setRows] = useState<any[][]>(initial);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<EditTarget | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    localStorage.setItem(keyName, JSON.stringify(rows));
  }, [rows, keyName]);

  const visibleRows = rows.filter((row) =>
    row.join(' ').toLowerCase().includes(search.toLowerCase())
  );
  const fields = headers.filter((h) => !NON_INPUT_HEADERS.includes(h));

  const startEdit = (visibleIndex: number) => {
    const row = visibleRows[visibleIndex];
    const values: Record<string, string> = {};
    fields.forEach((field, i) => {
      values[field] = row[i];
    });
    setEditing({ values, index: rows.indexOf(row) });
  };

  const removeRow = (visibleIndex: number) => {
    const row = visibleRows[visibleIndex];
    setRows(rows.filter((r) => r !== row));
  };

  const save = (values: Record<string, string>) => {
    const asRow = fields.map((field) => values[field]);
    if (editing?.index !== undefined) {
      const next = [...rows];
      next[editing.index] = asRow;
      setRows(next);
    } else {
      setRows([...rows, asRow]);
    }
    setEditing(null);
  };

  return (
    <>
      <PageHeader title={title} />

      {tabs && (
        <div className="tabs">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={i === activeTab ? 'tab active' : 'tab'}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <Toolbar
        addLabel={addLabel}
        onAdd={() => setEditing({})}
        search={search}
        setSearch={setSearch}
      />

      <DataTable headers={headers} rows={visibleRows} onEdit={startEdit} onDelete={removeRow} />

      {editing && (
        <ModalForm
          title={addLabel}
          fields={fields}
          initial={editing.values}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </>
  );
}
