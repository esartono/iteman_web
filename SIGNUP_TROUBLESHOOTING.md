# Troubleshooting Fitur Daftar/Signup

## Step 1: Check Browser Console
1. Open app at `http://localhost:5173`
2. Press **F12** (open DevTools)
3. Go to **Console** tab
4. Try to register with a test email
5. **Copy & paste the error messages here**

## Step 2: Check Firebase Configuration
Your current Firebase config:
```
Project ID: analissoal-ai
Auth Domain: analissoal-ai.firebaseapp.com
```

✅ = Already confirmed working
❌ = Needs setup
⚠️ = Needs verification

## Step 3: Firebase Auth - Verification Checklist

### A. Authentication Methods Enabled
1. Go to: https://console.firebase.google.com/ → analissoal-ai project
2. Click: **Authentication** (left sidebar)
3. Click: **Sign-in method** tab
4. Look for **Email/Password** provider
   - ❌ If DISABLED: Click it, enable it, save
   - ✅ If ENABLED: Good!

### B. Test Custom Claims (Optional)
If you see error `auth/operation-not-allowed`:
1. Go to: Firebase Console → Authentication → Settings
2. Look for "Anonymous Users" or similar restrictions
3. Make sure Email/Password is explicitly enabled

## Step 4: Check Firestore Security Rules (For After Signup)

1. Go to: Firebase Console → **Firestore Database** (left sidebar)
2. Click: **Rules** tab
3. Should have rules allowing authenticated users to read/write

**Minimum Security Rules** to use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

To apply these rules:
1. Click **Edit rules** in Rules tab
2. Copy the rules above
3. Click **Publish**

## Step 5: Common Errors & Solutions

### Error: `auth/operation-not-allowed`
**Cause**: Email/Password authentication not enabled
**Fix**: 
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password**
3. Save and try again

### Error: `auth/email-already-in-use`
**Cause**: Account already exists with that email
**Fix**: Use a different email for testing (e.g., test123@example.com)

### Error: `auth/weak-password`
**Cause**: Password too short
**Fix**: Use password with 6+ characters

### Error: `auth/invalid-email`
**Cause**: Invalid email format
**Fix**: Use valid email (e.g., test@example.com)

### Error: `network-request-failed` or `internal-error`
**Cause**: Network issue or Firebase timeout
**Fix**: 
1. Check internet connection
2. Refresh browser
3. Clear browser cache and cookies

### Error: `permission-denied` (after signup, when creating exam)
**Cause**: Firestore security rules not configured
**Fix**: 
1. Update Firestore security rules (see Step 4)
2. Make sure rules allow authenticated users

## Step 6: Test Signup Flow

```
1. Open http://localhost:5173
2. Click "Belum punya akun? Daftar"
3. Enter:
   - Email: testemail@example.com
   - Password: 123456
4. Click "Daftar" button
5. Wait 2-3 seconds
6. Check browser console (F12) for messages
7. Should redirect to dashboard after success
```

## Step 7: Test After Successful Signup

After signup works:
1. You should be redirected to dashboard
2. Try clicking "Data Tester" button
3. Should create demo exam with 10 questions
4. If it fails with "permission-denied": Update Firestore security rules

## Additional Debug Info

Open browser console and look for logs starting with:
- `[useAuth]` - Authentication events
- `[Firebase]` - Firebase initialization
- `[useExams]` - Exam data operations

Example successful signup log:
```
[useAuth] Attempting sign up with: testemail@example.com
[useAuth] Sign up successful: testemail@example.com
```

Example failed signup log:
```
[useAuth] Sign up error: auth/operation-not-allowed
[handleAuthError] Firebase error code: auth/operation-not-allowed
[handleAuthError] Firebase error message: [firebase_message]
```

## Need More Help?

If you need further debugging:
1. Take a screenshot of the console error
2. Tell me the exact error code (e.g., `auth/operation-not-allowed`)
3. Tell me the full error message from console
4. Tell me if error appears during signup or after

## Firebase Console Direct Links

- **Project Settings**: https://console.firebase.google.com/u/0/project/analissoal-ai/settings/general
- **Authentication**: https://console.firebase.google.com/u/0/project/analissoal-ai/authentication/users
- **Firestore**: https://console.firebase.google.com/u/0/project/analissoal-ai/firestore/home
- **Security Rules**: https://console.firebase.google.com/u/0/project/analissoal-ai/firestore/rules

To access these, make sure you're logged into the correct Google account.

---

**Next Step**: Please follow Step 1 (Check Browser Console) and tell me what error message you see!
