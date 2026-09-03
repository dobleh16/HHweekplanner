import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export const useEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const eventsRef = collection(db, 'users', user.uid, 'events');
    const q = query(eventsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventsData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setEvents(eventsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error al escuchar eventos de Firestore:', err);
        setError('No se pudieron cargar tus eventos.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addEvent = async (eventData) => {
    if (!user) throw new Error('Usuario no autenticado');

    const startDate = new Date(eventData.startDateTime);
    const endDate = new Date(eventData.endDateTime);

    const newDoc = {
      title: eventData.title.trim(),
      description: eventData.description ? eventData.description.trim() : '',
      type: eventData.type || 'task',
      startDateTime: Timestamp.fromDate(startDate),
      endDateTime: Timestamp.fromDate(endDate),
      isRecurring: Boolean(eventData.isRecurring),
      recurrenceRule: eventData.isRecurring ? {
        frequency: 'weekly',
        daysOfWeek: eventData.daysOfWeek || [1]
      } : null,
      reminderMinutesBefore: Array.isArray(eventData.reminderMinutesBefore) 
        ? eventData.reminderMinutesBefore 
        : [15],
      category: eventData.category || eventData.type || 'task',
      completed: Boolean(eventData.completed || false),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const eventsRef = collection(db, 'users', user.uid, 'events');
    const docRef = await addDoc(eventsRef, newDoc);
    return docRef.id;
  };

  const updateEvent = async (eventId, eventData) => {
    if (!user) throw new Error('Usuario no autenticado');
    const targetId = eventData.baseEventId || eventId;

    const startDate = new Date(eventData.startDateTime);
    const endDate = new Date(eventData.endDateTime);

    const updatePayload = {
      title: eventData.title.trim(),
      description: eventData.description ? eventData.description.trim() : '',
      type: eventData.type || 'task',
      startDateTime: Timestamp.fromDate(startDate),
      endDateTime: Timestamp.fromDate(endDate),
      isRecurring: Boolean(eventData.isRecurring),
      recurrenceRule: eventData.isRecurring ? {
        frequency: 'weekly',
        daysOfWeek: eventData.daysOfWeek || [1]
      } : null,
      reminderMinutesBefore: Array.isArray(eventData.reminderMinutesBefore) 
        ? eventData.reminderMinutesBefore 
        : [15],
      category: eventData.category || eventData.type || 'task',
      completed: Boolean(eventData.completed),
      updatedAt: serverTimestamp()
    };

    const docRef = doc(db, 'users', user.uid, 'events', targetId);
    await updateDoc(docRef, updatePayload);
  };

  const deleteEvent = async (eventId, baseEventId) => {
    if (!user) throw new Error('Usuario no autenticado');
    const targetId = baseEventId || eventId;
    const docRef = doc(db, 'users', user.uid, 'events', targetId);
    await deleteDoc(docRef);
  };

  const toggleComplete = async (eventObj) => {
    if (!user) throw new Error('Usuario no autenticado');
    const targetId = eventObj.baseEventId || eventObj.id;
    const docRef = doc(db, 'users', user.uid, 'events', targetId);
    await updateDoc(docRef, {
      completed: !eventObj.completed,
      updatedAt: serverTimestamp()
    });
  };

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleComplete
  };
};
