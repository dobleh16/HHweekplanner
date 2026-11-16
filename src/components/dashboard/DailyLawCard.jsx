import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Zap, Cross, Rocket, Sparkles } from 'lucide-react';
import { LAWS_OF_POWER, BIBLE_VERSES, BRIAN_TRACY_QUOTES } from '../../utils/dailyQuotesData';

// ─────────────────────────────────────────────
// CATEGORY CONFIGS
// ─────────────────────────────────────────────
const CATEGORIES = {
  bible: {
    id: 'bible',
    label: 'Palabra del Día',
    shortLabel: 'Biblia',
    icon: Cross,
    accent: '#F0B429',
    accentBg: 'rgba(240, 180, 41, 0.12)',
    accentBorder: 'rgba(240, 180, 41, 0.28)',
    glowColor: 'rgba(240, 180, 41, 0.08)',
    insideAccent: '#FCD34D',
    insideBg: 'linear-gradient(135deg, rgba(240,180,41,0.12), rgba(252,211,77,0.06))',
    insideBorder: '#F0B429',
    reflectionLabel: 'Consejo para tu Día',
  },
  law: {
    id: 'law',
    label: 'Ley del Poder',
    shortLabel: 'Ley del Poder',
    icon: BookOpen,
    accent: '#5B8DEF',
    accentBg: 'rgba(91, 141, 239, 0.12)',
    accentBorder: 'rgba(91, 141, 239, 0.28)',
    glowColor: 'rgba(91, 141, 239, 0.08)',
    insideAccent: '#A78BFA',
    insideBg: 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(91,141,239,0.08))',
    insideBorder: '#A78BFA',
    reflectionLabel: 'Reflexión',
  },
  tracy: {
    id: 'tracy',
    label: 'Superación Personal',
    shortLabel: 'Brian Tracy',
    icon: Rocket,
    accent: '#FB923C',
    accentBg: 'rgba(251, 146, 60, 0.12)',
    accentBorder: 'rgba(251, 146, 60, 0.28)',
    glowColor: 'rgba(251, 146, 60, 0.08)',
    insideAccent: '#FDBA74',
    insideBg: 'linear-gradient(135deg, rgba(251,146,60,0.12), rgba(253,186,116,0.06))',
    insideBorder: '#FB923C',
    reflectionLabel: 'Clave de Éxito',
  },
};

// ─────────────────────────────────────────────
// POOLS BY CATEGORY & DAILY PICKER (366 DÍAS SIN REPETIR)
// ─────────────────────────────────────────────
const POOLS = {
  bible: BIBLE_VERSES,
  law: LAWS_OF_POWER,
  tracy: BRIAN_TRACY_QUOTES,
};

const CATEGORY_ORDER = ['bible', 'law', 'tracy'];

function getDayOfYear() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getEntryForCategory(categoryKey) {
  const pool = POOLS[categoryKey];
  const dayOfYear = getDayOfYear();
  const idx = (dayOfYear - 1 + pool.length) % pool.length;
  return pool[idx];
}

