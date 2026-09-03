import React from 'react';

export const SummaryCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'var(--accent-primary)',
  bgColor = 'var(--accent-primary-glow)'
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)',
      transition: 'transform var(--transition-fast)'
    }}>
      <div>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          {title}
        </span>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.2rem 0' }}>
          {value}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {Icon && (
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: bgColor,
          border: `1px solid ${color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          flexShrink: 0
        }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};
