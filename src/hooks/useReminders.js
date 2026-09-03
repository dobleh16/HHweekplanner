import { useState, useEffect, useCallback, useRef } from 'react';
import { safeToDate, formatDisplayTime } from '../utils/dateHelpers';

export const useReminders = (events = []) => {
  const [toasts, setToasts] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );
  
  // Track triggered notification keys during session to prevent repeated alerts
  const triggeredKeysRef = useRef(new Set());

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermissionGranted(permission === 'granted');
        return permission === 'granted';
      } catch (err) {
        console.error('Error al solicitar permisos de notificación:', err);
        return false;
      }
    }
    return false;
  };

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastData) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, ...toastData };
    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 active toasts

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      removeToast(id);
    }, 7000);
  }, [removeToast]);

  const checkUpcomingReminders = useCallback(() => {
    if (!events || events.length === 0) return;

    const now = new Date();
    const nowMs = now.getTime();

    events.forEach((evt) => {
      if (evt.completed) return;
      const start = safeToDate(evt.startDateTime);
      const startMs = start.getTime();

      // Skip events far in the past (> 5 minutes past start)
      if (nowMs - startMs > 5 * 60 * 1000) return;

      const reminderMinutes = evt.reminderMinutesBefore || [15];

      reminderMinutes.forEach((mins) => {
        const triggerTimeMs = startMs - mins * 60 * 1000;
        // Check window: trigger time is in the past 60s up to event start time
        const windowMarginMs = 60 * 1000;

        if (nowMs >= triggerTimeMs && nowMs <= startMs + windowMarginMs) {
          const alertKey = `${evt.id}_reminder_${mins}_${startMs}`;

          if (!triggeredKeysRef.current.has(alertKey)) {
            triggeredKeysRef.current.add(alertKey);

            const titleText = mins === 0 
              ? `¡Comienza ahora: ${evt.title}!` 
              : `Recordatorio: ${evt.title} en ${mins} min`;

            const bodyText = `Programado para las ${formatDisplayTime(start)}${evt.description ? ` — ${evt.description}` : ''}`;

            // Trigger Browser Native Notification
            if (permissionGranted && typeof window !== 'undefined' && 'Notification' in window) {
              try {
                new Notification(titleText, {
                  body: bodyText,
                  icon: '/favicon.ico',
                  tag: alertKey
                });
              } catch (e) {
                console.error('Error al mostrar notificación del navegador:', e);
              }
            }

            // Trigger In-App Toast
            addToast({
              title: titleText,
              message: bodyText,
              type: evt.type || 'reminder',
              eventId: evt.id
            });
          }
        }
      });
    });
  }, [events, permissionGranted, addToast]);

  useEffect(() => {
    checkUpcomingReminders();
    const interval = setInterval(checkUpcomingReminders, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkUpcomingReminders]);

  return {
    toasts,
    removeToast,
    permissionGranted,
    requestNotificationPermission
  };
};
