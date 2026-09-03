import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, Dumbbell, Bell, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const { user, loginWithGoogle, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If user is already authenticated, auto redirect to Dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-base)',
      padding: '1.5rem',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(91, 141, 239, 0.12) 0%, transparent 60%)'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        {/* Logo */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--accent-primary-glow)',
          border: '1px solid var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          marginBottom: '1.25rem'
        }}>
          <Sparkles size={28} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          HHWeek<span style={{ color: 'var(--accent-primary)' }}>Planner</span>
        </h1>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '2rem' }}>
          Tu agenda personal inteligente para gestionar tareas, recordatorios, rutinas de gym y entregas de proyectos.
        </p>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          width: '100%',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Calendar size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>Agenda Semanal</span>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Dumbbell size={18} style={{ color: 'var(--cat-gym)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>Rutinas Recurrentes</span>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Bell size={18} style={{ color: 'var(--cat-reminder)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>Avisos Anticipados</span>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <ShieldCheck size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 500 }}>Privacidad Total</span>
          </div>
        </div>

        {authError && (
          <div style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {authError}
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            transition: 'transform var(--transition-fast), background-color var(--transition-fast)'
          }}
        >
          {/* Google SVG Logo */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
        </button>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '1.25rem' }}>
          Autenticación segura proporcionada por Google Firebase Auth.
        </span>
      </div>
    </div>
  );
};
