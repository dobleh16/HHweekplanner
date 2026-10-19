import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { Select } from '../ui/Select';
import { safeToDate } from '../../utils/dateHelpers';
import { Trash2, Calendar, Clock, Bell, CheckSquare } from 'lucide-react';

const TYPE_OPTIONS = [
  { value: 'task', label: 'Tarea' },
  { value: 'reminder', label: 'Recordatorio' },
  { value: 'gym', label: 'Gym / Horario Fijo Recurrente' },
  { value: 'project', label: 'Entrega de Proyecto' },
  { value: 'custom', label: 'Personalizado' }
];

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Todos los días' },
  { value: 'weekly', label: 'Semanal (días elegidos)' },
  { value: 'biweekly', label: 'Cada 2 semanas' },
  { value: 'monthly', label: 'Mensual (mismo día)' }
];

const REMINDER_OPTIONS = [
  { value: '0', label: 'A la hora del evento' },
  { value: '15', label: '15 minutos antes' },
  { value: '30', label: '30 minutos antes' },
  { value: '60', label: '1 hora antes' },
  { value: '1440', label: '1 día antes' }
];

const DAYS_OF_WEEK = [
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mié' },
  { id: 4, label: 'Jue' },
  { id: 5, label: 'Vie' },
  { id: 6, label: 'Sáb' },
  { id: 7, label: 'Dom' }
];

const toDateTimeLocal = (date) => {
  const d = safeToDate(date);
  return format(d, "yyyy-MM-dd'T'HH:mm");
};

export const EventForm = ({
  initialData = null,
  onSave,
  onDelete,
  onCancel,
  loading = false
}) => {
  const defaultStart = initialData?.startDateTime ? toDateTimeLocal(initialData.startDateTime) : toDateTimeLocal(new Date());
  const defaultEnd = initialData?.endDateTime ? toDateTimeLocal(initialData.endDateTime) : toDateTimeLocal(new Date(Date.now() + 60 * 60 * 1000));

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState(initialData?.type || 'task');
  const [startDateTime, setStartDateTime] = useState(defaultStart);
  const [endDateTime, setEndDateTime] = useState(defaultEnd);
  const [isRecurring, setIsRecurring] = useState(initialData?.isRecurring || false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(
    initialData?.recurrenceRule?.frequency || 'weekly'
  );
  const [daysOfWeek, setDaysOfWeek] = useState(
    initialData?.recurrenceRule?.daysOfWeek || [1, 3, 5]
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(
    initialData?.recurrenceRule?.endDate || ''
  );
  const [reminderMinutes, setReminderMinutes] = useState(
    initialData?.reminderMinutesBefore?.[0]?.toString() || '15'
  );
  const [completed, setCompleted] = useState(initialData?.completed || false);
  const [errors, setErrors] = useState({});

  // Auto set recurring default to true if Gym selected
  useEffect(() => {
    if (type === 'gym' && !initialData) {
      setIsRecurring(true);
    }
  }, [type, initialData]);

  const toggleDay = (dayId) => {
    if (daysOfWeek.includes(dayId)) {
      if (daysOfWeek.length > 1) {
        setDaysOfWeek(daysOfWeek.filter((d) => d !== dayId));
      }
    } else {
      setDaysOfWeek([...daysOfWeek, dayId].sort());
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (isNaN(start.getTime())) {
      newErrors.startDateTime = 'Fecha de inicio inválida';
    }
    if (isNaN(end.getTime())) {
      newErrors.endDateTime = 'Fecha de fin inválida';
    } else if (end < start) {
      newErrors.endDateTime = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      title,
      description,
      type,
      startDateTime: new Date(startDateTime).toISOString(),
      endDateTime: new Date(endDateTime).toISOString(),
      isRecurring,
      recurrenceFrequency,
      daysOfWeek: isRecurring ? daysOfWeek : null,
      recurrenceEndDate: isRecurring && recurrenceEndDate ? recurrenceEndDate : null,
      reminderMinutesBefore: [parseInt(reminderMinutes, 10)],
      completed
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title */}
      <Input
        label="Título del evento *"
        placeholder="Ej. Sesión de Gym, Entrega Proyecto React..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        autoFocus
      />

      {/* Type & Category */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Select
          label="Tipo de evento"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <Select
          label="Recordatorio anticipado"
          options={REMINDER_OPTIONS}
          value={reminderMinutes}
          onChange={(e) => setReminderMinutes(e.target.value)}
        />
      </div>

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Input
          label="Fecha y hora de inicio"
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          error={errors.startDateTime}
          icon={Calendar}
        />
        <Input
          label="Fecha y hora de fin"
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          error={errors.endDateTime}
          icon={Clock}
        />
      </div>

      {/* Description */}
      <TextArea
        label="Descripción (opcional)"
        placeholder="Detalles adicionales, enlaces o notas..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
      />

      {/* Recurrence Switch */}
      <div style={{
        backgroundColor: 'var(--bg-base)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>Horario Recurrente</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Repetir en intervalos regulares</p>
          </div>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
          />
        </div>

        {isRecurring && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Frequency Selector */}
            <Select
              label="Frecuencia"
              options={FREQUENCY_OPTIONS}
              value={recurrenceFrequency}
              onChange={(e) => setRecurrenceFrequency(e.target.value)}
            />

            {/* Days of week (only for weekly / biweekly) */}
            {(recurrenceFrequency === 'weekly' || recurrenceFrequency === 'biweekly') && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Días de la semana
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {DAYS_OF_WEEK.map((day) => {
                    const active = daysOfWeek.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDay(day.id)}
                        style={{
                          flex: '1 1 auto',
                          minWidth: '40px',
                          padding: '0.4rem 0',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: active ? 'var(--accent-primary)' : 'var(--bg-surface)',
                          color: active ? '#FFFFFF' : 'var(--text-muted)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* End date of recurrence */}
            <Input
              label="Fecha de fin (opcional)"
              type="date"
              value={recurrenceEndDate}
              onChange={(e) => setRecurrenceEndDate(e.target.value)}
              helperText="Si no defines una fecha de fin, la recurrencia es indefinida."
            />
          </div>
        )}
      </div>

      {/* Completed toggle for existing items */}
      {initialData && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            id="completed-checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-success)' }}
          />
          <label htmlFor="completed-checkbox" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
            Marcar como completado
          </label>
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: onDelete ? 'space-between' : 'flex-end',
        gap: '0.75rem',
        marginTop: '0.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={onDelete}
            loading={loading}
          >
            Eliminar
          </Button>
        )}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {initialData ? 'Guardar Cambios' : 'Crear Evento'}
          </Button>
        </div>
      </div>
    </form>
  );
};
