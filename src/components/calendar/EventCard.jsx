import React from 'react';
import { Badge } from '../ui/Badge';
import { safeToDate, formatDisplayTime, getProjectUrgency } from '../../utils/dateHelpers';
import { Repeat, Clock, CheckCircle2, Circle } from 'lucide-react';

export const EventCard = ({
  event,
  onClick,
  onToggleComplete,
  compact = false,
  variant = 'grid' // 'grid' | 'timeline'
}) => {
  const start = safeToDate(event.startDateTime);
  const end = safeToDate(event.endDateTime);
  const urgency = event.type === 'project' ? getProjectUrgency(event.endDateTime) : 'normal';

  const getBorderColor = () => {
    if (event.completed) return 'var(--color-success)';
    if (urgency === 'urgent') return 'var(--color-danger)';
    if (urgency === 'warning') return 'var(--color-warning)';
    switch (event.type) {
      case 'gym': return 'var(--cat-gym)';
      case 'reminder': return 'var(--cat-reminder)';
      case 'project': return 'var(--cat-project)';
      case 'custom': return 'var(--cat-custom)';
      case 'task':
      default: return 'var(--cat-task)';
    }
  };

  const getBgColor = () => {
    if (event.completed) return 'rgba(110, 231, 183, 0.08)';
    switch (event.type) {
      case 'gym': return 'var(--cat-gym-bg)';
      case 'reminder': return 'var(--cat-reminder-bg)';
      case 'project': return 'var(--cat-project-bg)';
      case 'custom': return 'var(--cat-custom-bg)';
      case 'task':
      default: return 'var(--cat-task-bg)';
    }
  };

  if (variant === 'timeline') {
    return (
      <div
        onClick={() => onClick(event)}
        style={{
          width: '100%',
          backgroundColor: getBgColor(),
          borderLeft: `4px solid ${getBorderColor()}`,
          borderTop: '1px solid var(--border-subtle)',
          borderRight: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.85rem',
          opacity: event.completed ? 0.65 : 1,
          boxShadow: 'var(--shadow-sm)',
          transition: 'transform var(--transition-fast)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
          {onToggleComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(event);
              }}
              style={{
                color: event.completed ? 'var(--color-success)' : 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              title={event.completed ? 'Marcar pendiente' : 'Marcar completado'}
            >
              {event.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                textDecoration: event.completed ? 'line-through' : 'none'
              }}>
                {event.title}
              </span>
              {event.isRecurring && (
                <Repeat size={13} style={{ color: 'var(--cat-gym)' }} title="Recurrente semanal" />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={13} />
                {formatDisplayTime(start)} - {formatDisplayTime(end)}
              </span>
              {event.description && (
                <span className="truncate" style={{ maxWidth: '180px', color: 'var(--text-dim)' }}>
                  — {event.description}
                </span>
              )}
            </div>
          </div>
        </div>

        <Badge type={event.type} size="sm" />
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(event)}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: getBgColor(),
        borderLeft: `3px solid ${getBorderColor()}`,
        borderRadius: 'var(--radius-sm)',
        padding: compact ? '0.3rem 0.45rem' : '0.45rem 0.65rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        opacity: event.completed ? 0.65 : 1,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.25rem' }}>
        <span style={{
          fontSize: compact ? '0.78rem' : '0.88rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          textDecoration: event.completed ? 'line-through' : 'none',
          lineHeight: 1.25
        }} className="truncate">
          {event.title}
        </span>

        {event.isRecurring && (
          <Repeat size={12} style={{ color: 'var(--cat-gym)', flexShrink: 0 }} title="Horario recurrente" />
        )}
      </div>

      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {formatDisplayTime(start)} - {formatDisplayTime(end)}
          </span>
          
          <Badge type={event.type} size="sm" showIcon={false} />
        </div>
      )}
    </div>
  );
};
