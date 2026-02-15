# Dokumentasi Struktur Modular AnalisButir AI

## Gambaran Umum

Project telah direfactor dari monolithic `App.jsx` menjadi struktur modular yang terorganisir untuk memudahkan maintenance dan development.

## Struktur Folder

```
src/
├── App.jsx                      # Main component (clean & small)
├── main.jsx                     # Vite entry point
├── index.css                    # Global styles
│
├── config/                      # Configuration & setup
│   ├── firebase.js              # Firebase initialization
│   └── appConfig.js             # App constants & config
│
├── constants/                   # Constants
│   └── icons.js                 # Icon imports from lucide-react
│
├── services/                    # Business logic & API calls
│   ├── analysisService.js       # Quantitative analysis logic
│   ├── aiService.js             # Gemini API integration
│   ├── testerService.js         # Test data generation
│   └── firestoreService.js      # Firestore operations
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.js               # Authentication logic
│   ├── useExams.js              # Exam data management
│   ├── useAnalysis.js           # Analysis state management
│   └── useAI.js                 # AI suggestion state
│
├── components/                  # React components (reusable)
│   ├── AuthPage.jsx             # Authentication page
│   ├── Navbar.jsx               # Navigation bar
│   ├── DashboardView.jsx        # Dashboard view
│   ├── AnalyzeView.jsx          # Analysis view
│   ├── CreateView.jsx           # Create exam form
│   ├── AIModal.jsx              # AI suggestion modal
│   ├── StatCard.jsx             # Statistics card component
│   └── LoadingSpinner.jsx       # Loading spinner
│
└── utils/                       # Utility functions (optional)
    └── (untuk helper functions di masa depan)
```

## Detail Setiap Modul

### 📁 `/src/config` - Konfigurasi

#### `firebase.js`
- **Fungsi**: Firebase initialization
- **Exports**:
  - `auth` - Firebase Auth instance
  - `db` - Firestore instance  
  - `initializeAuth()` - Setup auth otomatis
  
**Digunakan oleh**: Hooks, Services

#### `appConfig.js`
- **Fungsi**: Centralized configuration & constants
- **Exports**:
  - `APP_ID` - Unique app identifier
  - `GEMINI_API_KEY` - Gemini API key
  - `VIEWS` - View constants (DASHBOARD, ANALYZE, CREATE, AUTH)
  - `AUTH_VIEWS` - Auth view constants (LOGIN, SIGNUP)
  - `ANALYSIS_THRESHOLDS` - Analysis parameters
  - `TESTER_CONFIG` - Test data configuration

**Digunakan oleh**: Services, Hooks, Components

---

### 🎯 `/src/services` - Business Logic

#### `analysisService.js`
- **Fungsi**: Quantitative exam analysis
- **Main Functions**:
  - `runAnalysis(exam)` - Compute P and D values
  - `getQuestionStatus(pValue, dValue)` - Determine question quality
  - `getAnalysisSummary(results)` - Calculate summary stats

**Digunakan oleh**: `useAnalysis` hook

#### `aiService.js`
- **Fungsi**: Gemini AI integration
- **Main Functions**:
  - `getAiSuggestion(questionData, apiKey)` - Call Gemini API
  - `buildPrompt(questionData)` - Format prompt untuk AI
  - `isValidApiKey(apiKey)` - Validate API key

**Digunakan oleh**: `useAI` hook

#### `testerService.js`
- **Fungsi**: Generate test data
- **Main Functions**:
  - `generateTesterExam()` - Generate 10-question exam + 20 students
  - `generateTesterQuestions()` - Generate questions
  - `generateStudentSubmissions(answerKey)` - Simulate student answers
  - `generateEmptyExam(title, count)` - Create empty exam template

**Digunakan oleh**: `App.jsx` handlers

#### `firestoreService.js`
- **Fungsi**: Firestore database operations
- **Main Functions**:
  - `subscribeToExams(userId, callbacks)` - Real-time exam listener
  - `createExam(userId, examData)` - Add new exam
  - `deleteExam(userId, examId)` - Delete exam
  - `validateExamData(examData)` - Validate exam structure

