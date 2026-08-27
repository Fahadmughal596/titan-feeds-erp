import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';

/** Fields rendered as a textarea rather than a single-line input. */
const MULTILINE = ['Address', 'Description'];

export default function SimpleForm({
  title,
  subtitle,
  fields,
  button = 'Save',
  backTo,
}: {
  title: string;
  subtitle: string;
  fields: string[];
  button?: string;
  backTo?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const set = (field: string, value: string) => setValues((v) => ({ ...v, [field]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('lastForm', JSON.stringify(values));
    if (backTo) navigate(backTo);
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <form className="standalone formgrid two" onSubmit={submit}>
        {fields.map((field) => {
          const multiline = MULTILINE.includes(field);
          return (
            <label key={field} className={multiline ? 'full' : ''}>
              <span>{field}</span>
              {multiline ? (
                <textarea
                  value={values[field] || ''}
                  onChange={(e) => set(field, e.target.value)}
                  placeholder={'Enter ' + field}
                />
              ) : (
                <input
                  required
                  value={values[field] || ''}
                  onChange={(e) => set(field, e.target.value)}
                  placeholder={'Enter ' + field}
                />
              )}
            </label>
          );
        })}

        <button className="btn orange formsubmit">{button}</button>
      </form>
    </>
  );
}
