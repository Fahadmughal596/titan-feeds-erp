import { LogOut } from 'lucide-react';

export default function LogoutDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="overlay">
      <div className="confirm-dialog" role="dialog" aria-modal="true">
        <div className="confirm-icon">
          <LogOut />
        </div>
        <h2>Logout from Titan ERP?</h2>
        <p>Your current session will end. You can sign in again at any time.</p>
        <div>
          <button className="btn light" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn orange" onClick={onConfirm}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}
