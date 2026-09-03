import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { safeToDate, isToday, formatDisplayDate, getProjectUrgency } from '../../utils/dateHelpers';
import { getColombianHolidayInfo } from '../../utils/colombianHolidays';
import { 
  Brain, 
  Dumbbell, 
  Flag, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Plus, 
  ArrowRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';

const EXAMPLE_SUGGESTIONS = [
  '🏋️ Gym mañana a las 7 AM',
  '📁 Entrega proyecto este viernes a las 5 PM',
  '🔔 Recordar pagar servicios el lunes a las 9 AM'
];

export const AssistantBriefing = ({
  events = [],
  onOpenNewEvent,
  onQuickCreate
}) => {
  const { user } = useAuth();
  const today = new Date();
  const hour = today.getHours();

  const [quickInput, setQuickInput] = useState('');

  // Time-aware greeting
  const getGreeting = () => {
    const name = user?.displayName ? user.displayName.split(' ')[0] : 'Planificador';
    if (hour >= 5 && hour < 12) return `¡Buenos días, ${name}! ☀️`;
    if (hour >= 12 && hour < 19) return `¡Buenas tardes, ${name}! 🌤️`;
    return `¡Buenas noches, ${name}! 🌙`;
  };

  // Analyze today's events
  const todayEvents = events.filter((evt) => {
    const start = safeToDate(evt.computedStart || evt.startDateTime);
    return isToday(start);
  });

  const gymToday = todayEvents.find((evt) => evt.type === 'gym');

  // Check urgent project deadlines (< 48h)
  const urgentProject = events
    .filter((evt) => evt.type === 'project' && !evt.completed)
    .find((evt) => {
      const urgency = getProjectUrgency(evt.endDateTime);
      return urgency === 'urgent' || urgency === 'warning';
    });

  // Check Colombian Holiday today or tomorrow
  const todayHoliday = getColombianHolidayInfo(today);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowHoliday = getColombianHolidayInfo(tomorrow);

  // Generate Assistant Executive Insight
  const getAssistantInsight = () => {
    if (todayHoliday) {
      return {
        title: `🇨🇴 ¡Hoy es Festivo Nacional: ${todayHoliday.name}!`,
        message: 'Disfruta tu día festivo. Si tienes compromisos o rutinas programadas, tómate tu tiempo con calma.',
        icon: Flag,
        color: '#F59E0B'
      };
    }

    if (tomorrowHoliday) {
      return {
        title: `🇨🇴 Mañana es festivo (${tomorrowHoliday.name})`,
        message: 'Aprovecha el día de hoy para dejar tus tareas principales terminadas y disfrutar tu festivo mañana.',
        icon: Flag,
        color: '#F59E0B'
      };
    }

    if (urgentProject) {
      return {
        title: `⚡ Foco Principal: ${urgentProject.title}`,
        message: `Esta entrega requiere tu atención prioritaria. Vence próximamente (${formatDisplayDate(urgentProject.endDateTime, "d 'de' MMM, HH:mm")}).`,
        icon: AlertTriangle,
        color: 'var(--color-danger)'
      };
    }

    if (gymToday) {
      const gymStart = safeToDate(gymToday.computedStart || gymToday.startDateTime);
      return {
        title: `🏋️ Entrenamiento de Gym hoy a las ${formatDisplayDate(gymStart, 'HH:mm')}`,
        message: 'Recuerda mantener una buena hidratación durante el día y preparar tu rutina con anticipación.',
        icon: Dumbbell,
        color: 'var(--cat-gym)'
      };
    }

    if (todayEvents.length > 0) {
      return {
        title: `📋 Tienes ${todayEvents.length} compromiso(s) para el día de hoy`,
        message: 'Tu agenda está balanceada. Mantén el ritmo en tus tareas sin sobrecargarte.',
        icon: CheckCircle2,
        color: 'var(--color-success)'
      };
    }

    return {
      title: '✨ Agenda libre y despejada hoy',
      message: 'Excelente momento para planificar los objetivos de la semana o avanzar en proyectos personales.',
      icon: Zap,
      color: 'var(--accent-primary)'
    };
  };

  const insight = getAssistantInsight();
  const InsightIcon = insight.icon;

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickCreate(quickInput.trim());
    setQuickInput('');
  };

  const handleSuggestionClick = (suggestionText) => {
    // Strip leading emoji
    const cleanText = suggestionText.replace(/^[\u1F300-\u1F9FF\u2600-\u26FF\u2700-\u27BF]\s*/, '');
    onQuickCreate(cleanText);
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-md)',
      background: 'linear-gradient(135deg, rgba(27,30,39,1) 0%, rgba(35,39,55,0.85) 100%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      {/* Header Greeting & Assistant Badge */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-primary-glow)',
              color: 'var(--accent-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid var(--accent-primary)'
            }}>
              <Brain size={13} />
              Asistente Personal HH
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {formatDisplayDate(today, "eeee d 'de' MMMM, yyyy")}
            </span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {getGreeting()}
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onOpenNewEvent}
        >
          Nuevo Evento
        </Button>
      </div>

      {/* Insight Highlight Box */}
      <div style={{
        backgroundColor: 'var(--bg-base)',
        borderLeft: `4px solid ${insight.color}`,
        borderTop: '1px solid var(--border-subtle)',
        borderRight: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.15rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: `${insight.color}1E`,
          border: `1px solid ${insight.color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: insight.color,
          flexShrink: 0
        }}>
          <InsightIcon size={20} />
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {insight.title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.4 }}>
            {insight.message}
          </p>
        </div>
      </div>

      {/* Fully Responsive Natural Language Command Input Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <form 
          onSubmit={handleQuickSubmit} 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.4rem 0.4rem 0.4rem 0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
            <MessageSquare size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Instrucción en lenguaje natural (ej. 'Agendar gym mañana 7 AM')..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                minHeight: '38px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!quickInput.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: quickInput.trim() ? 'var(--accent-primary)' : 'var(--bg-surface)',
              color: quickInput.trim() ? '#FFFFFF' : 'var(--text-dim)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: quickInput.trim() ? 'pointer' : 'not-allowed',
              transition: 'all var(--transition-fast)',
              minHeight: '40px',
              width: typeof window !== 'undefined' && window.innerWidth <= 480 ? '100%' : 'auto'
            }}
          >
            <Sparkles size={16} />
            <span>Procesar</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Example Suggestions Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500, marginRight: '0.2rem' }}>Ejemplos:</span>
          {EXAMPLE_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(sug)}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-base)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
