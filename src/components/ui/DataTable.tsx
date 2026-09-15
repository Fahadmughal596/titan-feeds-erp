import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function DataTable({
  headers,
  rows,
  onDelete,
  onEdit,
  onView,
  emptyLabel = 'No records found.',
}: {
  headers: string[];
  rows: any[][];
  onDelete?: (i: number) => void;
  onEdit?: (i: number) => void;
  onView?: (i: number) => void;
  emptyLabel?: string;
}) {
  const hasActions = Boolean(onDelete || onEdit || onView);

  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length + (hasActions ? 1 : 0)}>{emptyLabel}</td>
            </tr>
          )}

          {rows.map((row, i) => (
            <tr key={i}>
              {row.slice(0, headers.length).map((cell, j) => (
                <td key={j}>
                  {String(cell).includes('Paid') ? <span className="status">{cell}</span> : cell}
                </td>
              ))}

              {hasActions && (
                <td>
                  <div className="icons">
                    {onView && (
                      <button onClick={() => onView(i)} aria-label="View">
                        <Eye />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(i)} aria-label="Edit">
                        <Pencil />
                      </button>
                    )}
                    {onDelete && (
                      <button className="danger" onClick={() => onDelete(i)} aria-label="Delete">
                        <Trash2 />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
