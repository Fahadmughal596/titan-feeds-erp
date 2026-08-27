import { useState } from 'react';

export default function ModalForm({
  title,
  fields,
  onClose,
  onSave,
  initial,
}: {
  title: string;
  fields: string[];
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  initial?: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial || {});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <div className="overlay">
      <form className="modal" onSubmit={submit}>
        <div className="modalhead">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="formgrid">
          {fields.map((field) => (
            <label key={field}>
              <span>{field}</span>
              <input
                required
                value={values[field] || ''}
                onChange={(e) => setValues({ ...values, [field]: e.target.value })}
                placeholder={'Enter ' + field}
              />
            </label>
          ))}
        </div>

        <div className="modalactions">
          <button type="button" className="btn gray" onClick={onClose}>
            Cancel
          </button>
          <button className="btn orange">Save</button>
        </div>
      </form>
    </div>
  );
}
