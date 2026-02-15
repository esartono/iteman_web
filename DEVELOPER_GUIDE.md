# Developer Quick Start Guide - AnalisButir AI

## Komposisi Modul (Checklist)

### ✅ Configuration (2 files)
- [x] `src/config/firebase.js` - Firebase setup dengan auth fallback
- [x] `src/config/appConfig.js` - 40+ constants dan config

### ✅ Services (4 files - Business Logic)
- [x] `src/services/analysisService.js` - P/D value calculation
- [x] `src/services/aiService.js` - Gemini API integration
- [x] `src/services/testerService.js` - Test data generator
- [x] `src/services/firestoreService.js` - Firestore CRUD

### ✅ Hooks (4 files - State Management)
- [x] `src/hooks/useAuth.js` - Authentication state
- [x] `src/hooks/useExams.js` - Exam CRUD + Firestore listener
- [x] `src/hooks/useAnalysis.js` - Analysis state
- [x] `src/hooks/useAI.js` - AI suggestion state

### ✅ Components (8 files - UI)
- [x] `src/components/AuthPage.jsx` - Login/Signup form
- [x] `src/components/Navbar.jsx` - Top navigation
- [x] `src/components/DashboardView.jsx` - Exam list
- [x] `src/components/AnalyzeView.jsx` - Analysis table
- [x] `src/components/CreateView.jsx` - Create exam form
- [x] `src/components/AIModal.jsx` - AI suggestion modal
- [x] `src/components/StatCard.jsx` - Stats widget
- [x] `src/components/LoadingSpinner.jsx` - Loading overlay

### ✅ Constants (1 file)
- [x] `src/constants/icons.js` - Lucide icons

### ✅ Main (1 file)
- [x] `src/App.jsx` - Refactored orchestrator (130 lines, was 493)

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd c:\Users\AWAL\analisa-soal
npm install --legacy-peer-deps
```
*(Note: Legacy peer deps diperlukan untuk React 19 + lucide-react compatibility)*

### 2. Configure Firebase
File yang perlu diupdate: `src/config/firebase.js`

Jika punya credentials Firebase, set di `index.html` atau environment:
```javascript
// Di index.html <head>
window.__firebase_config = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
window.__app_id = "analisis-soal-v1";
```

### 3. Configure Gemini API Key
File yang perlu diupdate: `src/config/appConfig.js` (line ~10)

```javascript
export const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || "YOUR_KEY_HERE";
```

Atau buat `.env`:
```
VITE_GEMINI_API_KEY=sk-xxxxx...
```

### 4. Start Development Server
```bash
npm run dev
```

Output:
```
  VITE v8.0.0 ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## Module Deep Dive

### Config Layer

**firebase.js** - Entry point untuk semua Firebase operations:
```javascript
// Exports:
export { auth, db, app };
export { initializeAuth };

// Digunakan oleh: useAuth, useExams, firestoreService
```

**appConfig.js** - Single source of truth untuk constants:
```javascript
// Contoh akses:
import { VIEWS, ANALYSIS_THRESHOLDS, TESTER_CONFIG } from './config/appConfig';

VIEWS.DASHBOARD      // Di App.jsx untuk routing
ANALYSIS_THRESHOLDS  // Di analysisService.js untuk quality determination
TESTER_CONFIG        // Di testerService.js untuk data generation
```

---

### Services Layer

**analysisService.js** - Quantitative analysis engine:
```javascript
// Input: Exam object dengan questions & submissions
// Output: Array of {question, pValue, dValue, status, isBad}

const results = runAnalysis({
  questions: [{id: 1, text: "...", type: "..."}],
  submissions: [{studentId: 1, answers: ["A", "B", ...]}]
});

// results[0] = {
//   questionNumber: 1,
//   pValue: "0.70",           // Indeks Kesukaran (0-1)
//   dValue: "0.30",           // Daya Pembeda (-1 to 1)  
//   status: "Baik",           // Quality status
//   isBad: false
// }
```

**aiService.js** - AI integration:
```javascript
// Call Gemini API dengan question context
const suggestion = await getAiSuggestion({
  questionNumber: 1,
  text: "Apa ibukota Indonesia?",
  options: ["Jakarta", "Bandung", "Medan"],
  pValue: "0.70",
  dValue: "0.20",
  status: "Terlalu Mudah"
}, apiKey);

// Returns: String dengan saran perbaikan soal
```

