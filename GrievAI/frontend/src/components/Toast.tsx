import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div className="toast-notification">
      <CheckCircle2 size={18} color="#10b981" />
      <span style={{ fontSize: '13.5px', fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          marginLeft: '8px',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
