import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, CalendarDays, Flame, CheckCircle2, Clock, Circle } from 'lucide-react';
import { safeToDate, formatDisplayDate } from '../../utils/dateHelpers';
import { eventTypeConfig } from './Badge';

const highlight = (text = '', query = '') => {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} style={{ backgroundColor: 'rgba(91,141,239,0.35)', color: 'var(--text-main)', borderRadius: '2px', padding: '0 1px' }}>{part}</mark>
      : part
  );
};

export const SearchModal = ({ isOpen, onClose, events = [], habits = [], onSelectEvent }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const filteredEvents = useCallback(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return events
      .filter(e => e.title?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, events]);

  const filteredHabits = useCallback(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return habits
      .filter(h => h.title?.toLowerCase().includes(q) || h.description?.toLowerCase().includes(q))
      .slice(0, 4);
  }, [query, habits]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const evResults = filteredEvents();
  const habResults = filteredHabits();
  const hasResults = evResults.length > 0 || habResults.length > 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 'clamp(4rem, 10vh, 8rem)',
        padding: 'clamp(4rem, 10vh, 8rem) 1rem 1rem',
        backgroundColor: 'rgba(10, 11, 15, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.9rem 1.1rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <Search size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            id="search-global-input"
            placeholder="Buscar eventos, hábitos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '1rem'
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)', display: 'flex', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          )}
          <kbd style={{
            padding: '0.2rem 0.45rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'monospace'
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: query ? '0.5rem' : '1.5rem 1rem' }}>
          {!query && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Search size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <p>Escribe para buscar en tus eventos y hábitos</p>
            </div>
          )}

          {query && !hasResults && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem', fontSize: '0.9rem' }}>
              <p>No se encontraron resultados para <strong>"{query}"</strong></p>
            </div>
          )}

          {evResults.length > 0 && (
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0.4rem 0.5rem 0.25rem' }}>
                Eventos
              </div>
              {evResults.map(evt => {
                const config = eventTypeConfig[evt.type] || eventTypeConfig.custom;
                const start = safeToDate(evt.startDateTime);
                return (
                  <button
                    key={evt.id}
                    onClick={() => { onSelectEvent(evt); onClose(); }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.7rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      width: '34px', height: '34px', borderRadius: 'var(--radius-md)',
                      backgroundColor: config.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: config.color, flexShrink: 0
                    }}>
                      {evt.completed
                        ? <CheckCircle2 size={17} style={{ color: 'var(--color-success)' }} />
                        : <Circle size={17} />
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {highlight(evt.title, query)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
                        <Clock size={11} />
                        {formatDisplayDate(start, "d 'de' MMM, HH:mm")}
                        <span style={{ color: config.color, marginLeft: '0.2rem' }}>• {config.label}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {habResults.length > 0 && (
            <div>
              <div style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0.4rem 0.5rem 0.25rem' }}>
                Hábitos
              </div>
              {habResults.map(habit => (
                <div
                  key={habit.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.75rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: 'var(--radius-md)',
                    backgroundColor: `${habit.color || '#5B8DEF'}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0
                  }}>
                    {habit.emoji || '⭐'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {highlight(habit.title, query)}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#FB923C', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                      <Flame size={11} />
                      Hábito diario
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CalendarDays size={13} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.6rem 1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '1rem',
          fontSize: '0.73rem',
          color: 'var(--text-dim)'
        }}>
          <span>↵ Abrir evento</span>
          <span>ESC Cerrar</span>
        </div>
      </div>
    </div>
  );
};
