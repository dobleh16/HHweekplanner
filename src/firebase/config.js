import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB2yQL_nUuC0YsiPmXEhe5mWY_JNeW2t2E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "hhweekplanner.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "hhweekplanner",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "hhweekplanner.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "799686241392",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:799686241392:web:f255e180c0477a1fc398b5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G0LHT6W9GS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
