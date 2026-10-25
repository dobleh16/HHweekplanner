import { useState, useEffect, useCallback } from 'react';
import { getMessagingInstance } from '../firebase/config';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

// ⚠️  Replace this with your VAPID key from Firebase Console:
// Firebase Console → Project Settings → Cloud Messaging → Web Push Certificates → Generate key pair
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || null;

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState(null);
  const [foregroundMessage, setForegroundMessage] = useState(null);

  // Check if push is already enabled on mount
  useEffect(() => {
    const saved = localStorage.getItem('hhplanner_push_enabled');
    if (saved === 'true' && Notification.permission === 'granted') {
      setPushEnabled(true);
    }
  }, []);

  // Listen for foreground messages (app is open)
  useEffect(() => {
    let unsubscribe = null;

    const setupForegroundListener = async () => {
      const messaging = await getMessagingInstance();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        console.log('[FCM] Foreground message:', payload);
        setForegroundMessage(payload);
        // Auto-clear after 8s
        setTimeout(() => setForegroundMessage(null), 8000);
      });
    };

    if (pushEnabled) {
      setupForegroundListener();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [pushEnabled]);

  // Save FCM token to Firestore so we can send targeted notifications
  const saveTokenToFirestore = useCallback(async (token) => {
    if (!user?.uid) return;
    try {
      await setDoc(
        doc(db, 'users', user.uid, 'pushTokens', 'web'),
        {
          token,
          platform: 'web',
          userAgent: navigator.userAgent,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('[FCM] Error saving token:', err);
    }
  }, [user?.uid]);

  // Enable push notifications
  const enablePushNotifications = useCallback(async () => {
    setPushLoading(true);
    setPushError(null);

    try {
      // 1. Check browser support
      const messaging = await getMessagingInstance();
      if (!messaging) {
        setPushError('Tu navegador no soporta notificaciones push.');
        return false;
      }

      // 2. Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setPushError('Permiso de notificaciones denegado. Actívalo en la configuración del navegador.');
        return false;
      }

      // 3. Check VAPID key
      if (!VAPID_KEY) {
        // Still mark as enabled using basic browser notifications
        setPushEnabled(true);
        localStorage.setItem('hhplanner_push_enabled', 'true');
        console.warn('[FCM] No VAPID key — using basic browser notifications only.');
        return true;
      }

      // 4. Get FCM token
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (!token) {
        setPushError('No se pudo obtener el token de notificaciones.');
        return false;
      }

      // 5. Save token to Firestore
      await saveTokenToFirestore(token);

      setPushEnabled(true);
      localStorage.setItem('hhplanner_push_enabled', 'true');
      console.log('[FCM] Push enabled, token:', token);
      return true;

    } catch (err) {
      console.error('[FCM] Error enabling push:', err);
      setPushError('Error al activar notificaciones: ' + err.message);
      return false;
    } finally {
      setPushLoading(false);
    }
  }, [saveTokenToFirestore]);

  // Disable push notifications
  const disablePushNotifications = useCallback(() => {
    setPushEnabled(false);
    localStorage.removeItem('hhplanner_push_enabled');
  }, []);

  return {
    pushEnabled,
    pushLoading,
    pushError,
    foregroundMessage,
    enablePushNotifications,
    disablePushNotifications,
  };
};
