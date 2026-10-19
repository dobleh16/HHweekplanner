import React from 'react';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { TodayEvents } from '../components/dashboard/TodayEvents';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { CurrentMonthHolidays } from '../components/dashboard/CurrentMonthHolidays';
import { AssistantBriefing } from '../components/dashboard/AssistantBriefing';
import { HabitTracker } from '../components/habits/HabitTracker';
import { expandEventsForWeek } from '../utils/recurrence';
import { getStartOfWeek, getEndOfWeek, safeToDate, isToday, getProjectUrgency } from '../utils/dateHelpers';
import { getColombianHolidaysForMonth } from '../utils/colombianHolidays';
import { 
  Calendar, 
  CheckSquare, 
  Folder, 
  Flag
} from 'lucide-react';

export const Dashboard = ({
  rawEvents = [],
  onSelectEvent,
  onToggleComplete,
  onOpenNewEvent,
  onQuickCreate,
  habits = [],
  onToggleHabitToday,
  isHabitCompletedToday,
  getHabitStreak,
  getHabitMonthCount,
  onAddHabit,
  onEditHabit
}) => {
  const today = new Date();
  const weekStart = getStartOfWeek(today);
  const weekEnd = getEndOfWeek(today);

  // Expand recurring items for the current week
  const expandedCurrentWeek = expandEventsForWeek(rawEvents, today);

  // Today's event count
  const todayCount = expandedCurrentWeek.filter((evt) => {
    const start = safeToDate(evt.computedStart || evt.startDateTime);
    return isToday(start);
  }).length;

  // Tasks pending vs completed this week
  const weekTasks = expandedCurrentWeek.filter((evt) => {
    const start = safeToDate(evt.computedStart || evt.startDateTime);
    return start >= weekStart && start <= weekEnd;
  });

  const completedCount = weekTasks.filter((t) => t.completed).length;
  const pendingCount = weekTasks.length - completedCount;

  // Urgent deadlines count (<48h)
  const urgentProjectsCount = rawEvents.filter((evt) => {
    if (evt.type !== 'project' || evt.completed) return false;
    const urgency = getProjectUrgency(evt.endDateTime);
    return urgency === 'urgent' || urgency === 'warning';
  }).length;

  // Colombian holidays count this month
  const monthHolidaysCount = getColombianHolidaysForMonth(today).length;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Smart Personal Assistant Briefing Banner */}
      <AssistantBriefing
        events={rawEvents}
        onOpenNewEvent={onOpenNewEvent}
        onQuickCreate={onQuickCreate}
      />

      {/* Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <SummaryCard
          title="Eventos para Hoy"
          value={todayCount}
          subtitle="Compromisos en tu agenda hoy"
          icon={Calendar}
          color="var(--accent-primary)"
          bgColor="var(--accent-primary-glow)"
        />

        <SummaryCard
          title="Tareas de la Semana"
          value={`${completedCount} / ${weekTasks.length}`}
          subtitle={`${pendingCount} pendientes esta semana`}
          icon={CheckSquare}
          color="var(--color-success)"
          bgColor="var(--color-success-bg)"
        />

        <SummaryCard
          title="Entregas Cercanas"
          value={urgentProjectsCount}
          subtitle="Proyectos por vencer (< 48h)"
          icon={Folder}
          color="var(--color-warning)"
          bgColor="var(--color-warning-bg)"
        />

        <SummaryCard
          title="Festivos Colombia"
          value={`🇨🇴 ${monthHolidaysCount}`}
          subtitle="Festivos oficiales este mes"
          icon={Flag}
          color="#F59E0B"
          bgColor="rgba(245, 158, 11, 0.15)"
        />
      </div>

      {/* Main Grid: Today Agenda, Habit Tracker, Colombian Holidays & Project Deadlines */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem'
      }}>
        <TodayEvents
          events={expandedCurrentWeek}
          onSelectEvent={onSelectEvent}
          onToggleComplete={onToggleComplete}
        />

        <HabitTracker
          habits={habits}
          onToggleToday={onToggleHabitToday}
          isCompletedToday={isHabitCompletedToday}
          getStreak={getHabitStreak}
          getMonthCount={getHabitMonthCount}
          onAddHabit={onAddHabit}
          onEditHabit={onEditHabit}
        />

        <CurrentMonthHolidays />

        <UpcomingDeadlines
          events={rawEvents}
          onSelectEvent={onSelectEvent}
        />
      </div>
    </div>
  );
};
