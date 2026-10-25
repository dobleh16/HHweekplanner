import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEvents } from './hooks/useEvents';
import { useReminders } from './hooks/useReminders';
import { useHabits } from './hooks/useHabits';
import { useCategories } from './hooks/useCategories';
import { usePushNotifications } from './hooks/usePushNotifications';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { StatsPage } from './pages/StatsPage';
import { Login } from './pages/Login';
import { EventModal } from './components/events/EventModal';
import { HabitModal } from './components/habits/HabitModal';
import { CategoryModal } from './components/categories/CategoryModal';
import { SearchModal } from './components/ui/SearchModal';
import { NotificationToastManager } from './components/reminders/NotificationToastManager';
import { ForegroundToast } from './components/ui/PushNotificationUI';
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
  const {
    pushEnabled,
    pushLoading,
    pushError,
    foregroundMessage,
    enablePushNotifications,
    disablePushNotifications,
  } = usePushNotifications();
  const {
    habits,
    completions,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleTodayCompletion,
    isCompletedToday,
    getStreak,
    getMonthCount,
    toDateKey
  } = useHabits();
  const {
    allCategories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  // ─── Event modal state ───
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ─── Habit modal state ───
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitModalLoading, setHabitModalLoading] = useState(false);

  // ─── Category modal state ───
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryModalLoading, setCategoryModalLoading] = useState(false);

  // ─── Search modal state ───
  const [searchOpen, setSearchOpen] = useState(false);

  // ─── Event handlers ───
  const handleOpenNewEvent = (initialDate = null) => {
    let start = new Date();
    if (initialDate instanceof Date) {
      start = initialDate;
    }
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    setEditingEvent({ startDateTime: start, endDateTime: end });
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

  // ─── Habit handlers ───
  const handleOpenNewHabit = () => {
    setEditingHabit(null);
    setHabitModalOpen(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setHabitModalOpen(true);
  };

  const handleSaveHabit = async (formData) => {
    setHabitModalLoading(true);
    try {
      if (editingHabit?.id) {
        await updateHabit(editingHabit.id, formData);
      } else {
        await addHabit(formData);
      }
      setHabitModalOpen(false);
      setEditingHabit(null);
    } catch (err) {
      console.error('Error al guardar hábito:', err);
    } finally {
      setHabitModalLoading(false);
    }
  };

  const handleDeleteHabit = async () => {
    if (!editingHabit?.id) return;
    setHabitModalLoading(true);
    try {
      await deleteHabit(editingHabit.id);
      setHabitModalOpen(false);
      setEditingHabit(null);
    } catch (err) {
      console.error('Error al eliminar hábito:', err);
    } finally {
      setHabitModalLoading(false);
    }
  };

  // ─── Category handlers ───
  const handleSaveCategory = async (formData) => {
    setCategoryModalLoading(true);
    try {
      if (editingCategory?.id && !editingCategory?.isDefault) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error al guardar categoría:', err);
    } finally {
      setCategoryModalLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!editingCategory?.id) return;
    setCategoryModalLoading(true);
    try {
      await deleteCategory(editingCategory.id);
      setCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
    } finally {
      setCategoryModalLoading(false);
    }
  };

  const habitProps = {
    habits,
    onToggleHabitToday: toggleTodayCompletion,
    isHabitCompletedToday: isCompletedToday,
    getHabitStreak: getStreak,
    getHabitMonthCount: getMonthCount,
    onAddHabit: handleOpenNewHabit,
    onEditHabit: handleEditHabit
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-base)' }}>
      <Navbar
        onOpenNewEvent={() => handleOpenNewEvent()}
        onOpenSearch={() => setSearchOpen(true)}
      />

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
                pushEnabled={pushEnabled}
                pushLoading={pushLoading}
                pushError={pushError}
                onEnablePush={enablePushNotifications}
                onDisablePush={disablePushNotifications}
                {...habitProps}
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
          <Route
            path="/stats"
            element={
              <StatsPage
                rawEvents={events}
                habits={habits}
                completions={completions}
                getStreak={getStreak}
                getMonthCount={getMonthCount}
                toDateKey={toDateKey}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Event Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEvent(null); }}
        initialData={editingEvent}
        onSave={handleSaveEvent}
        onDelete={editingEvent?.id ? handleDeleteEvent : null}
        loading={modalLoading}
      />

      {/* Habit Modal */}
      <HabitModal
        isOpen={habitModalOpen}
        onClose={() => { setHabitModalOpen(false); setEditingHabit(null); }}
        initialData={editingHabit}
        onSave={handleSaveHabit}
        onDelete={editingHabit?.id ? handleDeleteHabit : null}
        loading={habitModalLoading}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => { setCategoryModalOpen(false); setEditingCategory(null); }}
        initialData={editingCategory}
        onSave={handleSaveCategory}
        onDelete={editingCategory?.id && !editingCategory?.isDefault ? handleDeleteCategory : null}
        loading={categoryModalLoading}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        events={events}
        habits={habits}
        onSelectEvent={(evt) => { handleSelectEvent(evt); }}
        allCategories={allCategories}
      />

      {/* Notification Toast Manager */}
      <NotificationToastManager
        toasts={toasts}
        onDismiss={removeToast}
      />

      {/* FCM Foreground Message Toast */}
      <ForegroundToast
        message={foregroundMessage}
        onDismiss={() => {}}
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
