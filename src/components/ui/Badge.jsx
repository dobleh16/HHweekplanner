import React from 'react';
import { Dumbbell, CheckSquare, Bell, Folder, Tag } from 'lucide-react';

export const eventTypeConfig = {
  gym: {
    label: 'Gym / Horario Fijo',
    color: 'var(--cat-gym)',
    bg: 'var(--cat-gym-bg)',
    icon: Dumbbell
  },
  task: {
    label: 'Tarea',
    color: 'var(--cat-task)',
    bg: 'var(--cat-task-bg)',
    icon: CheckSquare
  },
  reminder: {
    label: 'Recordatorio',
    color: 'var(--cat-reminder)',
    bg: 'var(--cat-reminder-bg)',
    icon: Bell
  },
  project: {
    label: 'Entrega Proyecto',
    color: 'var(--cat-project)',
    bg: 'var(--cat-project-bg)',
    icon: Folder
  },
  custom: {
    label: 'Personalizado',
    color: 'var(--cat-custom)',
    bg: 'var(--cat-custom-bg)',
    icon: Tag
  }
};

export const Badge = ({
  type = 'task',
  label,
  showIcon = true,
  size = 'md'
}) => {
  const config = eventTypeConfig[type] || eventTypeConfig.custom;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const sizeStyles = size === 'sm' 
    ? { padding: '0.2rem 0.5rem', fontSize: '0.75rem' } 
    : { padding: '0.3rem 0.7rem', fontSize: '0.85rem' };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      borderRadius: 'var(--radius-full)',
      color: config.color,
      backgroundColor: config.bg,
      border: `1px solid ${config.color}33`,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      ...sizeStyles
    }}>
      {showIcon && Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      {displayLabel}
    </span>
  );
};
