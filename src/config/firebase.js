import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Load Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate config
if (!firebaseConfig.apiKey) {
  console.error('[Firebase] ❌ Firebase config not properly configured');
  console.error('[Firebase] Please set VITE_FIREBASE_* variables in .env.local');
  console.error('[Firebase] Get credentials from: Firebase Console > Project Settings > Your Apps');
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('[Firebase] ✅ Firebase initialized successfully');
  console.log('[Firebase] 📱 Project:', firebaseConfig.projectId);
} catch (err) {
  console.error('[Firebase] Failed to initialize:', err);
  // Continue with default config to prevent crash
  app = initializeApp({});
}

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Inisialisasi autentikasi otomatis
export const initializeAuth = async () => {
  try {
    // Cek apakah ada custom token
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      try {
        await signInWithCustomToken(auth, __initial_auth_token);
        console.log('[Firebase] ✅ Signed in with custom token');
        return auth.currentUser;
      } catch (err) {
        console.error('[Firebase] Failed to sign in with custom token:', err);
        // Continue to anonymous sign-in as fallback
      }
    }
    
    // Fallback ke anonymous
    const result = await signInAnonymously(auth);
    console.log('[Firebase] ✅ Signed in anonymously');
    return result.user;
  } catch (err) {
    console.error('[Firebase] Failed to initialize auth:', err);
    // Return null instead of throwing
    return null;
  }
};

export default app;
