import React, { useState } from 'react';
import { Bell, BellOff, BellRing, X, Smartphone, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export const PushNotificationBanner = ({
  pushEnabled,
  pushLoading,
  pushError,
  onEnable,
  onDisable,
}) => {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if user dismissed or already enabled
  if (dismissed || pushEnabled) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(91,141,239,0.12), rgba(167,139,250,0.08))',
      border: '1px solid rgba(91,141,239,0.3)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
      animation: 'fadeIn 0.4s ease-out',
      position: 'relative',
    }}>
      {/* Icon */}
      <div style={{
        width: '40px', height: '40px', borderRadius: 'var(--radius-md)', flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(91,141,239,0.25), rgba(167,139,250,0.15))',
        border: '1px solid rgba(91,141,239,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent-primary)',
      }}>
        <Smartphone size={20} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
          🔔 Activa notificaciones en tu celular
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Recibe alertas de eventos y recordatorios aunque la app esté cerrada
        </p>
        {pushError && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertCircle size={12} /> {pushError}
          </p>
        )}
      </div>

      {/* CTA button */}
      <button
        onClick={onEnable}
        disabled={pushLoading}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
          background: 'var(--accent-primary)', color: '#fff',
          fontSize: '0.82rem', fontWeight: 600,
          border: 'none', cursor: pushLoading ? 'not-allowed' : 'pointer',
          opacity: pushLoading ? 0.7 : 1,
          transition: 'opacity var(--transition-fast)',
          whiteSpace: 'nowrap',
        }}
      >
        {pushLoading
          ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Activando...</>
          : <><Bell size={14} /> Activar</>
        }
      </button>

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute', top: '0.6rem', right: '0.6rem',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-dim)', padding: '0.2rem',
          display: 'flex', alignItems: 'center',
        }}
        title="Cerrar"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const PushStatusBadge = ({ pushEnabled, onDisable }) => {
  if (!pushEnabled) return null;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      background: 'rgba(110, 231, 183, 0.1)', border: '1px solid rgba(110,231,183,0.3)',
      borderRadius: 'var(--radius-full)', padding: '0.3rem 0.75rem',
    }}>
      <CheckCircle size={13} color="var(--color-success)" />
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)' }}>
        Notificaciones activas
      </span>
      <button
        onClick={onDisable}
        title="Desactivar notificaciones push"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-dim)', display: 'flex', alignItems: 'center',
          padding: '0',
        }}
      >
        <BellOff size={13} />
      </button>
    </div>
  );
};

export const ForegroundToast = ({ message, onDismiss }) => {
  if (!message) return null;

  const { title, body } = message.notification || {};

  return (
    <div style={{
      position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, minWidth: '280px', maxWidth: '380px',
      background: 'var(--bg-surface)',
      border: '1px solid rgba(91,141,239,0.4)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      animation: 'slideUp 0.3s ease-out',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: 'var(--radius-md)', flexShrink: 0,
        background: 'rgba(91,141,239,0.15)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)',
      }}>
        <BellRing size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          {title || 'HHWeekPlanner'}
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {body}
        </p>
      </div>
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-dim)', flexShrink: 0,
      }}>
        <X size={14} />
      </button>
    </div>
  );
};
