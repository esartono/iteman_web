# Firebase Configuration Guide

## Setup Firebase Project

1. **Buat Firebase Project**
   - Kunjungi [Firebase Console](https://console.firebase.google.com/)
   - Klik "Create Project"
   - Isi nama project (contoh: "analisis-soal")
   - Enable Google Analytics (opsional)

2. **Buat Web App**
   - Di Project Overview, klik ikon Web `</>`
   - Register app dengan nama "analisis-soal"
   - Copy Firebase Config yang muncul:
   ```javascript
   {
     apiKey: "AIza...",
     authDomain: "project.firebaseapp.com",
     projectId: "project-id",
     storageBucket: "project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:...",
     measurementId: "G-..."
   }
   ```

3. **Enable Authentication**
   - Di Firebase Console, buka "Authentication"
   - Klik "Get Started"
   - Enable providers:
     - Email/Password
     - Anonymous (untuk demo)

4. **Create Firestore Database**
   - Buka "Firestore Database"
   - Klik "Create Database"
   - Pilih lokasi (contoh: asia-southeast1)
   - Start in **test mode** untuk development

5. **Setup Security Rules**
   - Di Firestore, buka tab "Rules"
   - Replace dengan rules di bawah
   - Publish rules

   ```firestore
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /artifacts/{appId}/users/{uid}/exams/{document=**} {
         allow read, write: if request.auth.uid == uid;
       }
       match /users/{uid}/exams/{document=**} {
         allow read, write: if request.auth.uid == uid;
       }
     }
   }
   ```

## Configure Application

Injection pada runtime sebelum app mount (di `index.html` atau custom script):

```html
<script>
  window.__firebase_config = JSON.stringify({
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123",
  });
  
  window.__app_id = "analisis-soal-v1";
  // Optional: window.__initial_auth_token = "custom-token";
</script>
```

Atau gunakan `.env` file dan modify `src/App.jsx`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

`.env` file:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Gemini API Setup

1. **Enable Gemini API**
   - Kunjungi [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Generative Language API"

2. **Create API Key**
   - Buka "Credentials"
   - Create API Key
   - Copy key

3. **Configure in App**
   - Update `src/App.jsx` baris ~49:
   ```javascript
   const apiKey = "YOUR_GEMINI_API_KEY";
   ```
   
   Atau set di `.env`:
   ```
   VITE_GEMINI_API_KEY=your-api-key
   ```
   
   Kemudian update `App.jsx`:
   ```javascript
   const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
   ```

## Test Application

```bash
# Start dev server
npm run dev

# Open http://localhost:5173/

# Test flow:
# 1. Klik "Belum punya akun? Daftar" untuk membuat akun
# 2. Isi email dan password
# 3. Klik tombol "Gunakan Data Tester"
# 4. Tunggu data dimuat
# 5. Klik "Lihat Analisis" pada exam
# 6. Klik tombol "Tanya AI" untuk test Gemini integration
```

## Troubleshooting

### Firebase Initialization Error
```
Error: Could not parse the Firebase config
```
- Pastikan JSON format valid di `__firebase_config`
- Check console untuk melihat error lengkap
- Reload halaman setelah set config

### Anonymous Sign-in Fails
- Enable Anonymous authentication di Firebase Console
- Check Firestore rules tidak memblock anonymous user

### Gemini API Rate Limit
- Wait beberapa saat sebelum retry
- Check API quota di Google Cloud Console
- Upgrade plan jika diperlukan

### CORS Error dari Gemini API
- Gemini API seharusnya sudah support CORS
- Pastikan API key valid
- Check request format di browser DevTools

## Production Deployment

### Build for Production
```bash
npm run build
# Output: dist/ folder
```

### Deploy ke Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init Firebase project
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Environment Variables untuk Production
Set di Firebase Console atau hosting environment:
- `VITE_FIREBASE_API_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_APP_ID`

## Security Best Practices

1. **API Keys**
   - Jangan commit API keys ke repository
   - Gunakan `.env` file dan add ke `.gitignore`
   - Restrict API key di Google Cloud Console

2. **Firestore Rules**
   - Gunakan rules yang strict untuk production
   - Validate user UID sebelum allow access
   - Limit read/write operations

3. **HTTPS Only**
   - Pastikan app diakses via HTTPS saja
   - Gemini API requires HTTPS

## Contacts & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Generative AI API](https://ai.google.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
