import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'var(--bg-surface-hover)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-subtle)',
        };
      case 'danger':
        return {
          background: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          border: '1px solid rgba(248, 113, 113, 0.3)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid transparent',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--accent-primary)',
          border: '1px solid var(--accent-primary)',
        };
      case 'primary':
      default:
        return {
          background: 'var(--accent-primary)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 2px 10px var(--accent-primary-glow)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '0.35rem 0.75rem', fontSize: '0.85rem' };
      case 'lg':
        return { padding: '0.75rem 1.5rem', fontSize: '1.05rem' };
      case 'md':
      default:
        return { padding: '0.55rem 1.1rem', fontSize: '0.95rem' };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        ...getVariantStyles(),
        ...getSizeStyles()
      }}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: '1em', height: '1em', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      ) : null}
      {children}
    </button>
  );
};
