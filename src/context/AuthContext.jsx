import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync user profile document in Firestore on authentication
  const ensureUserProfileExists = async (firebaseUser) => {
    if (!firebaseUser) return;
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(
        userRef, 
        {
          displayName: firebaseUser.displayName || 'Usuario HHWeekPlanner',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || '',
          updatedAt: serverTimestamp(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          reminderDefaults: [15, 60]
        }, 
        { merge: true }
      );
    } catch (err) {
      if (err.code === 'permission-denied') {
        console.warn(
          '⚠️ Error de permisos de Firestore: Debes publicar las reglas de Firestore en tu Firebase Console (Firestore Database > Reglas). Consulta firestore.rules en la raíz del proyecto.'
        );
      } else {
        console.error('Error al sincronizar el perfil de usuario:', err);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await ensureUserProfileExists(currentUser);
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await ensureUserProfileExists(result.user);
      return result.user;
    } catch (err) {
      console.error('Error durante Google Sign-In:', err);
      setError(err.message || 'Error al iniciar sesión con Google');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError(err.message);
    }
  };

  const value = {
    user,
    loading,
    error,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
