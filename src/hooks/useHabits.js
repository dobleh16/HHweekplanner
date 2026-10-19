import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

/** Formats a Date to 'YYYY-MM-DD' string (local time) */
const toDateKey = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Returns array of 'YYYY-MM-DD' strings for the current month (up to today) */
const getDaysInCurrentMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = [];
  for (let d = 1; d <= today.getDate(); d++) {
    days.push(toDateKey(new Date(year, month, d)));
  }
  return days;
};

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({}); // { habitId: Set<'YYYY-MM-DD'> }
  const [loading, setLoading] = useState(true);

  // Listen to habits collection
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setCompletions({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const habitsRef = collection(db, 'users', user.uid, 'habits');
    const q = query(habitsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const habitsData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setHabits(habitsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error al escuchar hábitos:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Listen to ALL completions for each habit (no month filter — needed for multi-month streaks)
  useEffect(() => {
    if (!user || habits.length === 0) return;

    const unsubscribers = habits.map((habit) => {
      const completionsRef = collection(
        db,
        'users',
        user.uid,
        'habits',
        habit.id,
        'completions'
      );

      return onSnapshot(completionsRef, (snapshot) => {
        const allDates = new Set(snapshot.docs.map((d) => d.id));
        setCompletions((prev) => ({ ...prev, [habit.id]: allDates }));
      });
    });

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [user, habits]);

  /** Create a new habit */
  const addHabit = async (habitData) => {
    if (!user) throw new Error('Usuario no autenticado');
    const habitsRef = collection(db, 'users', user.uid, 'habits');
    const docRef = await addDoc(habitsRef, {
      title: habitData.title.trim(),
      description: habitData.description ? habitData.description.trim() : '',
      emoji: habitData.emoji || '⭐',
      color: habitData.color || 'var(--accent-primary)',
      monthlyGoal: habitData.monthlyGoal ? Number(habitData.monthlyGoal) : 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  };

  /** Update an existing habit */
  const updateHabit = async (habitId, habitData) => {
    if (!user) throw new Error('Usuario no autenticado');
    const docRef = doc(db, 'users', user.uid, 'habits', habitId);
    await updateDoc(docRef, {
      title: habitData.title.trim(),
      description: habitData.description ? habitData.description.trim() : '',
      emoji: habitData.emoji || '⭐',
      color: habitData.color || 'var(--accent-primary)',
      monthlyGoal: habitData.monthlyGoal ? Number(habitData.monthlyGoal) : 0,
      updatedAt: serverTimestamp()
    });
  };

  /** Delete a habit and all its completions */
  const deleteHabit = async (habitId) => {
    if (!user) throw new Error('Usuario no autenticado');
    const docRef = doc(db, 'users', user.uid, 'habits', habitId);
    await deleteDoc(docRef);
  };

  /** Toggle today's completion for a habit */
  const toggleTodayCompletion = async (habitId) => {
    if (!user) throw new Error('Usuario no autenticado');
    const todayKey = toDateKey(new Date());
    const completionRef = doc(
      db,
      'users',
      user.uid,
      'habits',
      habitId,
      'completions',
      todayKey
    );

    const snap = await getDoc(completionRef);
    if (snap.exists()) {
      await deleteDoc(completionRef);
    } else {
      await setDoc(completionRef, { completedAt: serverTimestamp() });
    }
  };

  /** Check if a habit was completed on a specific date key */
  const isCompletedOn = (habitId, dateKey) => {
    return completions[habitId]?.has(dateKey) ?? false;
  };

  /** Check if habit is completed today */
  const isCompletedToday = (habitId) => {
    return isCompletedOn(habitId, toDateKey(new Date()));
  };

  /** Calculate current streak (consecutive days ending today or yesterday) */
  const getStreak = (habitId) => {
    const completed = completions[habitId];
    if (!completed || completed.size === 0) return 0;

    let streak = 0;
    const today = new Date();
    // Use completed.size as the upper bound — the streak can never exceed
    // the total number of completions stored, so this is always sufficient
    const maxDays = completed.size + 1; // +1 to account for today not yet checked

    for (let i = 0; i < maxDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toDateKey(d);
      if (completed.has(key)) {
        streak++;
      } else {
        // Allow missing today (if not yet checked in today)
        if (i === 0) continue;
        break;
      }
    }
    return streak;
  };


  /** Count completions in current month */
  const getMonthCount = (habitId) => {
    const completed = completions[habitId];
    if (!completed) return 0;
    const days = getDaysInCurrentMonth();
    return days.filter((d) => completed.has(d)).length;
  };

  return {
    habits,
    loading,
    completions,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleTodayCompletion,
    isCompletedToday,
    isCompletedOn,
    getStreak,
    getMonthCount,
    toDateKey
  };
};