**Digunakan oleh**: `useExams` hook

---

### 🪝 `/src/hooks` - Custom React Hooks

#### `useAuth.js`
```javascript
const { user, loading, error, isAuthenticated, signIn, signUp, logOut, clearError } = useAuth();
```
- State: `user`, `loading`, `error`
- Methods: `signIn()`, `signUp()`, `logOut()`, `clearError()`
- Manages Firebase authentication lifecycle

#### `useExams.js`
```javascript
const { exams, loading, error, isEmpty, createExam, deleteExam, getExamById, clearError } = useExams(user);
```
- State: `exams`, `loading`, `error`
- Methods: `createExam()`, `deleteExam()`, `getExamById()`
- Subscribes to Firestore exam collection

#### `useAnalysis.js`
```javascript
const { analysisResults, summary, loading, analyze, clearAnalysis } = useAnalysis();
```
- State: `analysisResults`, `summary`, `loading`
- Methods: `analyze(exam)`, `clearAnalysis()`
- Manages analysis computation

#### `useAI.js`
```javascript
const { suggestion, loading, error, getSuggestion, clearSuggestion } = useAI(apiKey);
```
- State: `suggestion`, `loading`, `error`
- Methods: `getSuggestion()`, `clearSuggestion()`
- Manages AI API calls

---

### 🎨 `/src/components` - React Components

#### `AuthPage.jsx`
Props:
```javascript
{
  onSignIn: Function,      // (email, password) => Promise
  onSignUp: Function,      // (email, password) => Promise
  loading: Boolean,
  error: String
}
```

#### `Navbar.jsx`
Props:
```javascript
{
  user: Object,           // Firebase user object
  onLogoClick: Function,  // Navigate to dashboard
  onLogout: Function      // Logout handler
}
```

#### `DashboardView.jsx`
Props:
```javascript
{
  exams: Array,
  loading: Boolean,
  onCreateTester: Function,
  onCreateNew: Function,
  onViewAnalysis: Function,
  onDelete: Function
}
```

#### `AnalyzeView.jsx`
Props:
```javascript
{
  exam: Object,
  analysisResults: Array,
  summary: Object,
  onBack: Function,
  onGetAiSuggestion: Function,
  loadingAI: Boolean
}
```

#### `CreateView.jsx`
Props:
```javascript
{
  loading: Boolean,
  onSubmit: Function,     // {title, questionCount}
  onCancel: Function
}
```

#### `AIModal.jsx`
Props:
```javascript
{
  suggestion: String,
  onClose: Function
}
```

#### `StatCard.jsx`
Props:
```javascript
{
  label: String,
  value: Number|String,
  color: String,         // Tailwind color class
  icon: ReactNode
}
```

#### `LoadingSpinner.jsx`
Props:
```javascript
{
  message: String  // Default: 'Memuat...'
}
```

---

### 🎯 `/src/App.jsx` - Main Component

Responsibilities:
- Router (manage views)
- State orchestration
- Event handlers/callbacks
- Render main layout

**Tidak lagi berisi**:
- ❌ Authentication logic
- ❌ Firestore subscriptions
- ❌ Analysis logic
- ❌ Component definitions

---

## Flow Diagram

```
App.jsx (Router)
  ↓
  ├─→ useAuth()           → AuthPage
  │
  ├─→ useExams(user)      → DashboardView / AnalyzeView
  │
  ├─→ useAnalysis()       → AnalyzeView
  │
  └─→ useAI(apiKey)       → AIModal
```

### Data Flow Example: Create Exam

```
DashboardView
  └─→ onCreateNew()
    └─→ setView(CREATE)
      └─→ CreateView
        └─→ onSubmit()
          └─→ generateEmptyExam()     [testerService]
            └─→ createExam()          [useExams hook]
              └─→ firestoreService
                └─→ addDoc() to Firestore
```

---

## Dependency Graph

