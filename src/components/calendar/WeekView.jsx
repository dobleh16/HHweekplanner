import React, { useState } from 'react';
import { 
  getStartOfWeek, 
  getEndOfWeek, 
  getWeekDays, 
  formatDisplayDate, 
  isToday, 
  isSameDay, 
  safeToDate, 
  generateTimeSlots 
} from '../../utils/dateHelpers';
import { expandEventsForWeek } from '../../utils/recurrence';
import { getColombianHolidayInfo } from '../../utils/colombianHolidays';
import { EventCard } from './EventCard';
import { Button } from '../ui/Button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Filter,
  SlidersHorizontal,
  Flag,
  List,
  Grid,
  Plus,
  Clock
} from 'lucide-react';
import { addWeeks, subWeeks } from 'date-fns';

export const WeekView = ({
  rawEvents = [],
  onSelectEvent,
  onSelectSlot,
  onOpenNewEvent,
  onToggleComplete
}) => {
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMobileDayIndex, setSelectedMobileDayIndex] = useState(() => {
    const today = new Date();
    const weekDays = getWeekDays(today);
    const foundIdx = weekDays.findIndex((d) => isSameDay(d, today));
    return foundIdx >= 0 ? foundIdx : 0;
  });
  const [mobileMode, setMobileMode] = useState('list'); // 'list' | 'grid'
  const [isMobileSingleDayView, setIsMobileSingleDayView] = useState(true);

  const weekDays = getWeekDays(currentWeekDate);
  const weekStart = getStartOfWeek(currentWeekDate);
  const weekEnd = getEndOfWeek(currentWeekDate);
  const timeSlots = generateTimeSlots(6, 23);

  const expandedEvents = expandEventsForWeek(rawEvents, currentWeekDate);

  const filteredEvents = expandedEvents.filter((evt) => {
    if (selectedFilter === 'all') return true;
    return evt.type === selectedFilter;
  });

  const handlePrevWeek = () => setCurrentWeekDate((prev) => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentWeekDate((prev) => addWeeks(prev, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentWeekDate(today);
    const foundIdx = weekDays.findIndex((d) => isSameDay(d, today));
    if (foundIdx >= 0) setSelectedMobileDayIndex(foundIdx);
  };

  const filterOptions = [
    { key: 'all', label: 'Todos' },
    { key: 'task', label: 'Tareas' },
    { key: 'gym', label: 'Gym' },
    { key: 'project', label: 'Proyectos' },
    { key: 'reminder', label: 'Recordatorios' }
  ];

  const selectedDayDate = weekDays[selectedMobileDayIndex] || weekDays[0];
  const selectedDayHoliday = getColombianHolidayInfo(selectedDayDate);

  // Events for selected day (sorted chronologically)
  const selectedDayEvents = filteredEvents.filter((evt) => {
    const evtStart = safeToDate(evt.computedStart || evt.startDateTime);
    return isSameDay(evtStart, selectedDayDate);
  }).sort((a, b) => {
    const startA = safeToDate(a.computedStart || a.startDateTime);
    const startB = safeToDate(b.computedStart || b.startDateTime);
    return startA - startB;
  });

  const displayWeekDays = isMobileSingleDayView && typeof window !== 'undefined' && window.innerWidth <= 768
    ? [selectedDayDate]
    : weekDays;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* Calendar Navigation & Controls Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: 'var(--bg-surface)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          {/* Nav & Current Week Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Button variant="secondary" size="sm" onClick={handlePrevWeek} title="Semana anterior">
                <ChevronLeft size={18} />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleToday}>
                Hoy
              </Button>
              <Button variant="secondary" size="sm" onClick={handleNextWeek} title="Semana siguiente">
                <ChevronRight size={18} />
              </Button>
            </div>

            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CalendarIcon size={18} style={{ color: 'var(--accent-primary)' }} />
              {formatDisplayDate(weekStart, 'd MMM')} – {formatDisplayDate(weekEnd, 'd MMM, yyyy')}
            </h2>
          </div>

          {/* Mobile View Switches */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Toggle List vs Grid */}
            <button
              onClick={() => setMobileMode(mobileMode === 'list' ? 'grid' : 'list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-primary-glow)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              {mobileMode === 'list' ? <Grid size={15} /> : <List size={15} />}
              {mobileMode === 'list' ? 'Ver Grilla' : 'Ver Lista'}
            </button>

            {mobileMode === 'grid' && (
              <button
                onClick={() => setIsMobileSingleDayView(!isMobileSingleDayView)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-base)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
              >
                <SlidersHorizontal size={14} />
                {isMobileSingleDayView ? '7 Días' : '1 Día'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Day Picker Tabs */}
        <div className="mobile-only" style={{
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}>
          {weekDays.map((day, idx) => {
            const active = idx === selectedMobileDayIndex;
            const today = isToday(day);
            const holiday = getColombianHolidayInfo(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedMobileDayIndex(idx)}
                style={{
                  flex: 1,
                  minWidth: '44px',
                  padding: '0.5rem 0.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: active ? 'var(--accent-primary)' : today ? 'rgba(91, 141, 239, 0.15)' : holiday ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-base)',
                  color: active ? '#FFFFFF' : today ? 'var(--accent-primary)' : holiday ? '#F59E0B' : 'var(--text-muted)',
                  border: holiday ? '1px solid #F59E0B' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.85, textTransform: 'uppercase' }}>
                  {formatDisplayDate(day, 'EEE')}
                </span>
                <span>{formatDisplayDate(day, 'd')}</span>
                {holiday && (
                  <span style={{ fontSize: '0.55rem', lineHeight: 1, marginTop: '0.1rem' }}>🇨🇴</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <Filter size={15} style={{ color: 'var(--text-muted)', marginRight: '0.2rem' }} />
          {filterOptions.map((opt) => {
            const active = selectedFilter === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSelectedFilter(opt.key)}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  backgroundColor: active ? 'var(--accent-primary-glow)' : 'var(--bg-base)',
                  color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
                  border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Banner on Mobile */}
      {selectedDayHoliday && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid #F59E0B',
          color: '#F59E0B',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <Flag size={18} />
          <span>Festivo Oficial Colombia: {selectedDayHoliday.name}</span>
        </div>
      )}

      {/* MOBILE TIMELINE LIST VIEW MODE */}
      <div className="mobile-only">
        {mobileMode === 'list' && (
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Agenda de {formatDisplayDate(selectedDayDate, "eeee d 'de' MMMM")}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-base)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                {selectedDayEvents.length} eventos
              </span>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-subtle)',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Clock size={32} style={{ opacity: 0.4 }} />
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>No hay eventos programados para este día.</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>¡Agrega un nuevo compromiso o disfruta tu día!</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => onSelectSlot(selectedDayDate, 9)}
                >
                  Agregar evento hoy
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {selectedDayEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onClick={onSelectEvent}
                    onToggleComplete={onToggleComplete}
                    variant="timeline"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DESKTOP & MOBILE HOURLY GRID VIEW MODE */}
      <div 
        style={{
          display: (typeof window !== 'undefined' && window.innerWidth <= 768 && mobileMode === 'list') ? 'none' : 'block',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Days Header Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `55px repeat(${displayWeekDays.length}, 1fr)`,
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-base)'
        }}>
          {/* Time Column Header */}
          <div style={{ padding: '0.6rem 0.25rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            Hora
          </div>

          {/* Days Headers */}
          {displayWeekDays.map((day) => {
            const today = isToday(day);
            const holiday = getColombianHolidayInfo(day);

            return (
              <div
                key={day.toISOString()}
                style={{
                  padding: '0.6rem 0.4rem',
                  textAlign: 'center',
                  borderLeft: '1px solid var(--border-subtle)',
                  backgroundColor: today ? 'rgba(91, 141, 239, 0.08)' : holiday ? 'rgba(245, 158, 11, 0.06)' : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.1rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: today ? 'var(--accent-primary)' : holiday ? '#F59E0B' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {formatDisplayDate(day, 'EEE')}
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: today ? 'var(--accent-primary)' : holiday ? '#F59E0B' : 'var(--text-main)'
                }}>
                  {formatDisplayDate(day, 'd')}
                </div>

                {holiday && (
                  <div 
                    title={`Festivo en Colombia: ${holiday.name}`}
                    style={{
                      marginTop: '0.2rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      padding: '0.15rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#F59E0B',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      maxWidth: '100%'
                    }}
                  >
                    <Flag size={10} />
                    <span className="truncate">{holiday.name}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Slot Body */}
        <div style={{ maxHeight: '640px', overflowY: 'auto' }}>
          {timeSlots.map((slot) => (
            <div
              key={slot.hour}
              style={{
                display: 'grid',
                gridTemplateColumns: `55px repeat(${displayWeekDays.length}, 1fr)`,
                borderBottom: '1px solid var(--border-subtle)',
                minHeight: '56px'
              }}
            >
              {/* Hour Label */}
              <div style={{
                padding: '0.4rem 0.2rem',
                textAlign: 'center',
                fontSize: '0.7rem',
                color: 'var(--text-dim)',
                borderRight: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-base)'
              }}>
                {slot.label}
              </div>

              {/* Day Slots */}
              {displayWeekDays.map((day) => {
                const today = isToday(day);
                const holiday = getColombianHolidayInfo(day);
                const slotEvents = filteredEvents.filter((evt) => {
                  const evtStart = safeToDate(evt.computedStart || evt.startDateTime);
                  return isSameDay(evtStart, day) && evtStart.getHours() === slot.hour;
                });

                return (
                  <div
                    key={`${day.toISOString()}_${slot.hour}`}
                    onClick={() => onSelectSlot(day, slot.hour)}
                    style={{
                      borderLeft: '1px solid var(--border-subtle)',
                      backgroundColor: today ? 'rgba(91, 141, 239, 0.03)' : holiday ? 'rgba(245, 158, 11, 0.02)' : 'transparent',
                      padding: '0.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      minHeight: '56px',
                      cursor: 'pointer'
                    }}
                  >
                    {slotEvents.map((evt) => (
                      <div 
                        key={evt.id} 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(evt);
                        }}
                      >
                        <EventCard event={evt} onClick={onSelectEvent} compact={displayWeekDays.length > 3} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
