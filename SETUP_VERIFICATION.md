# Project Setup & Verification Checklist

## Pre-Setup Verification

### ✅ Environment Requirements
- [ ] Node.js v24+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional)
- [ ] VS Code with Extensions ready
- [ ] Internet connection (for npm packages & APIs)

### ✅ Project Files
- [ ] Project folder: `c:\Users\AWAL\analisa-soal`
- [ ] All 20 module files created
- [ ] package.json exists
- [ ] index.html exists
- [ ] vite.config.js exists

---

## Setup Steps (Sequential)

### Step 1: Verify Project Structure

**Run in PowerShell**:
```powershell
cd c:\Users\AWAL\analisa-soal
Get-ChildItem -Recurse src/ | Where-Object {$_.Extension -eq ".jsx" -or $_.Extension -eq ".js"} | Measure-Object | Select-Object Count
```

**Expected Output**: 
```
Count
-----
   25 (includes index.css, main.jsx)
```

Or manually verify:
```
✓ src/App.jsx
✓ src/main.jsx
✓ src/index.css
✓ src/config/firebase.js
✓ src/config/appConfig.js
✓ src/services/analysisService.js
✓ src/services/aiService.js
✓ src/services/testerService.js
✓ src/services/firestoreService.js
✓ src/hooks/useAuth.js
✓ src/hooks/useExams.js
✓ src/hooks/useAnalysis.js
✓ src/hooks/useAI.js
✓ src/components/AuthPage.jsx
✓ src/components/Navbar.jsx
✓ src/components/DashboardView.jsx
✓ src/components/AnalyzeView.jsx
✓ src/components/CreateView.jsx
✓ src/components/AIModal.jsx
✓ src/components/StatCard.jsx
✓ src/components/LoadingSpinner.jsx
✓ src/constants/icons.js
```

---

### Step 2: Install Dependencies

**Run in Terminal**:
```bash
cd c:\Users\AWAL\analisa-soal
npm install --legacy-peer-deps
```

**What This Does**:
- Downloads all node_modules
- Installs React 19.2.0
- Installs Firebase 10.7.0
- Installs Tailwind CSS 3.3.6
- Installs Lucide React icons
- Installs Vite and build tools

**Expected Output**:
```
added 847 packages in 45s
```

**Troubleshooting**:
- If error: `ERESOLVE unable to resolve dependency tree`
  - Use: `npm install --legacy-peer-deps --force`
- If error: `npm ERR! code E403`
  - Check internet connection
  - Or use: `npm install --legacy-peer-deps --verbose`

---

### Step 3: Configure Firebase (Required)

**File to Edit**: `index.html`

**Find** this line (around line 15):
```html
<!-- Firebase Configuration -->
```

**Add** Firebase config before closing `</head>` tag:
```html
<script>
  window.__firebase_config = JSON.stringify({
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
  });
  window.__app_id = "analisis-soal-v1";
</script>
```

**How to Get Firebase Config**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project OR select existing
3. Go to "Project Settings" (gear icon)
4. Scroll to "Your apps" section
5. Find "Web" app
6. Copy config details to replace above

**Verification**: Check that config looks like:
```javascript
{
  apiKey: "AIzaSyD...",              // Starts with AIzaSy
  authDomain: "yyyy-firebase.com",
  projectId: "yyyy",
  storageBucket: "yyyy.appspot.com",
  appId: "1:123:web:abc"
}
```

---

### Step 4: Configure Gemini API (Optional but Recommended)

**File to Edit**: `src/config/appConfig.js`

**Find** line 10:
```javascript
export const GEMINI_API_KEY = ""; // Add your Gemini API key
```

**Replace** with your API key:
```javascript
export const GEMINI_API_KEY = "sk-your-actual-key"; // Or use process.env.VITE_GEMINI_API_KEY
```

**How to Get Gemini API Key**:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key provided
4. Paste into appConfig.js

**OR Use Environment Variable** (Recommended):

Create `.env` file in project root:
```
VITE_GEMINI_API_KEY=sk-your-key-here
```

Then update appConfig.js:
```javascript
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
```

**Verification**: API key should look like:
- Starts with `sk-` or `AIza...`
- Length: 40+ characters
- No spaces or special characters

---

### Step 5: Start Development Server

**Run in Terminal**:
```bash
npm run dev
```

**Expected Output**:
```
  VITE v8.0.0  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Open in Browser**:
- Click link or go to: `http://localhost:5173`
- Should see login page

**Troubleshooting**:
- If error: `Port 5173 already in use`
  - Run: `npm run dev -- --port 3000`