```
App.jsx
├── useAuth()
│   └── firebase.js
│       └── signInWithEmailAndPassword, createUserWithEmailAndPassword
├── useExams(user)
│   └── firestoreService.js
│       ├── subscribeToExams()
│       ├── createExam()
│       └── deleteExam()
├── useAnalysis()
│   └── analysisService.js
│       ├── runAnalysis()
│       └── getAnalysisSummary()
└── useAI(apiKey)
    └── aiService.js
        ├── getAiSuggestion()
        └── buildPrompt()

Components
├── AuthPage
├── Navbar
├── DashboardView
│   ├── StatCard
│   └── ExamCard (nested)
├── AnalyzeView
│   ├── StatCard
│   └── AnalysisRow (nested)
├── CreateView
├── AIModal
└── LoadingSpinner
```

---

## Development Guidelines

### Menambah Fitur Baru

1. **Jika butuh business logic baru**:
   - Buat file di `/src/services/`
   - Export pure functions

2. **Jika butuh state management**:
   - Buat hook di `/src/hooks/`
   - Gunakan services di dalamnya

3. **Jika butuh UI baru**:
   - Buat component di `/src/components/`
   - Accept props, tidak state

4. **Jika butuh const/config baru**:
   - Add ke `/src/config/appConfig.js`

### Best Practices

✅ **DO**:
- Keep components small and focused
- Use hooks for state management
- Put business logic in services
- Pass data via props
- Keep config centralized

❌ **DON'T**:
- Put API calls in components
- Duplicate business logic
- Mix concerns (UI + logic)
- Hardcode values
- Import firebase directly (use hooks)

### File Naming

- **Components**: `PascalCase.jsx` (e.g., `DashboardView.jsx`)
- **Hooks**: `camelCase.js` with `use` prefix (e.g., `useAuth.js`)
- **Services**: `camelCase.js` (e.g., `analysisService.js`)
- **Constants**: `camelCase.js` (e.g., `appConfig.js`)

---

## Porting Guide: Old to New

### Old Code
```javascript
// Monolithic App.jsx
const [exams, setExams] = useState([]);
const [user, setUser] = useState(null);

const runAnalysis = (exam) => { ... };
const getAiSuggestion = async (question) => { ... };
```

### New Code
```javascript
// App.jsx - Clean
const { user, loading, signIn, signUp, logOut } = useAuth();
const { exams, createExam, deleteExam } = useExams(user);
const { analysisResults, analyze } = useAnalysis();
const { suggestion, getSuggestion } = useAI(GEMINI_API_KEY);
```

---

## Testing Module

Untuk test setiap module:

```javascript
// Test useAnalysis
const { analysisResults, analyze } = useAnalysis();
analyze(mockExam);
expect(analysisResults).toHaveLength(10);

// Test analysisService
import { runAnalysis } from './services/analysisService';
const results = runAnalysis(mockExam);
expect(results[0].pValue).toBe('0.50');
```

---

## Performance Considerations

- ✅ Components re-render hanya saat data berubah
- ✅ Firestore listeners di-cleanup saat unmount
- ✅ Analysis di-cache via summary state
- ✅ Hooks tidak create new functions on every render (useCallback)

---

## Future Improvements

- [ ] Add error boundary component
- [ ] Add form validation component
- [ ] Extract table logic to separate component
- [ ] Add context API untuk global state (jika perlu)
- [ ] Add service worker untuk offline support
- [ ] Add unit tests dengan Vitest

---

## Quick Reference

| Need | Location | Function |
|------|----------|----------|
| Firebase setup | `config/firebase.js` | `initializeAuth()` |
| Create exam | `services/testerService.js` | `generateEmptyExam()` |
| Analyze questions | `services/analysisService.js` | `runAnalysis()` |
| Get AI suggestion | `services/aiService.js` | `getAiSuggestion()` |
| Manage auth state | `hooks/useAuth.js` | `useAuth()` |
| Manage exams | `hooks/useExams.js` | `useExams()` |
| Show exam list | `components/DashboardView.jsx` | `<DashboardView />` |
| Show analysis | `components/AnalyzeView.jsx` | `<AnalyzeView />` |

