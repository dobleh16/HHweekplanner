import React from 'react';
import { Modal } from '../ui/Modal';
import { EventForm } from './EventForm';

export const EventModal = ({
  isOpen,
  onClose,
  initialData = null,
  onSave,
  onDelete,
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Evento' : 'Nuevo Evento'}
      subtitle={initialData ? 'Modifica los detalles de tu evento' : 'Agrega un compromiso, horario de gym, tarea o proyecto'}
    >
      <EventForm
        initialData={initialData}
        onSave={onSave}
        onDelete={onDelete}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};
