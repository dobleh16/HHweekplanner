import React from 'react';
import { Bell, X, CheckSquare, Dumbbell, Folder, Tag } from 'lucide-react';

const getTypeIcon = (type) => {
  switch (type) {
    case 'gym': return Dumbbell;
    case 'project': return Folder;
    case 'task': return CheckSquare;
    case 'custom': return Tag;
    case 'reminder':
    default: return Bell;
  }
};

export const NotificationToastManager = ({ toasts = [], onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => {
        const Icon = getTypeIcon(toast.type);

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              flexShrink: 0
            }}>
              <Icon size={20} />
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {toast.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                color: 'var(--text-muted)',
                padding: '0.2rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
