import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export const DEFAULT_CATEGORIES = [
  { id: 'task', title: 'Tarea', color: '#5B8DEF', emoji: '✅', isDefault: true },
  { id: 'reminder', title: 'Recordatorio', color: '#F472B6', emoji: '🔔', isDefault: true },
  { id: 'gym', title: 'Gym / Entrenamiento', color: '#A78BFA', emoji: '💪', isDefault: true },
  { id: 'project', title: 'Entrega Proyecto', color: '#F0B429', emoji: '📁', isDefault: true },
  { id: 'custom', title: 'Personalizado', color: '#34D399', emoji: '🏷️', isDefault: true }
];

export const useCategories = () => {
  const { user } = useAuth();
  const [customCategories, setCustomCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCustomCategories([]);
      setLoading(false);
      return;
    }

    const catRef = collection(db, 'users', user.uid, 'categories');
    const q = query(catRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cats = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCustomCategories(cats);
        setLoading(false);
      },
      (err) => {
        console.error('Error al escuchar categorías:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // All categories: defaults + custom
  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...customCategories
  ];

  const addCategory = async (catData) => {
    if (!user) throw new Error('Usuario no autenticado');
    const catRef = collection(db, 'users', user.uid, 'categories');
    const docRef = await addDoc(catRef, {
      title: catData.title.trim(),
      color: catData.color || '#5B8DEF',
      emoji: catData.emoji || '🏷️',
      isDefault: false,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };

  const updateCategory = async (catId, catData) => {
    if (!user) throw new Error('Usuario no autenticado');
    const docRef = doc(db, 'users', user.uid, 'categories', catId);
    await updateDoc(docRef, {
      title: catData.title.trim(),
      color: catData.color || '#5B8DEF',
      emoji: catData.emoji || '🏷️',
      updatedAt: serverTimestamp()
    });
  };

  const deleteCategory = async (catId) => {
    if (!user) throw new Error('Usuario no autenticado');
    const docRef = doc(db, 'users', user.uid, 'categories', catId);
    await deleteDoc(docRef);
  };

  return {
    allCategories,
    customCategories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory
  };
};
