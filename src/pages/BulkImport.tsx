import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { PageHeader } from '../components/ui';

export default function BulkImport({ title, subtitle }: { title: string; subtitle: string }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <div
        className="drop"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFile(e.dataTransfer.files[0] || null);
        }}
      >
        <UploadCloud />
        <h3>
          Drag &amp; drop files or{' '}
          <label>
            Browse
            <input
              type="file"
              hidden
              accept=".xls,.xlsx,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </h3>
        <p>Supported formats: xls, xlsx, csv</p>
      </div>

      {file && (
        <>
          <h4>Selected file</h4>
          <div className="uploadrow">
            {file.name}
            <span>{(file.size / 1024).toFixed(0)} KB</span>
          </div>
        </>
      )}

      <div className="uploadbuttons">
        <button className="btn orange" disabled={!file}>
          Upload File
        </button>
        <button className="btn green">Download Sample File</button>
      </div>
    </>
  );
}