// ─────────────────────────────────────────────
// SINGLE QUOTE BLOCK SUB-COMPONENT
// ─────────────────────────────────────────────
const QuoteEntryItem = ({ entry, compact = false }) => {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES[entry.category];
  const IconComp = cat.icon;

  let badgeLabel = '';
  let mainTitle = '';
  let mainBody = '';
  const reflectionText = entry.insight;

  if (entry.category === 'law') {
    badgeLabel = `${cat.label} · #${entry.number}`;
    mainTitle = entry.title;
    mainBody = entry.summary;
  } else if (entry.category === 'tracy') {
    badgeLabel = `${cat.label} · ${entry.author}`;
    mainTitle = `"${entry.quote}"`;
    mainBody = `— ${entry.author}, ${entry.source}`;
  } else {
    badgeLabel = `${cat.label} · ${entry.reference}`;
    mainTitle = `"${entry.verse}"`;
    mainBody = entry.reference;
  }

  return (
    <div
      className="daily-law-item"
      style={{
        backgroundColor: 'var(--bg-base)',
        border: `1px solid ${cat.accentBorder}`,
        borderRadius: 'var(--radius-md)',
        padding: compact ? '1rem' : '1.25rem',
        boxShadow: `0 0 20px ${cat.glowColor}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all var(--transition-fast)',
      }}
    >
      {/* Decorative glow orb */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${cat.glowColor.replace('0.08', '0.16')} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Header row */}
      <div
        className="daily-law-item-header"
        style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '0.75rem' }}
      >
        <div
          className="daily-law-icon-box"
          style={{
            width: compact ? '38px' : '44px',
            height: compact ? '38px' : '44px',
            borderRadius: 'var(--radius-md)',
            flexShrink: 0,
            background: `linear-gradient(135deg, ${cat.accentBg}, ${cat.accentBorder.replace('0.28', '0.08')})`,
            border: `1px solid ${cat.accentBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: cat.accent,
          }}
        >
          <IconComp size={compact ? 18 : 21} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 'clamp(0.62rem, 1.8vw, 0.68rem)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: cat.accent,
                background: cat.accentBg,
                border: `1px solid ${cat.accentBorder}`,
                borderRadius: 'var(--radius-full)',
                padding: '0.12rem 0.6rem',
                maxWidth: '100%',
              }}
            >
              {badgeLabel}
            </span>
          </div>

          <h4
            style={{
              fontSize: entry.category === 'law' ? 'clamp(0.88rem, 2.5vw, 0.95rem)' : 'clamp(0.82rem, 2.4vw, 0.88rem)',
              fontWeight: entry.category === 'law' ? 700 : 600,
              color: 'var(--text-main)',
              lineHeight: 1.45,
              fontStyle: entry.category !== 'law' ? 'italic' : 'normal',
            }}
          >
            {mainTitle}
          </h4>

          {entry.category !== 'law' && (
            <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              {mainBody}
            </p>
          )}
        </div>
      </div>

      {/* Insight callout */}
      <div
        style={{
          background: cat.insideBg,
          borderLeft: `3px solid ${cat.insideBorder}`,
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          padding: '0.6rem 0.85rem',
          marginBottom: entry.category === 'law' ? '0.6rem' : '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
          <Zap size={11} color={cat.insideAccent} />
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: cat.insideAccent,
            }}
          >
            {cat.reflectionLabel}
          </span>
        </div>
        <p style={{ fontSize: 'clamp(0.76rem, 2.2vw, 0.8rem)', fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          "{reflectionText}"
        </p>
      </div>

      {/* Expandable summary — only for laws */}
      {entry.category === 'law' && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: cat.accent,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.15rem 0',
              transition: 'opacity var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Ocultar explicación' : 'Ver explicación completa'}
          </button>

          {expanded && (
            <div
              style={{
                marginTop: '0.6rem',
                padding: '0.85rem',
                backgroundColor: 'var(--bg-surface-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                {mainBody}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export const DailyLawCard = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const visibleCategories =
    activeFilter === 'all' ? CATEGORY_ORDER : [activeFilter];

  const entriesToRender = visibleCategories.map(catKey =>
    getEntryForCategory(catKey)
  );

  return (
    <div
      className="daily-law-card"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)',
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Top Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              fontSize: 'clamp(0.98rem, 3vw, 1.1rem)',
              fontWeight: 600,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Sparkles size={18} style={{ color: '#F0B429', flexShrink: 0 }} />
            Frases y Sabiduría del Día
          </h3>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
            {dateFormatted}
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="daily-law-pills">
        <button
          onClick={() => setActiveFilter('all')}
          style={{
            fontSize: '0.73rem',
            fontWeight: 600,
            padding: '0.3rem 0.7rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            backgroundColor: activeFilter === 'all' ? 'var(--accent-primary)' : 'var(--bg-base)',
            color: activeFilter === 'all' ? '#fff' : 'var(--text-muted)',
            border:
              activeFilter === 'all'
                ? '1px solid var(--accent-primary)'
                : '1px solid var(--border-subtle)',
          }}
        >
          Todas (3)
        </button>

        {CATEGORY_ORDER.map(catKey => {
          const cat = CATEGORIES[catKey];
          const IconComp = cat.icon;
          const isSelected = activeFilter === catKey;
          return (
            <button
              key={catKey}
              onClick={() => setActiveFilter(catKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.73rem',
                fontWeight: 600,
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                backgroundColor: isSelected ? cat.accentBg : 'var(--bg-base)',
                color: isSelected ? cat.accent : 'var(--text-muted)',
                border: isSelected ? `1px solid ${cat.accentBorder}` : '1px solid var(--border-subtle)',
              }}
            >
              <IconComp size={12} style={{ flexShrink: 0 }} />
              {cat.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Phrases List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', minWidth: 0 }}>
        {entriesToRender.map((entry, idx) => (
          <QuoteEntryItem
            key={`${entry.category}-${idx}`}
            entry={entry}
            compact={activeFilter === 'all'}
          />
        ))}
      </div>
    </div>
  );
};
