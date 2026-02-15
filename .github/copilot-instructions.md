# AnalisButir AI - Project Development Instructions

## Project Overview

AnalisButir AI adalah aplikasi React + Vite yang menganalisis kualitas soal ujian menggunakan metode kuantitatif. Aplikasi ini terintegrasi dengan Firebase untuk autentikasi dan penyimpanan data, serta Gemini AI untuk memberikan saran perbaikan soal.

## Tech Stack

- **Runtime**: Node.js v24+
- **Frontend**: React 19.2.0, Vite 8 beta
- **Styling**: Tailwind CSS 3.3.6
- **Backend**: Firebase (Authentication + Firestore)
- **UI Components**: Lucide React icons
- **Build Tool**: Vite with React plugin

## Key Features

1. **Authentication System**
   - Email/Password registration and login via Firebase Auth
   - Anonymous login for demo access
   - Custom token support for server-side auth

2. **Quantitative Analysis Engine**
   - Calculates Difficulty Index (P-Value)
   - Computes Discrimination Power (D-Value)
   - Auto-categorizes question quality
   - Real-time analysis with dropdown groups (top 27% vs bottom 27%)

3. **AI Integration**
   - Gemini 2.5 Flash API integration
   - Psychometric expert prompting
   - Question improvement suggestions
   - Custom modal UI for AI responses

4. **Test Data Generator**
   - 10-question demo set
   - 20 simulated student profiles
   - Differential difficulty patterns
   - Automatic submission generation

## Project Structure

```
c:\Users\AWAL\analisa-soal\
├── src/
│   ├── App.jsx              # Main React component (all UI + logic)
│   ├── main.jsx             # Vite entry point
│   ├── index.css            # Tailwind + global styles
│   ├── assets/              # Images and static files
│   └── App.css              # (kept but unused with Tailwind)
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS with autoprefixer
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Lock file
├── index.html               # HTML entry point
├── .github/
│   └── copilot-instructions.md  # This file
├── README.md                # User documentation
├── .gitignore               # Git ignore rules
└── eslint.config.js         # ESLint configuration

```

## Development Commands

```bash
# Install dependencies (with legacy peer deps to handle React 19 vs lucide-react)
npm install --legacy-peer-deps

# Start development server (hot module replacement)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## Critical Configuration Notes

### Firebase Setup

The app expects global variables for Firebase configuration:

```javascript
// Must be injected before React mounts
window.__firebase_config = JSON.stringify({...});
window.__app_id = "analisis-soal-v1";
window.__initial_auth_token = "optional";
```

Firebase paths are **strictly defined**:
```
/artifacts/{appId}/users/{uid}/exams/{examId}
```

### Gemini AI API

API Key must be injected at runtime:
```javascript
// src/App.jsx line ~49
const apiKey = "YOUR_GEMINI_API_KEY";
```

Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent`

## Component Architecture

### Single File Component (App.jsx)

The entire application is one monolithic component with:
- State management (useState)
- Effect hooks (useEffect) for auth & Firestore subscriptions  
- Nested component functions (AuthPage, StatCard)
- Inline HTML/CSS via Tailwind classes

### Key State Variables

```javascript
{
  user,                // Firebase user object
  authView,            // 'login' | 'signup'
  view,                // 'dashboard' | 'analyze' | 'create'
  exams,               // Array of exam objects
  activeExam,          // Currently selected exam
  loading,             // General loading state
  authLoading,         // Auth operation state
  authError,           // Auth error messages
  aiSuggestion,        // AI response text
  isAiLoading          // AI fetch state
}
```

### Analysis Functions

- `runAnalysis(exam)`: Computes P and D values for each question
- `getAiSuggestion(questionData)`: Fetches AI analysis via Gemini API
- `handleCreateTester()`: Generates demo exam with 20 students

## UI Layout

- **AuthPage**: Login/Register modal (Tailwind rounded-[2.5rem])
- **Dashboard**: Exam grid with creation buttons
- **Analyze**: Exam detail with analysis table
- **Create**: Form to create new exam
- **AI Modal**: Full-screen suggestion viewer
- **Loading Spinner**: Centered loader with blur backdrop

## Dependencies (Latest Installed)

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "firebase": "^10.7.0",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.6",
  "postcss": "^8.4.31",
  "autoprefixer": "^10.4.16"
}
```

## Common Development Tasks

### Adding a New View
1. Add case to `view` state
2. Create nested conditional in return JSX
3. Add button/navigation to trigger view change

### Modifying Database Schema
1. Edit Firestore document structure
2. Update `runAnalysis()` to match new fields
3. Test with tester data generator

### Styling Changes
All styling uses Tailwind utility classes. No CSS files needed (except index.css for @tailwind directives).

### Debugging
- Firebase errors: Check browser console
- Firestore rules: Edit in Firebase Console
- CORS issues: Verify API origins in Firebase/Gemini
- Rendering issues: Check React DevTools

## Deployment Notes

### Build Output
```bash
npm run build
# Creates: dist/ folder with optimized production build
```

### Environment Variables
Place in `.env` or inject at runtime:
- FIREBASE_CONFIG (JSON string)
- GEMINI_API_KEY
- APP_ID

### CORS Concerns
- Firebase Auth: Handles CORS automatically
- Gemini API: Callable from browser
- Firestore: Restricted by security rules

## Testing

No automated tests currently included. Manual testing:
1. Login/logout flow
2. Create exam template
3. Load tester data
4. Verify analysis calculations
5. Test AI suggestion fetch
6. Check responsive design on mobile

## Performance Optimizations

- Vite provides instant HMR
- Tailwind purges unused CSS in production
- Firebase listeners unsubscribe on unmount
- Lazy loading via view state changes

## Known Limitations & Future Work

- [ ] TypeScript migration for better DX
- [ ] Component splitting for maintainability
- [ ] Unit tests with Vitest
- [ ] API key stored securely (not hardcoded)
- [ ] Offline support with Service Workers
- [ ] Internationalization (i18n)
- [ ] Data export/import features
- [ ] Advanced analytics dashboard

## Support

For questions about this specific codebase:
1. Check README.md for user-facing documentation
2. Review App.jsx comments for code logic
3. Check Firebase console for data structure
4. Verify API quotas and credentials
