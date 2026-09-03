import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label 
          htmlFor={inputId}
          style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <Icon size={18} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          style={{
            width: '100%',
            padding: Icon ? '0.6rem 0.85rem 0.6rem 2.5rem' : '0.6rem 0.85rem',
            backgroundColor: 'var(--bg-base)',
            border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: '0.95rem',
            transition: 'border-color var(--transition-fast)'
          }}
          className={className}
          {...props}
        />
      </div>
      {error ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{helperText}</span>
      ) : null}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  helperText,
  rows = 3,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label 
          htmlFor={inputId}
          style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        style={{
          width: '100%',
          padding: '0.6rem 0.85rem',
          backgroundColor: 'var(--bg-base)',
          border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-main)',
          outline: 'none',
          fontSize: '0.95rem',
          resize: 'vertical',
          transition: 'border-color var(--transition-fast)'
        }}
        {...props}
      />
      {error ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{helperText}</span>
      ) : null}
    </div>
  );
};
