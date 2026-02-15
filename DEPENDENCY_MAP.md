# Module Dependency Map & Data Flow

## 📊 Dependency Graph (Who Uses What)

```
┌─────────────────────────────────────────────────────────────┐
│                      App.jsx                                 │
│            (Router & State Orchestrator)                     │
└──┬────┬────┬────┬────────────────────────────────────────────┘
   │    │    │    │
   │    │    │    └──────────────────────────┐
   │    │    │                               │
   │    │    └──────────┬──────────────────┐ │
   │    │               │                  │ │
   │    │               │                  │ │
   v    v               v                  v v
useAuth useExams    useAnalysis         useAI hook
   │       │            │                  │
   │       │            │                  └─────────────────┐
   │       │            │                                    │
   │       │            └───────────┬───────────────────┐   │
   │       │                        │                   │   │
   v       v                        v                   v   v
firebase  firestore       analysisService          aiService
 config   service                                  (+ prompt
(Auth)    (CRUD +                                   building)
          Listener)

                Components Layer:
   ┌────────────────────────────────────────────────┐
   │ AuthPage  Navbar  DashboardView  AnalyzeView   │
   │ CreateView  AIModal  StatCard  LoadingSpinner   │
   └────────────────────────────────────────────────┘
        ^        ^            ^             ^
        │        │            │             │
        └────────┴────────────┴─────────────┘
        All receive props from App.jsx handlers

                Constants & Utils:
   ┌────────────────────────────────────────────────┐
   │  appConfig.js  firebase.js  icons.js           │
   │  (Shared by all modules)                       │
   └────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Scenario 1: Authentication Flow

```
User Input (Email/Password)
         │
         v
    AuthPage Component
         │
         v
  App.jsx handleSignIn()
         │
         v
    useAuth.js signIn()
         │
         v
    Firebase Auth (API)
         │
    ┌────┴────┐
    v         v
 SUCCESS    ERROR
    │         │
    v         v
  user      error state
  object    (displayed in AuthPage)
```

### Scenario 2: Create Exam Flow

```
User Click "Buat Akun"
         │
         v
  App.jsx setView(CREATE)
         │
         v
 CreateView Component
         │
    (User fills form)
         │
         v
  App.jsx handleCreateExam()
         │
         ├─────────────────────────┐
         v                         v
generateEmptyExam()            createExam()
(testerService)                (useExams hook)
         │                         │
         v                         v
   Exam Object              Firestore API
                                   │
                                   v
                            exams state updated
                                   │
                                   v
                        DashboardView re-renders
```

### Scenario 3: Analysis Flow

```
User Click "Lihat Analisis"
         │
         v
  App.jsx handleViewAnalysis()
         │
         ├─────────────────────────┐
         v                         v
  setView(ANALYZE)         analyze(activeExam)
         │                        │
         v                        v
AnalyzeView Component      runAnalysis()
   receives:                (analysisService)
   - exam                        │
   - analysisResults      ┌──────┴──────┐
   - summary              v             v
                      iterate      calculate
                      questions    P & D values
                           │
                           v
                      setAnalysisResults()
                        (hook state)
                           │
                           v
                  AnalyzeView renders
                  analysis table
```

### Scenario 4: AI Suggestion Flow

```
User Click Brain Icon (on question)
         │
         v
  App.jsx handleGetAiSuggestion()
         │
         v
   useAI.js getSuggestion()
         │
         v
   aiService.js getAiSuggestion()
         │
         ├──────────────────────────┐
         v                          v
   buildPrompt()            Gemini API Call
   (format question)        (generateContent)
                                    │
                            ┌───────┴────────┐
                            v                v
                          SUCCESS          ERROR
                            │                │
                            v                v
                      setSuggestion()   setError()
                        (state)           (state)
                            │                │
                            v                v
                        AIModal renders    Error message shown
                      (shows suggestion)   to user
```

---

## 📦 Who Imports What

### App.jsx imports from:
```javascript
// Config
import { VIEWS, GEMINI_API_KEY } from './config/appConfig';
import { auth } from './config/firebase';

// Hooks (5 total)
import { useAuth } from './hooks/useAuth';
import { useExams } from './hooks/useExams';
import { useAnalysis } from './hooks/useAnalysis';
import { useAI } from './hooks/useAI';

// Services
import { generateTesterExam, generateEmptyExam } from './services/testerService';

