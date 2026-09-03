import React from 'react';
import { safeToDate, formatDisplayTime, isToday } from '../../utils/dateHelpers';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Circle, Clock, CalendarDays } from 'lucide-react';

export const TodayEvents = ({
  events = [],
  onSelectEvent,
  onToggleComplete
}) => {
  // Filter today's events sorted by computedStart
  const todayList = events.filter((evt) => {
    const start = safeToDate(evt.computedStart || evt.startDateTime);
    return isToday(start);
  }).sort((a, b) => {
    const startA = safeToDate(a.computedStart || a.startDateTime);
    const startB = safeToDate(b.computedStart || b.startDateTime);
    return startA - startB;
  });

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarDays size={18} style={{ color: 'var(--accent-primary)' }} />
          Agenda para Hoy
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-base)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
          {todayList.length} eventos
        </span>
      </div>

      {todayList.length === 0 ? (
        <div style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-base)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <Clock size={28} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.9rem' }}>No tienes eventos agendados para el día de hoy.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>¡Disfruta tu día libre o agrega uno nuevo!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {todayList.map((evt) => {
            const start = safeToDate(evt.computedStart || evt.startDateTime);
            const end = safeToDate(evt.computedEnd || evt.endDateTime);

            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-base)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast)',
                  opacity: evt.completed ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(evt);
                    }}
                    style={{
                      color: evt.completed ? 'var(--color-success)' : 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    title={evt.completed ? 'Marcar pendiente' : 'Marcar completado'}
                  >
                    {evt.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: 'var(--text-main)',
                      textDecoration: evt.completed ? 'line-through' : 'none'
                    }}>
                      {evt.title}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {formatDisplayTime(start)} - {formatDisplayTime(end)}
                    </span>
                  </div>
                </div>

                <Badge type={evt.type} size="sm" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