**testerService.js** - Test data:
```javascript
// Generate 10-question exam dengan 20 students
const exam = generateTesterExam();

// Atau random empty template
const newExam = generateEmptyExam("Matematika Kelas 10", 15);
```

**firestoreService.js** - Database:
```javascript
// Real-time listener
const unsubscribe = subscribeToExams(userId, 
  (exams) => console.log("Exams updated:", exams),
  (error) => console.error("Error:", error)
);

// CRUD operations
await createExam(userId, examData);
await deleteExam(userId, examId);
```

---

### Hooks Layer

**useAuth.js** - Authentication:
```javascript
const { 
  user,              // Firebase user object atau null
  loading,           // Boolean
  error,             // Error message atau null
  isAuthenticated,   // Boolean (user !== null)
  signIn,            // (email, password) => Promise
  signUp,            // (email, password) => Promise
  logOut,            // () => void
  clearError         // () => void
} = useAuth();

// Usage dalam component:
try {
  await signUp(email, password);
} catch (err) {
  console.error(error);
}
```

**useExams.js** - Exam management:
```javascript
const {
  exams,             // Array of exam objects
  loading,           // Boolean (loading dari Firestore)
  error,             // Error message atau null
  isEmpty,           // Boolean (derived)
  createExam,        // (examData) => Promise<examId>
  deleteExam,        // (examId) => Promise
  getExamById,       // (examId) => exam || null
  clearError         // () => void
} = useExams(user);

// Auto-subscribes to Firestore saat user berubah
// Unsubscribes otomatis saat component unmount
```

**useAnalysis.js** - Analysis state:
```javascript
const {
  analysisResults,   // Array of result objects
  summary,           // {totalQuestions, needsRevision, goodQuality}
  loading,           // Boolean
  analyze,           // (exam) => void
  clearAnalysis      // () => void
} = useAnalysis();

// Usage:
analyze(activeExam);
console.log(analysisResults);  // [{questionNumber: 1, pValue: "0.70", ...}]
```

**useAI.js** - AI state:
```javascript
const {
  suggestion,        // String (AI response)
  loading,           // Boolean (API loading)
  error,             // Error message
  getSuggestion,     // (questionData) => Promise
  clearSuggestion    // () => void
} = useAI(apiKey);

// Usage:
await getSuggestion({
  questionNumber: 1,
  text: "Question text",
  options: [...],
  pValue: "0.70"
});
```

---

### Components Layer

**AuthPage.jsx** - Auth form:
```javascript
<AuthPage 
  onSignIn={handleSignIn}    // (email, password) => Promise
  onSignUp={handleSignUp}    // (email, password) => Promise
  loading={authLoading}
  error={authError}
/>
```

**Navbar.jsx** - Navigation:
```javascript
<Navbar 
  user={user}                // Firebase user object
  onLogoClick={handleLogoClick}
  onLogout={handleLogout}
/>
```

**DashboardView.jsx** - Exam list:
```javascript
<DashboardView 
  exams={exams}
  loading={examsLoading}
  onCreateTester={handleCreateTester}
  onCreateNew={handleCreateNew}
  onViewAnalysis={handleViewAnalysis}
  onDelete={handleDeleteExam}
/>
```

**AnalyzeView.jsx** - Analysis table:
```javascript
<AnalyzeView 
  exam={activeExam}
  analysisResults={analysisResults}
  summary={summary}
  onBack={handleBack}
  onGetAiSuggestion={handleGetAiSuggestion}
  loadingAI={aiLoading}
/>
```

**CreateView.jsx** - Create form:
```javascript
<CreateView 
  loading={loading}
  onSubmit={handleSubmit}    // {title, questionCount} => void
  onCancel={handleCancel}
/>
```

**AIModal.jsx** - AI modal:
```javascript
{suggestion && (
  <AIModal 
    suggestion={suggestion}
    onClose={handleCloseAiModal}
  />
)}
```

---

## Common Tasks

### Task 1: Menambah Kolom di Analysis Table

**File yang diubah**: `src/components/AnalyzeView.jsx`

```javascript
// Di AnalysisRow component, tambah th dan td:
<th className="px-4 py-2">Difficulty Level</th>
...
<td className="px-4 py-2">{result.difficultyLevel}</td>
```

**File yang diubah**: `src/services/analysisService.js`

```javascript
// Di getQuestionStatus function, tambah field:
const getQuestionStatus = (pValue, dValue) => {
  ...
  return {
    status: ...,
    isBad: ...,
    difficultyLevel: pValue < 0.3 ? "Hard" : pValue > 0.7 ? "Easy" : "Medium"
  };
}
```

