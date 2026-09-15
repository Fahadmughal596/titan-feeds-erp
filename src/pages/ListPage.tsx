import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, ModalForm, PageHeader, Toolbar } from '../components/ui';
import { ROUTES } from '../constants';

type Props = {
  title: string;
  headers: string[];
  seed: any[][];
  keyName: string;
  addLabel?: string;
  tabs?: string[];
};

type EditTarget = {
  values?: Record<string, string>;
  index?: number;
};

const GENERATED_HEADERS = ['Sr no.', 'Sr no', 'Actions'];

function exportCsv(title: string, headers: string[], rows: any[][]) {
  const escape = (value: unknown) => {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ListPage({
  title,
  headers,
  seed,
  keyName,
  addLabel = 'Add New',
  tabs,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<EditTarget | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const initial = useMemo(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(keyName) || 'null');

      if (
        Array.isArray(stored) &&
        stored.every((row: any) => Array.isArray(row))
      ) {
        return stored;
      }
    } catch {
      // Use seed data
    }

    return seed;
  }, [keyName, seed]);

  const [rows, setRows] = useState<any[][]>(initial);

  useEffect(() => {
    localStorage.setItem(keyName, JSON.stringify(rows));
  }, [keyName, rows]);

  const visibleRows = rows.filter((row) =>
    row.join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const fields = headers.filter(
    (header) => !GENERATED_HEADERS.includes(header)
  );

  const startEdit = (visibleIndex: number) => {
    const row = visibleRows[visibleIndex];
    const values: Record<string, string> = {};

    fields.forEach((field) => {
      const columnIndex = headers.indexOf(field);
      values[field] = String(row[columnIndex] ?? '');
    });

    setEditing({
      values,
      index: rows.indexOf(row),
    });
  };

  const removeRow = (visibleIndex: number) => {
    const row = visibleRows[visibleIndex];
    setRows((previous) => previous.filter((item) => item !== row));
  };

  const save = (values: Record<string, string>) => {
    const newRow = headers.map((header, index) => {
      if (GENERATED_HEADERS.includes(header)) {
        if (header.toLowerCase().startsWith('sr')) {
          return editing?.index !== undefined
            ? rows[editing.index]?.[index] || String(editing.index + 1)
            : String(rows.length + 1);
        }

        return '';
      }

      return values[header] || '';
    });

    if (editing?.index !== undefined) {
      const next = [...rows];
      next[editing.index] = newRow;
      setRows(next);
    } else {
      setRows((previous) => [...previous, newRow]);
    }

    setEditing(null);
  };

  return (
    <>
      <PageHeader title={title} />

      {tabs && (
        <div className="tabs">
          {tabs.map((tab, index) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(index)}
              className={index === activeTab ? 'tab active' : 'tab'}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <Toolbar
        addLabel={addLabel}
        onExport={() => exportCsv(title, headers, visibleRows)}
        onAdd={() => {
          if (location.pathname === ROUTES.INVENTORY) {
            navigate(ROUTES.INVENTORY_ADD);
          } else if (location.pathname === ROUTES.RAW_MATERIAL) {
            navigate(ROUTES.RAW_MATERIAL_ADD);
          } else {
            setEditing({});
          }
        }}
        search={search}
        setSearch={setSearch}
      />

      <DataTable
        headers={headers}
        rows={visibleRows}
        onEdit={startEdit}
        onDelete={removeRow}
      />

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