// Components (all 8)
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import AnalyzeView from './components/AnalyzeView';
import CreateView from './components/CreateView';
import AIModal from './components/AIModal';
import LoadingSpinner from './components/LoadingSpinner';
```

### useAuth.js imports from:
```javascript
// React
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Config
import { auth } from '../config/firebase';
import { initializeAuth } from '../config/firebase';
```

### useExams.js imports from:
```javascript
// React
import { useState, useEffect } from 'react';

// Services
import { subscribeToExams, createExam as createExamInDb, deleteExam as deleteExamInDb } from '../services/firestoreService';

// Config
import { auth } from '../config/firebase';
```

### useAnalysis.js imports from:
```javascript
// React
import { useState } from 'react';

// Services
import { runAnalysis, getAnalysisSummary } from '../services/analysisService';
```

### useAI.js imports from:
```javascript
// React
import { useState } from 'react';

// Services
import { getAiSuggestion } from '../services/aiService';
```

### analysisService.js imports from:
```javascript
// No external imports!
// Pure business logic functions
```

### aiService.js imports from:
```javascript
// Config
import { GEMINI_API_KEY, GEMINI_ENDPOINT } from '../config/appConfig';

// Pure functions for prompt building
```

### testerService.js imports from:
```javascript
// Config
import { TESTER_CONFIG } from '../config/appConfig';

// Pure functions, no hooks
```

### firestoreService.js imports from:
```javascript
// Firebase
import { collection, query, onSnapshot, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// Config
import { db } from '../config/firebase';
import { APP_ID } from '../config/appConfig';
```

---

## 🎯 Call Chain Examples

### Example 1: Complete User Registration

```
User (UI)
    │
    └─> AuthPage (component)
         │
         └─> onClick={onSignUp}
              │
              └─> App.jsx handleSignUp()
                   │
                   └─> useAuth.js signUp()
                        │
                        └─> signUpWithEmailAndPassword() [Firebase Auth]
                             │
                             ├─→ Success: setUser(firebaseUser)
                             └─→ Error: setError(errorMessage)
                   │
                   ├─> user state updated
                   │
                   └─> App.jsx useEffect triggers
                        │
                        └─> Check isAuthenticated
                             │
                             └─> setView(DASHBOARD)
                                  │
                                  └─> DashboardView renders
```

### Example 2: Analyze Exam & Get AI Suggestion

```
User clicks exam → clicks "Lihat Analisis"
    │
    └─> App.jsx handleViewAnalysis()
         ├─> setActiveExam(exam)
         ├─> analyze(exam) [from useAnalysis hook]
         │    │
         │    └─> runAnalysis() [analysisService]
         │         │
         │         └─> setAnalysisResults(results)
         │              │
         │              └─> setView(ANALYZE)
         │
         └─> AnalyzeView renders with:
              - exam data
              - analysisResults
              - summary stats

User clicks brain icon on question:
    │
    └─> App.jsx handleGetAiSuggestion()
         │
         └─> getSuggestion(questionData) [useAI hook]
              │
              └─> getAiSuggestion() [aiService]
                   │
                   ├─> buildPrompt(questionData)
                   │
                   └─> Fetch to Gemini API
                        │
                        ├─> Success: setSuggestion(response)
                        │    │
                        │    └─> AIModal renders suggestion
                        │
                        └─> Error: setError(message)
                             │
                             └─> Show error to user
```

---

## 🔧 Module Interaction Patterns

### Pattern 1: Hook as State Manager

```javascript
// Service (pure function)
export const runAnalysis = (exam) => { ... };

// Hook (state management)
export const useAnalysis = () => {
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const analyze = (exam) => {
    const results = runAnalysis(exam);  // Call service
    setAnalysisResults(results);        // Update state
  };
  
  return { analysisResults, analyze };
};

// Component (use hook)
const MyComponent = () => {
  const { analysisResults, analyze } = useAnalysis();
  
  return (
    <button onClick={() => analyze(exam)}>
      Analyze
    </button>
  );
};
```

### Pattern 2: Service as Data Provider

```javascript
// Service (Firebase operations)
export const subscribeToExams = (userId, onData, onError) => {
  const unsubscribe = onSnapshot(query(...), onData);
  return unsubscribe;
};

// Hook (subscribe & cleanup)
export const useExams = (user) => {
  const [exams, setExams] = useState([]);
  
  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = subscribeToExams(
      user.uid,
      (data) => setExams(data),
      (err) => setError(err)
    );
    
    return () => unsubscribe();  // Cleanup
  }, [user]);
  
  return { exams };
};

