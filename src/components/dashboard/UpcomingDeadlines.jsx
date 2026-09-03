import React from 'react';
import { safeToDate, formatFullDateTime, getProjectUrgency, getFormattedHoursLeft } from '../../utils/dateHelpers';
import { Folder, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

export const UpcomingDeadlines = ({
  events = [],
  onSelectEvent
}) => {
  // Filter type: "project" events, not completed, sorted by deadline date
  const projects = events
    .filter((evt) => evt.type === 'project' && !evt.completed)
    .sort((a, b) => {
      const dateA = safeToDate(a.endDateTime || a.startDateTime);
      const dateB = safeToDate(b.endDateTime || b.startDateTime);
      return dateA - dateB;
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
          <Folder size={18} style={{ color: 'var(--cat-project)' }} />
          Próximas Entregas de Proyectos
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-base)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
          {projects.length} pendientes
        </span>
      </div>

      {projects.length === 0 ? (
        <div style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-base)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <CheckCircle2 size={28} style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.9rem' }}>¡Excelente! No tienes fechas de entrega de proyectos pendientes.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {projects.map((proj) => {
            const endDate = safeToDate(proj.endDateTime || proj.startDateTime);
            const urgency = getProjectUrgency(endDate);
            const timeRemainingText = getFormattedHoursLeft(endDate);

            const getUrgencyBadge = () => {
              if (urgency === 'urgent' || urgency === 'expired') {
                return {
                  bg: 'rgba(248, 113, 113, 0.15)',
                  color: 'var(--color-danger)',
                  border: 'rgba(248, 113, 113, 0.3)',
                  label: `Urgente: ${timeRemainingText}`
                };
              }
              if (urgency === 'warning') {
                return {
                  bg: 'rgba(240, 180, 41, 0.15)',
                  color: 'var(--color-warning)',
                  border: 'rgba(240, 180, 41, 0.3)',
                  label: `Atención: ${timeRemainingText}`
                };
              }
              return {
                bg: 'var(--accent-primary-glow)',
                color: 'var(--accent-primary)',
                border: 'rgba(91, 141, 239, 0.3)',
                label: timeRemainingText
              };
            };

            const urgencyBadge = getUrgencyBadge();

            return (
              <div
                key={proj.id}
                onClick={() => onSelectEvent(proj)}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-base)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `4px solid ${urgencyBadge.color}`,
                  borderTop: '1px solid var(--border-subtle)',
                  borderRight: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'transform var(--transition-fast)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {proj.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                    <Clock size={13} />
                    {formatFullDateTime(endDate)}
                  </p>
                </div>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: urgencyBadge.bg,
                  color: urgencyBadge.color,
                  border: `1px solid ${urgencyBadge.border}`,
                  whiteSpace: 'nowrap'
                }}>
                  {(urgency === 'urgent' || urgency === 'expired') && <AlertTriangle size={12} />}
                  {urgencyBadge.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
