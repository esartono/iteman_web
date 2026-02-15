import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, initializeAuth } from '../config/firebase';

/**
 * Custom hook untuk mengelola authentication
 * @returns {Object} {user, loading, error, signIn, signUp, logOut}
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await initializeAuth();
        if (!result) {
          console.warn('[useAuth] No user from initializeAuth, will wait for auth state');
        }
      } catch (err) {
        console.error('[useAuth] Auth initialization error:', err);
        // Don't set error here, let onAuthStateChanged handle it
        // This prevents blocking the UI
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log('[useAuth] Auth state changed:', currentUser?.email || 'anonymous');
        setUser(currentUser);
        setLoading(false);
      }, (error) => {
        console.error('[useAuth] Auth state listener error:', error);
        setError('Gagal mengakses sistem autentikasi');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error('[useAuth] Failed to setup auth listener:', err);
      setLoading(false);
      return () => {};
    }
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      return result.user;
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log('[useAuth] Attempting sign up with:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[useAuth] Sign up successful:', result.user.email);
      setUser(result.user);
      return result.user;
    } catch (err) {
      console.error('[useAuth] Sign up error:', err.code, err.message);
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      const errorMessage = handleAuthError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    logOut,
    clearError
  };
};

/**
 * Convert Firebase auth error ke pesan yang user-friendly
 * @param {Error} error - Firebase error
 * @returns {string} User-friendly error message
 */
const handleAuthError = (error) => {
  const errorMap = {
    'auth/user-not-found': 'Email tidak terdaftar',
    'auth/wrong-password': 'Password salah',
    'auth/email-already-in-use': 'Email sudah terdaftar',
    'auth/weak-password': 'Password harus minimal 6 karakter',
    'auth/invalid-email': 'Format email tidak valid',
    'auth/operation-not-allowed': 'Operasi tidak diizinkan',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Coba lagi nanti',
    'auth/network-request-failed': 'Koneksi internet tidak stabil',
    'auth/internal-error': 'Kesalahan server. Coba lagi nanti'
  };

  console.error('[handleAuthError] Firebase error code:', error.code);
  console.error('[handleAuthError] Firebase error message:', error.message);
  
  return errorMap[error.code] || `Gagal melakukan autentikasi. (${error.code}) Silakan coba lagi.`;
};
