import React from 'react';
import { CheckCircle2, Circle, Flame, CalendarCheck, Plus, Pencil } from 'lucide-react';

export const HabitTracker = ({
  habits = [],
  onToggleToday,
  isCompletedToday,
  getStreak,
  getMonthCount,
  onAddHabit,
  onEditHabit
}) => {
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Flame size={18} style={{ color: '#FB923C' }} />
          Mis Hábitos
        </h3>
        <button
          id="btn-add-habit"
          onClick={onAddHabit}
          title="Agregar hábito"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'var(--accent-primary)',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary-glow)',
            border: '1px solid rgba(91,141,239,0.3)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Plus size={14} />
          Nuevo
        </button>
      </div>

      {/* Empty state */}
      {habits.length === 0 ? (
        <div style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-base)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <Flame size={28} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
          <p style={{ fontSize: '0.9rem' }}>No tienes hábitos registrados aún.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            ¡Agrega uno y empieza a construir tu racha!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {habits.map((habit) => {
            const completed = isCompletedToday(habit.id);
            const streak = getStreak(habit.id);
            const monthCount = getMonthCount(habit.id);
            const habitColor = habit.color || 'var(--accent-primary)';

            return (
              <div
                key={habit.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-base)',
                  borderRadius: 'var(--radius-md)',
                  border: completed
                    ? `1px solid ${habitColor}55`
                    : '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)',
                  opacity: 1
                }}
              >
                {/* Check button */}
                <button
                  id={`btn-habit-toggle-${habit.id}`}
                  onClick={() => onToggleToday(habit.id)}
                  style={{
                    color: completed ? habitColor : 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    transform: completed ? 'scale(1.1)' : 'scale(1)',
                    flexShrink: 0
                  }}
                  title={completed ? 'Desmarcar hoy' : 'Marcar como hecho hoy'}
                >
                  {completed
                    ? <CheckCircle2 size={22} />
                    : <Circle size={22} />
                  }
                </button>

                {/* Emoji */}
                <span style={{
                  fontSize: '1.25rem',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: `${habitColor}18`,
                  flexShrink: 0
                }}>
                  {habit.emoji || '⭐'}
                </span>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: completed ? habitColor : 'var(--text-main)',
                    textDecoration: completed ? 'line-through' : 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    transition: 'color var(--transition-fast)'
                  }}>
                    {habit.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                    {/* Streak */}
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.78rem',
                      color: streak > 0 ? '#FB923C' : 'var(--text-dim)',
                      fontWeight: 500
                    }}>
                      <Flame size={13} />
                      {streak} {streak === 1 ? 'día' : 'días'}
                    </span>
                    {/* Month count */}
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)'
                    }}>
                      <CalendarCheck size={13} />
                      {monthCount} este mes
                    </span>
                  </div>
                </div>

                {/* Edit button */}
                <button
                  id={`btn-habit-edit-${habit.id}`}
                  onClick={() => onEditHabit(habit)}
                  style={{
                    color: 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all var(--transition-fast)',
                    flexShrink: 0
                  }}
                  title="Editar hábito"
                >
                  <Pencil size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