- If error: `Cannot find module`
  - Run: `npm install --legacy-peer-deps`
- If blank page with errors
  - Open DevTools (F12)
  - Check Console tab for error messages
  - Read error and search in DEVELOPER_GUIDE.md

---

## Post-Setup Verification

### ✅ Browser Console Check (F12)

**Should NOT see errors**:
- ❌ `Cannot find module ...`
- ❌ `Firebase not initialized`
- ❌ `window.__firebase_config is undefined`
- ❌ `React not found`

**Should see**: No errors, clean console

---

### ✅ Login Page Load

**Visual Check**:
- [ ] Login form visible
- [ ] "Buat Akun" option visible
- [ ] Email input field
- [ ] Password input field
- [ ] Submit button
- [ ] Logo with chart icon

**If blank or broken**:
1. Check browser console (F12)
2. Check terminal for errors
3. Verify Firebase config in index.html
4. See DEVELOPER_GUIDE.md troubleshooting

---

### ✅ Test Authentication

**Try Test 1: Sign Up**
```
1. Click "Buat Akun"
2. Enter email: test@example.com
3. Enter password: Test123!@#
4. Confirm password: Test123!@#
5. Click "Daftar"
```

**Expected**:
- ✅ New account created
- ✅ Redirect to Dashboard
- ✅ Welcome message shows email

**If error**:
- Check Firebase project has "Email/Password" auth enabled
- Go to Firebase Console → Authentication → Sign-in Methods
- Enable "Email/Password"

**Try Test 2: Login**
```
1. Use email from Test 1
2. Use password from Test 1
3. Click "Masuk"
```

**Expected**:
- ✅ Login successful
- ✅ Redirect to Dashboard

---

### ✅ Test Core Features

**Feature 1: Create Tester Data**
```
1. Click "Data Tester" button
2. Wait for 2-3 seconds
```

**Expected**:
- ✅ New exam appears in grid
- ✅ Title: "Soal Ujian Tester"
- ✅ 10 questions, 20 submissions

**Feature 2: View Analysis**
```
1. Click on tester exam card
2. Click "Lihat Analisis"
```

**Expected**:
- ✅ Analysis page loads
- ✅ Shows analysis table
- ✅ Shows 4 stat cards
- ✅ Each question has P-value and D-value

**Feature 3: Get AI Suggestion**
```
1. (Assumes you have API key configured)
2. Click brain icon on any question
3. Wait 3-5 seconds
```

**Expected**:
- ✅ Modal opens with suggestion
- ✅ Shows AI analysis in Indonesian
- ✅ Includes improvement recommendations

**If API not configured**:
- This feature will fail gracefully
- Configure API key per "Step 4" above
- Retry

---

## Verification Checklist

### Installation Verification
```
✓ npm install completed without errors
✓ node_modules folder created (>500 MB)
✓ package-lock.json updated
✓ No peer dependency warnings shown
```

### File Structure Verification
```
✓ src/config/ has 2 files
✓ src/services/ has 4 files
✓ src/hooks/ has 4 files
✓ src/components/ has 8 files
✓ src/constants/ has 1 file
✓ src/App.jsx exists and under 200 lines
```

### Configuration Verification
```
✓ index.html has __firebase_config set
✓ appConfig.js has valid GEMINI_API_KEY
✓ All import paths resolve (no red squiggles in editor)
✓ vite.config.js works (dev server starts)
```

### Runtime Verification
```
✓ Dev server starts: npm run dev works
✓ App loads in browser without errors
✓ Console has no error messages
✓ Login/signup forms render correctly
```

### Feature Verification
```
✓ Can create user account
✓ Can login with created account
✓ Can create tester data
✓ Can view analysis
✓ Can request AI suggestions (if API key set)
✓ Can logout successfully
```

---

## Build & Production

### Build for Production

**Run**:
```bash
npm run build
```

**What It Does**:
- Compiles React to production code
- Bundles and minifies all modules
- Outputs to `dist/` folder
- Creates optimized build (~150 KB)

**Expected Output**:
```
✓ 87 modules transformed

dist/index.html                0.45 kB │ gzip:   0.30 kB
dist/assets/index-Abc1Def2.js  85.12 kB │ gzip:  28.34 kB
```

### Preview Production Build

**Run**:
```bash
npm run preview
```

**What It Does**:
- Starts local server for `dist/` folder
- Tests production build locally
- Verifies everything works

---

## Environment Variables

### Optional .env File

Create `c:\Users\AWAL\analisa-soal\.env`:

