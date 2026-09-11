import { useState } from 'react';
import { Download, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui';
import { ROUTES } from '../constants';

function storageKey(title: string) {
  if (title.toLowerCase().includes('raw')) return 'titan_raw_v4';
  if (title.toLowerCase().includes('batch')) return 'titan_batches_v4';
  return 'invoices';
}

function parseCsv(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .split(',')
        .map((cell) => cell.trim().replace(/^"|"$/g, ''))
    );
}

export default function BulkImport({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const key = storageKey(title);

  const uploadFile = () => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setMessage('Abhi CSV upload active hai. XLS/XLSX parser API phase me connect hoga.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const rows = parseCsv(String(reader.result || ''));

      let existing: any[][] = [];

      try {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        existing = Array.isArray(stored) ? stored : [];
      } catch {
        existing = [];
      }

      localStorage.setItem(
        key,
        JSON.stringify([...existing, ...rows])
      );

      setMessage(`${rows.length} rows successfully imported.`);
    };

    reader.readAsText(file);
  };

  const downloadSample = () => {
    const headers = title.toLowerCase().includes('raw')
      ? ['Sr no.', 'Name', 'UOM', 'DM %', 'CP %', 'ME', 'GE', 'EE %', 'CF %', 'TDN %', 'NDF %']
      : title.toLowerCase().includes('batch')
        ? ['Date', 'Batch number', 'Batch Name', 'PO', 'Items', 'Total Amount', 'Paid', 'Unpaid', 'Status']
        : ['Invoice No', 'Date', 'Client', 'Items', 'Total Amount', 'Paid', 'Unpaid', 'Status'];

    const blob = new Blob([headers.join(',') + '\r\n'], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-sample.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />

      <div
        className="drop"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setFile(event.dataTransfer.files[0] || null);
          setMessage('');
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
              accept=".csv,.xls,.xlsx"
              onChange={(event) => {
                setFile(event.target.files?.[0] || null);
                setMessage('');
              }}
            />
          </label>
        </h3>

        <p>Supported formats: CSV, XLS, XLSX</p>
      </div>

      {file && (
        <>
          <h4>Selected file</h4>

          <div className="uploadrow">
            <span>{file.name}</span>
            <span>{(file.size / 1024).toFixed(0)} KB</span>
          </div>
        </>
      )}

      {message && <div className="upload-message">{message}</div>}

      <div className="uploadbuttons">
        <button
          type="button"
          className="btn orange"
          disabled={!file}
          onClick={uploadFile}
        >
          Upload File
        </button>

        <button
          type="button"
          className="btn green"
          onClick={downloadSample}
        >
          <Download />
          Download Sample File
        </button>

        <button
          type="button"
          className="btn gray"
          onClick={() => navigate(ROUTES.RAW_MATERIAL)}
        >
          Back
        </button>
      </div>
    </>
  );
}