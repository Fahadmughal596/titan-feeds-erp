import { Download, Filter, Plus, Search } from 'lucide-react';

export default function Toolbar({
  addLabel,
  onAdd,
  search,
  setSearch,
  searchPlaceholder = 'Search By name',
  extra,
}: {
  addLabel?: string;
  onAdd?: () => void;
  search?: string;
  setSearch?: (v: string) => void;
  searchPlaceholder?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="toolbar">
      <button className="btn green">
        <Download />
        Export
      </button>
      <button className="btn orange">
        <Filter />
        Filter
      </button>

      {setSearch && (
        <label className="search">
          <Search />
          <input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      )}

      <div className="grow" />
      {extra}

      {addLabel && (
        <button className="btn orange" onClick={onAdd}>
          <Plus />
          {addLabel}
        </button>
      )}
    </div>
  );
}
