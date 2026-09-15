import { Pencil, Trash2 } from 'lucide-react';

type Props = {
  headers: string[];
  rows: any[][];
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
};

function statusClass(value: unknown) {
  const text = String(value ?? '').toLowerCase();

  if (text.includes('active') || text === 'paid') return 'is-active';
  if (text.includes('partial')) return 'is-partial';
  if (text.includes('unpaid') || text.includes('inactive')) return 'is-danger';

  return '';
}

export default function DataTable({ headers, rows, onEdit, onDelete }: Props) {
  const hasActions = Boolean(onEdit || onDelete);
  const hasActionHeader = headers.some(
    (header) => header.trim().toLowerCase() === 'actions'
  );

  const totalColumns = headers.length + (hasActions && !hasActionHeader ? 1 : 0);

  return (
    <div className="tablewrap">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
            {hasActions && !hasActionHeader && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={totalColumns} className="table-empty">
                No records found
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row.join('|')}`}>
                {headers.map((header, columnIndex) => {
                  const isActions =
                    header.trim().toLowerCase() === 'actions';

                  if (isActions) {
                    return (
                      <td key={`${header}-${columnIndex}`} className="table-actions">
                        {onEdit && (
                          <button
                            type="button"
                            className="table-action edit"
                            aria-label="Edit"
                            title="Edit"
                            onClick={() => onEdit(rowIndex)}
                          >
                            <Pencil size={15} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="table-action delete"
                            aria-label="Delete"
                            title="Delete"
                            onClick={() => onDelete(rowIndex)}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    );
                  }

                  const value = row[columnIndex];
                  const badge = statusClass(value);

                  return (
                    <td key={`${header}-${columnIndex}`}>
                      {badge ? (
                        <span className={`status-pill ${badge}`}>
                          {String(value)}
                        </span>
                      ) : (
                        String(value ?? '—')
                      )}
                    </td>
                  );
                })}

                {hasActions && !hasActionHeader && (
                  <td className="table-actions">
                    {onEdit && (
                      <button
                        type="button"
                        className="table-action edit"
                        aria-label="Edit"
                        title="Edit"
                        onClick={() => onEdit(rowIndex)}
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="table-action delete"
                        aria-label="Delete"
                        title="Delete"
                        onClick={() => onDelete(rowIndex)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}