import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { safeToDate, isToday } from '../utils/dateHelpers';
import { expandEventsForWeek } from '../utils/recurrence';
import { subWeeks, format, startOfWeek, endOfWeek, eachDayOfInterval, subDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingUp, CheckCircle2, Flame, Target, Calendar } from 'lucide-react';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div style={{
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: 'var(--shadow-sm)'
  }}>
    <div style={{
      width: '44px', height: '44px',
      borderRadius: 'var(--radius-md)',
      backgroundColor: `${color}20`,
      border: `1px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color, flexShrink: 0
    }}>
      <Icon size={22} />
    </div>
    <div>
      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>{title}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{value}</div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>{subtitle}</div>}
    </div>
  </div>
);

// Habit heatmap: last 12 weeks × 7 days
const HabitHeatmap = ({ habit, completions, toDateKey }) => {
  const today = new Date();
  const days = Array.from({ length: 84 }, (_, i) => subDays(today, 83 - i));

  const getLevel = (date) => {
    const key = toDateKey(date);
    return completions?.[habit.id]?.has(key) ? 1 : 0;
  };

  const habitColor = habit.color || '#5B8DEF';
  const monthLabels = [];
  let lastMonth = null;
  days.forEach((d, i) => {
    const m = format(d, 'MMM', { locale: es });
    if (m !== lastMonth) {
      monthLabels.push({ index: i, label: m });
      lastMonth = m;
    }
  });

  // Split into weeks (columns)
  const weeks = [];
  for (let w = 0; w < 12; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7));
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.1rem 1.25rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1.2rem' }}>{habit.emoji || '⭐'}</span>
        <span style={{ fontWeight: 600, color: habit.color || 'var(--text-main)', fontSize: '0.95rem' }}>
          {habit.title}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Últimas 12 semanas
        </span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '3px', minWidth: 'max-content' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {week.map((day, di) => {
                const level = getLevel(day);
                const isToday_ = isSameDay(day, today);
                return (
                  <div
                    key={di}
                    title={`${format(day, 'd MMM yyyy', { locale: es })}${level ? ' ✅' : ''}`}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '3px',
                      backgroundColor: level ? habitColor : 'var(--bg-base)',
                      border: isToday_ ? `1px solid ${habitColor}` : '1px solid transparent',
                      opacity: level ? 1 : 0.5,
                      transition: 'all var(--transition-fast)',
                      flexShrink: 0
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
        <span>Menos</span>
        {[0, 0.3, 0.6, 1].map((o, i) => (
          <div key={i} style={{ width: '11px', height: '11px', borderRadius: '2px', backgroundColor: o > 0 ? habitColor : 'var(--bg-base)', opacity: o > 0 ? o : 0.4 }} />
        ))}
        <span>Más</span>
      </div>
    </div>
  );
};

// Weekly completion bar chart (last 8 weeks)
const WeeklyChart = ({ rawEvents }) => {
  const data = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const ref = subWeeks(today, 7 - i);
      const wStart = startOfWeek(ref, { weekStartsOn: 1 });
      const wEnd = endOfWeek(ref, { weekStartsOn: 1 });
      const expanded = expandEventsForWeek(rawEvents, ref);
      const inWeek = expanded.filter(e => {
        const s = safeToDate(e.computedStart || e.startDateTime);
        return s >= wStart && s <= wEnd;
      });
      return {
        name: format(wStart, 'dd MMM', { locale: es }),
        completados: inWeek.filter(e => e.completed).length,
        pendientes: inWeek.filter(e => !e.completed).length
      };
    });
  }, [rawEvents]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem 0.9rem',
        fontSize: '0.82rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.3rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.1rem 1.25rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <TrendingUp size={17} style={{ color: 'var(--accent-primary)' }} />
        Eventos por semana (últimas 8)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={2} barCategoryGap="30%">
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(91,141,239,0.06)' }} />
          <Bar dataKey="completados" name="Completados" fill="#6EE7B7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pendientes" name="Pendientes" fill="#F87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: '1.2rem', marginTop: '0.5rem', fontSize: '0.78rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#6EE7B7' }} />
          Completados
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#F87171' }} />
          Pendientes
        </span>
      </div>
    </div>
  );
};

// Event type breakdown donut-like bar
const TypeBreakdown = ({ rawEvents }) => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const typeMap = {};
  rawEvents.forEach(e => {
    const s = safeToDate(e.startDateTime);
    if (s >= monthStart && s <= today) {
      const t = e.type || 'task';
      typeMap[t] = (typeMap[t] || 0) + 1;
    }
  });

  const TYPE_COLORS = {
    task: '#5B8DEF', gym: '#A78BFA', reminder: '#F472B6',
    project: '#F0B429', custom: '#34D399'
  };
  const TYPE_LABELS = {
    task: 'Tareas', gym: 'Gym', reminder: 'Recordatorios',
    project: 'Proyectos', custom: 'Personalizados'
  };

  const entries = Object.entries(typeMap).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.1rem 1.25rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={17} style={{ color: '#F0B429' }} />
        Eventos por tipo — este mes
      </h3>
      {total === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Sin eventos este mes aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {entries.map(([type, count]) => {
            const color = TYPE_COLORS[type] || '#5B8DEF';
            const pct = Math.round((count / total) * 100);
            return (
              <div key={type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{TYPE_LABELS[type] || type}</span>
                  <span style={{ fontWeight: 600, color }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-base)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main StatsPage
// ---------------------------------------------------------------------------

export const StatsPage = ({ rawEvents = [], habits = [], completions = {}, getStreak, getMonthCount, toDateKey }) => {
  const today = new Date();

  // Summary stats
  const totalCompleted = rawEvents.filter(e => e.completed).length;
  const totalEvents = rawEvents.length;
  const completionRate = totalEvents > 0 ? Math.round((totalCompleted / totalEvents) * 100) : 0;

  const todayEvents = useMemo(() => {
    const expanded = expandEventsForWeek(rawEvents, today);
    return expanded.filter(e => {
      const s = safeToDate(e.computedStart || e.startDateTime);
      return isToday(s);
    });
  }, [rawEvents]);

  const topStreak = habits.reduce((max, h) => {
    const s = getStreak(h.id);
    return s > max ? s : max;
  }, 0);

  // Days with at least one habit done this month
  const activeDaysThisMonth = useMemo(() => {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const days = eachDayOfInterval({ start: monthStart, end: today });
    return days.filter(day => {
      const key = toDateKey(day);
      return habits.some(h => completions[h.id]?.has(key));
    }).length;
  }, [habits, completions, today, toDateKey]);

  return (
    <div className="container" style={{ padding: 'clamp(1rem, 4vw, 2rem) 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.75rem)', fontWeight: 700, color: 'var(--text-main)' }}>
          📊 Estadísticas
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Tu progreso en eventos, hábitos y productividad.
        </p>
      </div>

      {/* Summary cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem'
      }}>
        <StatCard
          title="Completados / Total"
          value={`${totalCompleted}/${totalEvents}`}
          subtitle={`${completionRate}% de cumplimiento`}
          icon={CheckCircle2}
          color="#6EE7B7"
        />
        <StatCard
          title="Eventos hoy"
          value={todayEvents.length}
          subtitle="En tu agenda de hoy"
          icon={Calendar}
          color="var(--accent-primary)"
        />
        <StatCard
          title="Racha más larga"
          value={`🔥 ${topStreak}`}
          subtitle={`${topStreak === 1 ? 'día consecutivo' : 'días consecutivos'}`}
          icon={Flame}
          color="#FB923C"
        />
        <StatCard
          title="Días activos (hábitos)"
          value={activeDaysThisMonth}
          subtitle="Este mes con hábitos"
          icon={Target}
          color="#A78BFA"
        />
      </div>

      {/* Weekly chart */}
      <WeeklyChart rawEvents={rawEvents} />

      {/* Type breakdown */}
      <TypeBreakdown rawEvents={rawEvents} />

      {/* Habit Heatmaps */}
      {habits.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={18} style={{ color: '#FB923C' }} />
            Historial de Hábitos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {habits.map(habit => (
              <HabitHeatmap
                key={habit.id}
                habit={habit}
                completions={completions}
                toDateKey={toDateKey}
              />
            ))}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div style={{
          padding: '2.5rem 1rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <Flame size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
          <p>Agrega hábitos desde el Dashboard para ver tu heatmap aquí.</p>
        </div>
      )}
    </div>
  );
};
