import { Download, Filter, Plus, Search, Upload } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const IMPORT_ROUTES: Record<string, string> = {
  '/raw-material': '/raw-material/bulk-import',
  '/inventory': '/inventory/bulk-import',
  '/invoices': '/invoices/bulk-import',
};

export default function Toolbar({
  addLabel,
  onAdd,
  onExport,
  search,
  setSearch,
  searchPlaceholder = 'Search By name',
  extra,
}: {
  addLabel?: string;
  onAdd?: () => void;
  onExport?: () => void;
  search?: string;
  setSearch?: (v: string) => void;
  searchPlaceholder?: string;
  extra?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const importRoute = IMPORT_ROUTES[location.pathname];

  return (
    <div className="toolbar">
      <button type="button" className="btn green" onClick={onExport}>
        <Download />
        Export
      </button>

      <button type="button" className="btn orange">
        <Filter />
        Filter
      </button>

      {setSearch && (
        <label className="search">
          <Search />
          <input
            placeholder={searchPlaceholder}
            value={search || ''}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      )}

      <div className="grow" />
      {extra}

      {importRoute && (
        <button
          type="button"
          className="btn cyan"
          onClick={() => navigate(importRoute)}
        >
          <Upload />
          Bulk Import
        </button>
      )}

      {addLabel && (
        <button type="button" className="btn orange" onClick={onAdd}>
          <Plus />
          {addLabel}
        </button>
      )}
    </div>
  );
}