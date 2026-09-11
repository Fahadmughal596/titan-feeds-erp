import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import type { ListPageConfig } from '../routes/pageConfig';

type Props = {
  config: ListPageConfig;
  mode: 'add' | 'edit';
};

const isSerial = (header: string) =>
  /^sr\s*no\.?$/i.test(header.trim());

function readRows(config: ListPageConfig): any[][] {
  const raw = localStorage.getItem(config.keyName);
  if (!raw) return config.seed;

  const parsed = JSON.parse(raw);
  if (
    !Array.isArray(parsed) ||
    !parsed.every(row =>
      Array.isArray(row) && row.length === config.headers.length
    )
  ) {
    throw new Error('Saved table data needs repair before editing.');
  }

  return parsed;
}

export default function RecordPage({ config, mode }: Props) {
  const navigate = useNavigate();
  const { rowId } = useParams();

  const [source] = useState(() => {
    try {
      return { rows: readRows(config), error: '' };
    } catch {
      return {
        rows: [] as any[][],
        error: 'Saved data could not be loaded. Return to the list; your data has not been changed.',
      };
    }
  });

  const index =
    rowId !== undefined && /^\d+$/.test(rowId)
      ? Number(rowId)
      : -1;

  const original = mode === 'edit' ? source.rows[index] : undefined;
  const fields = config.headers.filter(
    header => !isSerial(header) && header !== 'Actions'
  );

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map(field => [
        field,
        original ? String(original[config.headers.indexOf(field)] ?? '') : '',
      ])
    )
  );
  const [error, setError] = useState('');

  const invalid = source.error ||
    (mode === 'edit' && !original ? 'This record was not found.' : '');

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const current = readRows(config);

      if (JSON.stringify(current) !== JSON.stringify(source.rows)) {
        setError('The list changed while this page was open. Return to the list and reopen the form.');
        return;
      }

      const nextSerial = Math.max(
        0,
        ...current.map(row => {
          const serialIndex = config.headers.findIndex(isSerial);
          return serialIndex < 0 ? 0 : Number(row[serialIndex]) || 0;
        })
      ) + 1;

      const nextRow = config.headers.map((header, column) => {
        if (isSerial(header)) {
          return original ? original[column] : String(nextSerial);
        }
        if (header === 'Actions') return '';
        return (values[header] || '').trim();
      });

      const next = [...current];
      if (mode === 'edit') next[index] = nextRow;
      else next.push(nextRow);

      localStorage.setItem(config.keyName, JSON.stringify(next));
      navigate(config.path);
    } catch {
      setError('Could not save this record. Your existing data has not been cleared.');
    }
  };

  return (
    <>
      <PageHeader
        title={mode === 'edit' ? `Edit ${config.title}` : config.addLabel || `Add ${config.title}`}
      />

      <button
        type="button"
        className="btn gray"
        onClick={() => navigate(config.path)}
      >
        Back to list
      </button>

      {invalid ? (
        <p role="alert">{invalid}</p>
      ) : (
        <form
          className="standalone formgrid two"
          style={{ marginTop: 24 }}
          onSubmit={save}
        >
          {fields.map(field => (
            <label key={field}>
              <span>{field}</span>
              <input
                required
                value={values[field] || ''}
                placeholder={`Enter ${field}`}
                onChange={event =>
                  setValues(previous => ({
                    ...previous,
                    [field]: event.target.value,
                  }))
                }
              />
            </label>
          ))}

          {error && <p className="full" role="alert">{error}</p>}

          <div className="full">
            <button type="submit" className="btn orange">
              {mode === 'edit' ? 'Save Changes' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </>
  );
}