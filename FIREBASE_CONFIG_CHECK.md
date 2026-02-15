# ✅ Firebase Configuration Verification Checklist

**Date**: February 15, 2026  
**Status**: Checking configuration  

## 📋 Configuration Status

### ✅ Environment Variables Loaded
```
✅ VITE_FIREBASE_API_KEY: AIzaSyDVq8826VuUERKMlj3eCjqPtC7Yowddqe4 (set)
✅ VITE_FIREBASE_AUTH_DOMAIN: analissoal-ai.firebaseapp.com (set)
✅ VITE_FIREBASE_PROJECT_ID: analissoal-ai (set)
✅ VITE_FIREBASE_STORAGE_BUCKET: analissoal-ai.firebasestorage.app (set)
✅ VITE_FIREBASE_MESSAGING_SENDER_ID: 66788376682 (set)
✅ VITE_FIREBASE_APP_ID: 1:66788376682:web:2fcb4f467e43840ffbca13 (set)
```

### ⚠️ Gemini API (Optional)
```
❌ VITE_GEMINI_API_KEY: Not configured (optional)
```

---

## 🔍 How to Verify Configuration

### Step 1: Check Browser Console Logs
1. Open app: `http://localhost:5173`
2. Open DevTools: `F12` → **Console** tab
3. Look for these logs:

✅ **Success Logs** (should see these):
```
[Firebase] ✅ Firebase initialized successfully
[Firebase] 📱 Project: analissoal-ai
[useAuth] Auth state changed: anonymous
```

✅ **Validation Logs** (should see all ✅):
```
============================================================
🔍 FIREBASE CONFIGURATION VALIDATION
============================================================
✅ API Key                     : Valid
✅ Auth Domain                 : Valid
✅ Project ID                  : Valid
✅ Storage Bucket              : Valid
✅ Messaging Sender ID         : Valid
✅ App ID                      : Valid
============================================================
Overall Status: ✅ ALL VALID
============================================================
```

---

### Step 2: Verify Firestore Database Connection

Try to create an exam with "Data Tester":
1. Login (create account or use email/password)
2. Click "Data Tester" button
3. Check browser DevTools Console for Firestore operations

**Expected Success Log**:
```
[useExams] Exams loaded: [...]
```

**If Error See Below** ⬇️

---

## ❌ Troubleshooting

### Issue 1: "Firebase config not properly configured"
```
❌ [Firebase] ❌ Firebase config not properly configured
```

**Solution**:
- [ ] Check `.env.local` file exists in project root
- [ ] Verify all `VITE_FIREBASE_*` variables are filled
- [ ] Restart dev server: Stop (`Ctrl+C`) and run `npm run dev`
- [ ] Check for typos in environment variables

### Issue 2: "Failed to initialize Firebase: invalid-api-key"
```
❌ [Firebase] Failed to initialize: {... invalid-api-key ...}
```

**Solution**:
- [ ] API Key is incorrect, get correct one from Firebase Console
- [ ] Check Firebase project is created and API is enabled
- [ ] Go to: [Firebase Console](https://console.firebase.google.com) > Project Settings > Your Apps > Copy config

### Issue 3: "Gagal mengakses sistem autentikasi"
```
❌ [useAuth] Auth state listener error: {... permission-denied ...}
```

**Solution**:
- [ ] Firestore Security Rules are too restrictive
- [ ] Update rules in Firebase Console to allow test mode:

**Firebase Console** > Firestore Database > Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{uid}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
- [ ] Click **Publish**
- [ ] Try again

### Issue 4: Firestore operations fail with "Permission denied"
```
❌ [useExams] Error creating exam: {... permission-denied ...}
```

**Solution**:
- [ ] Check Firestore Rules (see Issue 3)
- [ ] Verify user is authenticated (should see email or "anonymous" in console)
- [ ] Ensure `projectId` in `.env.local` matches Firebase console

### Issue 5: "Cannot read property of undefined"
```
❌ TypeError: Cannot read property 'apiKey' of undefined
```

**Solution**:
- [ ] .env.local file is missing
- [ ] Create it with proper variables (see `.env.example`)
- [ ] Make sure you didn't delete or rename it

---

## 📱 Quick Firebase Console Checklist

Go to [Firebase Console](https://console.firebase.google.com):

- [ ] Project created: `analissoal-ai`
- [ ] Firestore Database initialized (prod or test mode)
- [ ] Authentication enabled with Email/Password provider
- [ ] Web App created and config copied correctly
- [ ] Firestore Security Rules published
- [ ] API Keys are not restricted (or restricted for web apps only)

---

## 🧪 Manual Testing

### Test 1: Create Account
```
1. Go to http://localhost:5173
2. Click "Belum punya akun? Daftar"
3. Enter email: test@example.com
4. Enter password: Test123!@#
5. Click "Daftar"
```

**Expected**: Success message and redirect to dashboard

**If Failed**:
- Check "Gagal mengakses sistem autentikasi" troubleshooting

### Test 2: Create Exam with Tester Data
```
1. (After login) Click "Data Tester" button
2. Wait 2-3 seconds
```

**Expected**: New exam appears in list with:
- Title: "Soal Ujian Tester"
- 10 questions
- 20 submissions

**Console Logs Expected**:
```
[useExams] Exams loaded: [...]
[Firestore] Successfully created exam with ID: abc123...
```

**If Failed**:
- Check "Permission denied" troubleshooting
- Check Firestore Rules are published

### Test 3: View Analysis
```
1. Click on the tester exam
2. Click "Lihat Analisis"
```

**Expected**: Analysis page with table and stats

**If Failed**:
- Check browser console for errors
- Verify analysis service is working

---

## ✨ All Systems Go! 🚀

If all checks pass:
```
✅ Firebase initialized
✅ Auth working
✅ Firestore connected
✅ Can create exams
✅ Can view analysis
```

Then your Firebase configuration is **CORRECT**! 🎉

---

## 📚 Reference

**Firebase Docs**: https://firebase.google.com/docs  
**Firestore Docs**: https://firebase.google.com/docs/firestore  
**Firebase Console**: https://console.firebase.google.com  

---

## Next Steps

1. ✅ Verify all logs in console
2. ✅ Test create account & exam
3. ✅ Get Gemini API key (optional) for AI suggestions
4. 🚀 Start using the application!

---

**Questions?** Check logs in browser console first - they usually tell you exactly what's wrong!
