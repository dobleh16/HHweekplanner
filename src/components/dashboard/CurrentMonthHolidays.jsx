import React from 'react';
import { getColombianHolidaysForMonth } from '../../utils/colombianHolidays';
import { formatDisplayDate, isToday, isBefore } from '../../utils/dateHelpers';
import { Flag, Calendar } from 'lucide-react';

export const CurrentMonthHolidays = () => {
  const today = new Date();
  const monthHolidays = getColombianHolidaysForMonth(today);
  const currentMonthName = formatDisplayDate(today, 'MMMM yyyy');

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
          <Flag size={18} style={{ color: '#F59E0B' }} />
          Festivos en Colombia — <span style={{ textTransform: 'capitalize', color: 'var(--accent-primary)' }}>{currentMonthName}</span>
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-base)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
          🇨🇴 {monthHolidays.length} festivos
        </span>
      </div>

      {monthHolidays.length === 0 ? (
        <div style={{
          padding: '1.5rem 1rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-base)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-subtle)',
          color: 'var(--text-muted)'
        }}>
          <Calendar size={24} style={{ opacity: 0.5, marginBottom: '0.35rem' }} />
          <p style={{ fontSize: '0.85rem' }}>No hay días festivos oficiales en Colombia durante este mes.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {monthHolidays.map((h) => {
            const isCurrent = isToday(h.date);
            const isPast = isBefore(h.date, today) && !isCurrent;

            return (
              <div
                key={h.name + h.date.toISOString()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-base)',
                  borderRadius: 'var(--radius-md)',
                  border: isCurrent ? '1px solid #F59E0B' : '1px solid var(--border-subtle)',
                  opacity: isPast ? 0.6 : 1,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCurrent ? '#F59E0B' : 'var(--text-main)',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {formatDisplayDate(h.date, 'EEE')}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1 }}>
                      {formatDisplayDate(h.date, 'd')}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {h.name}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDisplayDate(h.date, "eeee d 'de' MMMM")}
                    </p>
                  </div>
                </div>

                {isCurrent ? (
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    color: '#F59E0B',
                    border: '1px solid #F59E0B'
                  }}>
                    ¡HOY! 🇨🇴
                  </span>
                ) : isPast ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Pasado
                  </span>
                ) : (
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: 'var(--accent-primary-glow)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(91, 141, 239, 0.3)'
                  }}>
                    Próximo
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
