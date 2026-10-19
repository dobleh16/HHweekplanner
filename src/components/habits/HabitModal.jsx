import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Target } from 'lucide-react';

const PRESET_EMOJIS = ['🏃', '💪', '📚', '💧', '🧘', '🥗', '😴', '✍️', '🎯', '🎸', '🌿', '⭐'];
const PRESET_COLORS = [
  { label: 'Azul', value: '#5B8DEF' },
  { label: 'Verde', value: '#6EE7B7' },
  { label: 'Violeta', value: '#A78BFA' },
  { label: 'Rosa', value: '#F472B6' },
  { label: 'Amarillo', value: '#F0B429' },
  { label: 'Naranja', value: '#FB923C' },
  { label: 'Rojo', value: '#F87171' },
  { label: 'Cian', value: '#22D3EE' },
];

export const HabitModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData = null,
  loading = false
}) => {
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [emoji, setEmoji] = useState(initialData?.emoji || '⭐');
  const [color, setColor] = useState(initialData?.color || '#5B8DEF');
  const [monthlyGoal, setMonthlyGoal] = useState(initialData?.monthlyGoal || '');

  React.useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setEmoji(initialData?.emoji || '⭐');
    setColor(initialData?.color || '#5B8DEF');
    setMonthlyGoal(initialData?.monthlyGoal || '');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, emoji, color, monthlyGoal });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Hábito' : 'Nuevo Hábito'}
      subtitle={isEditing ? 'Modifica tu hábito' : 'Crea un hábito para hacer seguimiento diario'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Emoji selector */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>
            Ícono
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {PRESET_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: emoji === e
                    ? `2px solid ${color}`
                    : '1px solid var(--border-subtle)',
                  backgroundColor: emoji === e ? `${color}22` : 'var(--bg-base)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  transform: emoji === e ? 'scale(1.12)' : 'scale(1)'
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Color selector */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>
            Color
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => setColor(c.value)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: c.value,
                  border: color === c.value ? '3px solid var(--text-main)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  transform: color === c.value ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <Input
          label="Nombre del hábito"
          placeholder="Ej: Correr 30 minutos, Leer 20 páginas..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <Input
          label="Descripción (opcional)"
          placeholder="¿Por qué quieres construir este hábito?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Monthly Goal */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Target size={14} style={{ color: '#FB923C' }} />
              Meta mensual (días) — opcional
            </span>
          </label>
          <input
            type="number"
            min="1"
            max="31"
            placeholder="Ej: 20 días este mes"
            value={monthlyGoal}
            onChange={(e) => setMonthlyGoal(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem',
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-main)',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
          {monthlyGoal > 0 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
              Verás una barra de progreso con tu avance hacia {monthlyGoal} días este mes.
            </p>
          )}
        </div>

        {/* Preview */}
        <div style={{
          padding: '0.9rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-base)',
          border: `1px solid ${color}55`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{
            fontSize: '1.5rem',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            backgroundColor: `${color}20`,
            flexShrink: 0
          }}>
            {emoji}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: color, fontSize: '0.95rem' }}>
              {title || 'Nombre del hábito'}
            </div>
            {description && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                {description}
              </div>
            )}
            {monthlyGoal > 0 && (
              <div style={{ fontSize: '0.78rem', color: '#FB923C', marginTop: '0.2rem' }}>
                🎯 Meta: {monthlyGoal} días / mes
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem', flexWrap: 'wrap' }}>
          {isEditing && onDelete && (
            <Button variant="danger" onClick={onDelete} loading={loading} type="button">
              Eliminar
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button variant="primary" type="submit" loading={loading} disabled={!title.trim()}>
            {isEditing ? 'Guardar cambios' : 'Crear hábito'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
