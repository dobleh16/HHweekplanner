import React from 'react';

export const Select = ({
  label,
  options = [],
  error,
  helperText,
  id,
  className = '',
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
      <select
        id={inputId}
        style={{
          width: '100%',
          padding: '0.6rem 0.85rem',
          backgroundColor: 'var(--bg-base)',
          border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-main)',
          outline: 'none',
          fontSize: '0.95rem',
          cursor: 'pointer',
          transition: 'border-color var(--transition-fast)'
        }}
        className={className}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{helperText}</span>
      ) : null}
    </div>
  );
};
