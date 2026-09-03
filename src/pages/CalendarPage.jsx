import React from 'react';
import { WeekView } from '../components/calendar/WeekView';

export const CalendarPage = ({
  rawEvents = [],
  onSelectEvent,
  onSelectSlot,
  onOpenNewEvent,
  onToggleComplete
}) => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Calendario Semanal
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Visualiza y gestiona tu semana completa en formato agenda con horarios recurrentes y tareas.
        </p>
      </div>

      <WeekView
        rawEvents={rawEvents}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        onOpenNewEvent={onOpenNewEvent}
        onToggleComplete={onToggleComplete}
      />
    </div>
  );
};
