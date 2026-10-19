import React from 'react';
import { CheckCircle2, Circle, Flame, CalendarCheck, Plus, Pencil, Target } from 'lucide-react';

export const HabitTracker = ({
  habits = [],
  onToggleToday,
  isCompletedToday,
  getStreak,
  getMonthCount,
  onAddHabit,
  onEditHabit
}) => {
  const daysInCurrentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {habits.map((habit) => {
            const completed = isCompletedToday(habit.id);
            const streak = getStreak(habit.id);
            const monthCount = getMonthCount(habit.id);
            const habitColor = habit.color || 'var(--accent-primary)';
            const goal = habit.monthlyGoal || 0;
            const goalProgress = goal > 0 ? Math.min(100, Math.round((monthCount / goal) * 100)) : 0;
            const goalMet = goal > 0 && monthCount >= goal;

            return (
              <div
                key={habit.id}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-base)',
                  borderRadius: 'var(--radius-md)',
                  border: completed
                    ? `1px solid ${habitColor}55`
                    : '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
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
                        {monthCount}/{daysInCurrentMonth} este mes
                      </span>
                      {/* Goal met badge */}
                      {goalMet && (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                          fontSize: '0.75rem',
                          color: '#6EE7B7',
                          fontWeight: 600,
                          backgroundColor: 'rgba(110,231,183,0.12)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          <Target size={11} />
                          ¡Meta cumplida!
                        </span>
                      )}
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

                {/* Progress bar (only if goal set) */}
                {goal > 0 && (
                  <div style={{ marginTop: '0.65rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.3rem'
                    }}>
                      <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Target size={11} style={{ color: '#FB923C' }} />
                        Meta: {goal} días
                      </span>
                      <span style={{
                        fontSize: '0.73rem',
                        fontWeight: 600,
                        color: goalMet ? '#6EE7B7' : habitColor
                      }}>
                        {goalProgress}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '5px',
                      backgroundColor: 'var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${goalProgress}%`,
                        backgroundColor: goalMet ? '#6EE7B7' : habitColor,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
