/**
 * Validate Firebase configuration
 * Shows in browser console for debugging
 */
export const validateFirebaseConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  console.log('='.repeat(60));
  console.log('🔍 FIREBASE CONFIGURATION VALIDATION');
  console.log('='.repeat(60));

  const validations = {
    'API Key': !!config.apiKey && config.apiKey.length > 10,
    'Auth Domain': !!config.authDomain && config.authDomain.includes('.firebaseapp.com'),
    'Project ID': !!config.projectId && config.projectId.length > 0,
    'Storage Bucket': !!config.storageBucket && (config.storageBucket.includes('appspot.com') || config.storageBucket.includes('firebasestorage.app')),
    'Messaging Sender ID': !!config.messagingSenderId && /^\d+$/.test(config.messagingSenderId),
    'App ID': !!config.appId && config.appId.includes(':')
  };

  let allValid = true;
  Object.entries(validations).forEach(([key, isValid]) => {
    const icon = isValid ? '✅' : '❌';
    console.log(`${icon} ${key.padEnd(25)}: ${isValid ? 'Valid' : 'INVALID'}`);
    if (!isValid) allValid = false;
  });

  console.log('='.repeat(60));
  console.log(`Overall Status: ${allValid ? '✅ ALL VALID' : '❌ SOME ISSUES'}`);
  console.log('='.repeat(60));

  if (allValid) {
    console.log(`
📱 Firebase Project: ${config.projectId}
🔑 Auth Domain: ${config.authDomain}
💾 Storage: ${config.storageBucket}
    `);
  } else {
    console.warn(`
⚠️ Some Firebase configurations are missing or invalid!
Please check your .env.local file and ensure all VITE_FIREBASE_* variables are set correctly.
    `);
  }

  console.log('='.repeat(60));

  return allValid;
};

export default validateFirebaseConfig;