// Component (use hook)
const Dashboard = () => {
  const { exams } = useExams(user);
  
  return exams.map(exam => <ExamCard key={exam.id} exam={exam} />);
};
```

### Pattern 3: Config as Shared Constants

```javascript
// Config file
export const VIEWS = {
  DASHBOARD: 'dashboard',
  ANALYZE: 'analyze',
  CREATE: 'create'
};

export const ANALYSIS_THRESHOLDS = {
  P_MIN: 0.3,
  P_MAX: 0.7,
  D_MIN: 0.2
};

// Used anywhere
import { VIEWS, ANALYSIS_THRESHOLDS } from './config/appConfig';

if (view === VIEWS.DASHBOARD) { ... }
if (pValue < ANALYSIS_THRESHOLDS.P_MIN) { ... }
```

---

## 📈 Scalability Notes

### Adding 10,000 exams to system:
```javascript
// Before (performance issue):
- Load all exams at once
- Render all exam cards

// After (with pagination):
// firestore.js
export const getExamsPaginated = (userId, pageSize = 10) => {
  const q = query(
    collection(db, `exams-${userId}`),
    limit(pageSize)
  );
  return getDocs(q);
};

// useExams.js
const useExamsPaginated = (user) => {
  const [exams, setExams] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = async () => {
    const moreExams = await getExamsPaginated(user.uid, 10);
    setExams(prev => [...prev, ...moreExams]);
  };
  
  return { exams, loadMore, hasMore };
};
```

### Adding real-time collaboration:
```javascript
// Add to firestoreService.js
export const watchExamChanges = (userId, examId, onChange) => {
  return onSnapshot(
    doc(db, `artifacts/exams/${userId}/${examId}`),
    onChange
  );
};

// Use in useExams.js
useEffect(() => {
  if (!activeExam) return;
  
  const unsubscribe = watchExamChanges(
    user.uid,
    activeExam.id,
    (change) => setActiveExam(change.data())
  );
  
  return () => unsubscribe();
}, [activeExam?.id]);
```

---

## 🐛 Debugging Tips

### To trace data flow:
```javascript
// In App.jsx, add console logs:
useEffect(() => {
  console.log('[App] View changed to:', view);
}, [view]);

useEffect(() => {
  console.log('[App] User changed:', user);
}, [user]);

useEffect(() => {
  console.log('[App] Analysis results:', analysisResults);
}, [analysisResults]);
```

### To debug hook state:
```javascript
// In useExams.js:
useEffect(() => {
  console.log('[useExams] Exams loaded:', exams);
  console.log('[useExams] Loading:', loading);
  console.log('[useExams] Error:', error);
}, [exams, loading, error]);
```

### To debug Firebase:
```javascript
// Enable Firebase logging in firebase.js:
import { enableLogging } from "firebase/database";
enableLogging(true);

// Check Firestore rules in console:
db.collection('artifacts').doc(APP_ID).collection('users')...
```

---

## 📋 Key Interfaces

### Exam Object
```javascript
{
  id: string,                     // Firestore doc ID
  title: string,                  // "Matematika Kelas 10"
  questions: [
    {
      id: number,
      text: string,
      type: "multiple-choice",
      options: string[],
      correctAnswer: string
    }
  ],
  submissions: [
    {
      studentId: string,
      studentName: string,
      answers: string[]         // ["A", "B", "C", ...]
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Analysis Result Object
```javascript
{
  questionNumber: number,
  pValue: string,              // "0.70" (Indeks Kesukaran)
  dValue: string,              // "0.30" (Daya Pembeda)
  status: string,              // "Baik" | "Terlalu Sukar" | etc
  isBad: boolean,
  correctCount: number,
  totalStudents: number
}
```

### Summary Object
```javascript
{
  totalQuestions: number,
  totalAnalyzed: number,
  questionsNeedingRevision: number,
  goodQualityQuestions: number,
  averagePValue: number,
  averageDValue: number
}
```

---

*This document is auto-generated reference for module dependencies.*
*Update this whenever adding new modules or changing imports.*