```
# Gemini API Configuration
VITE_GEMINI_API_KEY=sk-your-api-key-here

# Firebase Configuration (optional if in index.html)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:123456789:web:abc

# App Configuration
VITE_APP_ID=analisis-soal-v1
```

### Reference in Code

**Update appConfig.js**:
```javascript
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
```

---

## Troubleshooting Matrix

| Problem | Solution | Docs |
|---------|----------|------|
| `npm ERR! ERESOLVE` | Use `--legacy-peer-deps` | Step 2 |
| Blank page, no errors | Check Firebase config in index.html | Step 3 |
| "Cannot find module" errors | Run `npm install` again | Step 2 |
| Port 5173 already in use | Use different port: `npm run dev -- --port 3000` | Step 5 |
| Firebase auth fails | Verify API key in Firebase project settings | Step 3 |
| AI suggestions don't work | Set GEMINI_API_KEY in appConfig.js | Step 4 |
| Hot reload not working | Restart: Stop dev server, run `npm run dev` again | Step 5 |

---

## Development Workflow

### Normal Development
```bash
# Terminal 1: Start dev server
cd c:\Users\AWAL\analisa-soal
npm run dev

# Terminal 2: Run linter (optional)
npm run lint

# Browser: Open http://localhost:5173

# Editor: Make changes (auto hot-reload)
```

### Making Changes
```
1. Edit files in src/
2. Save file (Ctrl+S)
3. Browser auto-refreshes (hot module replacement)
4. See changes instantly
5. Check browser console for errors
```

### Debugging
```
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Check React DevTools for component state
5. Check Application tab for localStorage/cookies
```

---

## Quick Commands Reference

```bash
# Install dependencies (one time)
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint (check code style)
npm run lint

# Clean up
rm -r node_modules dist
npm install
```

---

## Module File Sizes (Reference)

| Module | Size | Type |
|--------|------|------|
| src/App.jsx | 4.1 KB | Component |
| config/firebase.js | 1.2 KB | Config |
| config/appConfig.js | 1.8 KB | Config |
| services/analysisService.js | 5.2 KB | Service |
| services/aiService.js | 1.6 KB | Service |
| services/testerService.js | 4.4 KB | Service |
| services/firestoreService.js | 2.3 KB | Service |
| hooks/useAuth.js | 2.7 KB | Hook |
| hooks/useExams.js | 2.4 KB | Hook |
| hooks/useAnalysis.js | 1.1 KB | Hook |
| hooks/useAI.js | 1.5 KB | Hook |
| components/AuthPage.jsx | 3.0 KB | Component |
| components/DashboardView.jsx | 3.8 KB | Component |
| components/AnalyzeView.jsx | 4.5 KB | Component |
| components/CreateView.jsx | 2.6 KB | Component |
| components/AIModal.jsx | 1.7 KB | Component |
| components/Navbar.jsx | 1.1 KB | Component |
| components/StatCard.jsx | 0.5 KB | Component |
| components/LoadingSpinner.jsx | 0.6 KB | Component |
| constants/icons.js | 0.7 KB | Constants |
| **Total** | **~47 KB** | **20 files** |

---

## Documentation Files

After setup, read in this order:

1. **REFACTORING_SUMMARY.md** (5 min)
   - Overview of changes
   - Architecture metrics
   
2. **MODULAR_STRUCTURE.md** (10 min)
   - Folder organization
   - Module descriptions

3. **DEVELOPER_GUIDE.md** (20 min)
   - Setup instructions
   - Common tasks
   - Examples

4. **DEPENDENCY_MAP.md** (10 min)
   - How modules interact
   - Data flow diagrams
   - Call chains

---

## Getting Help

### Common Questions

**Q: Where do I add new features?**
A: See DEVELOPER_GUIDE.md "Common Tasks" section

**Q: How do I debug an issue?**
A: See DEPENDENCY_MAP.md "Debugging Tips" section

**Q: Where is the analysis algorithm?**
A: src/services/analysisService.js

**Q: How does Firebase work?**
A: See src/config/firebase.js and src/services/firestoreService.js

**Q: How do I add a new hook?**
A: See DEVELOPER_GUIDE.md "Task 2: Menambah Fitur Baru"

### Support Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Lucide React**: https://lucide.dev

---

## Success! 🎉

Once you've completed all steps:

1. ✅ Development environment is set up
2. ✅ All modules are accessible
3. ✅ App can be developed locally
4. ✅ Features can be tested
5. ✅ Code can be built for production

**Next Step**: Start developing! Pick a feature from DEVELOPER_GUIDE.md and follow the examples.

---

*Generated: Setup Verification Checklist v1.0*
*Last Updated: 2025*
