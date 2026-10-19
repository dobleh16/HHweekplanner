import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Trash2 } from 'lucide-react';

const PRESET_EMOJIS = ['🏷️', '🎯', '💼', '🏠', '🎓', '💰', '❤️', '🌍', '🎨', '⚽', '🍔', '🎵', '📝', '🧪', '🔧', '📦'];
const PRESET_COLORS = [
  '#5B8DEF', '#6EE7B7', '#A78BFA', '#F472B6',
  '#F0B429', '#FB923C', '#F87171', '#22D3EE',
  '#34D399', '#FBBF24', '#E879F9', '#60A5FA'
];

export const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData = null,
  loading = false
}) => {
  const isEditing = Boolean(initialData?.id && !initialData?.isDefault);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🏷️');
  const [color, setColor] = useState('#5B8DEF');

  useEffect(() => {
    setTitle(initialData?.title || '');
    setEmoji(initialData?.emoji || '🏷️');
    setColor(initialData?.color || '#5B8DEF');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, emoji, color });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
      maxWidth="420px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        {/* Emoji */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            Ícono
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {PRESET_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                style={{
                  width: '38px', height: '38px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1.2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: emoji === e ? `2px solid ${color}` : '1px solid var(--border-subtle)',
                  backgroundColor: emoji === e ? `${color}20` : 'var(--bg-base)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  transform: emoji === e ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
            Color
          </label>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: '28px', height: '28px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: c,
                  border: color === c ? '3px solid var(--text-main)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  transform: color === c ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Name */}
        <Input
          label="Nombre de la categoría"
          placeholder="Ej: Trabajo, Salud, Familia..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Preview */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-full)',
          backgroundColor: `${color}18`, border: `1px solid ${color}44`,
          color: color, fontWeight: 600, fontSize: '0.88rem'
        }}>
          <span>{emoji}</span>
          <span>{title || 'Nombre'}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
          {isEditing && onDelete && (
            <Button variant="danger" icon={Trash2} onClick={onDelete} loading={loading} type="button">
              Eliminar
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
          <Button variant="primary" type="submit" loading={loading} disabled={!title.trim()}>
            {isEditing ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
