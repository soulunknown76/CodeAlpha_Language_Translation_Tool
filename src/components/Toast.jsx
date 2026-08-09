import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--success-color)' }} />}
          {toast.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--danger-color)' }} />}
          {toast.type === 'info' && <Info size={18} style={{ color: 'var(--accent-secondary)' }} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
