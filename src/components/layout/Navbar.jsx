import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar as CalendarIcon, Plus, LogOut, Sparkles, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { UserAvatar } from '../ui/UserAvatar';

export const Navbar = ({ onOpenNewEvent, onOpenSearch }) => {
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onOpenSearch]);

  return (
    <>
      {/* Main Top Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 500,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.75rem 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-primary-glow)',
                border: '1px solid var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <Sparkles size={20} />
              </div>
              <div>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  HHWeek<span style={{ color: 'var(--accent-primary)' }}>Planner</span>
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation Links */}
            <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <NavLink 
                to="/" 
                end
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-surface-hover)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/calendar"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-surface-hover)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <CalendarIcon size={17} />
                <span>Calendario</span>
              </NavLink>

              <NavLink
                to="/stats"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-surface-hover)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <span style={{ fontSize: '1rem' }}>📊</span>
                <span>Estadísticas</span>
              </NavLink>
            </nav>
          </div>

          {/* Right Section: Search + Add Button + User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search button (desktop) */}
            <button
              id="btn-global-search"
              onClick={onOpenSearch}
              className="desktop-only"
              title="Buscar (Cmd+K)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Search size={15} />
              <span>Buscar</span>
              <kbd style={{
                padding: '0.1rem 0.35rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'monospace',
                color: 'var(--text-dim)'
              }}>⌘K</kbd>
            </button>

            <div className="desktop-only">
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={onOpenNewEvent}
              >
                Nuevo Evento
              </Button>
            </div>

            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}>
                <UserAvatar user={user} size={34} />
                
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }} className="truncate desktop-only">
                  {user.displayName || user.email}
                </span>

                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  style={{
                    color: 'var(--text-muted)',
                    padding: '0.4rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color var(--transition-fast)'
                  }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-only" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0.5rem 0.75rem',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
      }}>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
            textDecoration: 'none'
          })}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        {/* Mobile search button */}
        <button
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <Search size={20} />
          <span>Buscar</span>
        </button>

        <button
          onClick={onOpenNewEvent}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--accent-primary-glow)',
            transform: 'translateY(-8px)',
            border: '3px solid var(--bg-base)',
            cursor: 'pointer'
          }}
          aria-label="Nuevo Evento"
        >
          <Plus size={24} />
        </button>

        <NavLink
          to="/stats"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
            textDecoration: 'none'
          })}
        >
          <CalendarIcon size={20} />
          <span>Stats</span>
        </NavLink>

        <NavLink
          to="/calendar"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
            textDecoration: 'none'
          })}
        >
          <CalendarIcon size={20} />
          <span>Calendario</span>
        </NavLink>
      </nav>
    </>
  );
};
