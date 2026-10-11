import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, firebaseReady } from '../lib/firebase.js';

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!firebaseReady) return undefined;
    return onAuthStateChanged(auth, setUser);
  }, []);

  const signIn = async () => {
    if (!firebaseReady) {
      alert('Isi konfigurasi Firebase di file .env terlebih dahulu.');
      return;
    }

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      if (error.code === 'auth/configuration-not-found') {
        alert('Firebase Authentication belum aktif atau Google provider belum dikonfigurasi di Firebase Console.');
        return;
      }

      alert(`Login gagal: ${error.message}`);
    }
  };

  const signOut = async () => {
    if (!firebaseReady) return;
    await firebaseSignOut(auth);
  };

  return {
    user,
    isAdmin: Boolean(user?.email && adminEmail && user.email === adminEmail),
    signIn,
    signOut,
  };
}