### Task 2: Menambah Fitur Baru (Export PDF)

1. **Buat service**: `src/services/exportService.js`
```javascript
export const exportToPDF = async (exam, analysisResults) => {
  // Implementation
};
```

2. **Buat hook**: `src/hooks/useExport.js`
```javascript
export const useExport = () => {
  const [loading, setLoading] = useState(false);
  const exportPDF = async (exam, results) => {
    setLoading(true);
    await exportToPDF(exam, results);
    setLoading(false);
  };
  return { loading, exportPDF };
};
```

3. **Gunakan di component**: `src/App.jsx`
```javascript
const { loading: exportLoading, exportPDF } = useExport();

const handleExportPDF = async () => {
  await exportPDF(activeExam, analysisResults);
};
```

4. **Tambah button**: `src/components/AnalyzeView.jsx`
```javascript
<button onClick={onExportPDF} disabled={exportLoading}>
  Export PDF
</button>
```

### Task 3: Menambah Config Variable

**File**: `src/config/appConfig.js`

```javascript
// Tambah setelah existing exports:
export const NEW_FEATURE_CONFIG = {
  setting1: "value1",
  setting2: 42
};
```

**Gunakan dimana saja**:
```javascript
import { NEW_FEATURE_CONFIG } from './config/appConfig';

console.log(NEW_FEATURE_CONFIG.setting1);
```

### Task 4: Fix Import Error

Jika ada error `Cannot find module`:

1. **Verify file exists**: `ls src/hooks/` atau `ls src/services/`
2. **Check import path case sensitivity**: Files harus exact case
3. **Check export statement**: File harus `export const` atau default export
4. **Clear node_modules**:
```bash
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## Testing Checklist

### Run Tests Manually:

1. **Login Flow**:
   - [ ] Click "Buat Akun"
   - [ ] Enter email + password
   - [ ] Click "Daftar"
   - [ ] Should navigate to dashboard

2. **Create Tester**:
   - [ ] Click "Data Tester"
   - [ ] Should see exam appear in grid
   - [ ] Should have 10 questions + 20 submissions

3. **View Analysis**:
   - [ ] Click exam
   - [ ] Click "Lihat Analisis"
   - [ ] Should show table with P/D values
   - [ ] Should show status badges

4. **Get AI Suggestion**:
   - [ ] Click brain icon pada row
   - [ ] Should fetch from Gemini API
   - [ ] Should show suggestion in modal
   - [ ] Verify API key is set

5. **Logout**:
   - [ ] Click user menu
   - [ ] Click "Logout"
   - [ ] Should show login page

---

## Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| `npm ERR! ERESOLVE unable to resolve dependency tree` | Use `npm install --legacy-peer-deps` |
| Firebase not initialized | Set `window.__firebase_config` before React mounts |
| Gemini API returns 403 | Check API key is valid in `appConfig.js` |
| Component not found error | Check file path case sensitivity |
| Firestore data not loading | Check Firebase Security Rules allow reads |
| Modal tidak close | Check `onClose` callback passed correctly |

---

## Performance Tips

1. **Memoize components** jika render expensive:
```javascript
export default React.memo(MyComponent);
```

2. **Use useCallback** di hooks untuk stable references:
```javascript
const handleClick = useCallback(() => { ... }, [dependency]);
```

3. **Lazy load modals/views** dengan React.lazy:
```javascript
const AnalyzeView = React.lazy(() => import('./AnalyzeView'));
```

4. **Optimize Firestore queries** dengan pagination:
```javascript
const q = query(collection(db, 'exams'), limit(10));
```

---

## Next Steps

1. **Verify setup works**: `npm run dev` → check no errors
2. **Configure API keys**: Firebase + Gemini
3. **Test full flow**: Login → Create Tester → Analyze → AI
4. **Deploy to production**: `npm run build` → upload dist/
5. **Monitor errors**: Check browser console

---

## Get Help

- **Firebase Issues**: Check [firebase.google.com/docs](https://firebase.google.com/docs)
- **React Issues**: Check [react.dev](https://react.dev)
- **Firestore Data**: Check [Firebase Console](https://console.firebase.google.com)
- **Gemini API**: Check [ai.google.dev](https://ai.google.dev)

---

*Last Updated: V1.0 - Fully Modular Architecture*
