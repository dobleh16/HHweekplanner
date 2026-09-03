import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEvents } from './hooks/useEvents';
import { useReminders } from './hooks/useReminders';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { Login } from './pages/Login';
import { EventModal } from './components/events/EventModal';
import { NotificationToastManager } from './components/reminders/NotificationToastManager';
import { parseNaturalLanguageEvent } from './utils/assistantParser';
import { setHours, setMinutes } from 'date-fns';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-base)',
        color: 'var(--text-muted)'
      }}>
        Cargando HHWeekPlanner...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const MainAppLayout = () => {
  const { events, addEvent, updateEvent, deleteEvent, toggleComplete } = useEvents();
  const { toasts, removeToast, permissionGranted, requestNotificationPermission } = useReminders(events);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const handleOpenNewEvent = (initialDate = null) => {
    let start = new Date();
    if (initialDate instanceof Date) {
      start = initialDate;
    }
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    setEditingEvent({
      startDateTime: start,
      endDateTime: end
    });
    setModalOpen(true);
  };

  const handleQuickCreate = (inputStr) => {
    const parsedEvent = parseNaturalLanguageEvent(inputStr);
    setEditingEvent(parsedEvent);
    setModalOpen(true);
  };

  const handleSelectSlot = (dayDate, hour) => {
    const slotStart = setMinutes(setHours(dayDate, hour), 0);
    handleOpenNewEvent(slotStart);
  };

  const handleSelectEvent = (eventObj) => {
    setEditingEvent(eventObj);
    setModalOpen(true);
  };

  const handleSaveEvent = async (formData) => {
    setModalLoading(true);
    try {
      if (editingEvent && editingEvent.id && !editingEvent.isVirtual) {
        await updateEvent(editingEvent.id, formData);
      } else if (editingEvent && editingEvent.isVirtual && editingEvent.baseEventId) {
        await updateEvent(editingEvent.baseEventId, formData);
      } else {
        await addEvent(formData);
      }
      setModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Error al guardar evento:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEvent) return;
    setModalLoading(true);
    try {
      await deleteEvent(editingEvent.id, editingEvent.baseEventId);
      setModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      console.error('Error al eliminar evento:', err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
      <Navbar onOpenNewEvent={() => handleOpenNewEvent()} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                rawEvents={events}
                onSelectEvent={handleSelectEvent}
                onToggleComplete={toggleComplete}
                onOpenNewEvent={() => handleOpenNewEvent()}
                onQuickCreate={handleQuickCreate}
                onRequestPermission={requestNotificationPermission}
                permissionGranted={permissionGranted}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <CalendarPage
                rawEvents={events}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onOpenNewEvent={() => handleOpenNewEvent()}
                onToggleComplete={toggleComplete}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        initialData={editingEvent}
        onSave={handleSaveEvent}
        onDelete={editingEvent?.id ? handleDeleteEvent : null}
        loading={modalLoading}
      />

      {/* Notification Toast Manager */}
      <NotificationToastManager
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainAppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
