import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';

// Config & Constants
import { VIEWS, GEMINI_API_KEY } from './config/appConfig';
import { auth } from './config/firebase';
import validateFirebaseConfig from './config/validateConfig';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useExams } from './hooks/useExams';
import { useAnalysis } from './hooks/useAnalysis';
import { useAI } from './hooks/useAI';

// Services
import { generateTesterExam, generateEmptyExam, generateExamFromFile, persistExamFromFile } from './services/testerService';

// Components
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import AnalyzeView from './components/AnalyzeView';
import CreateView from './components/CreateView';
import AIModal from './components/AIModal';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * Main App Component
 * Router dan state management untuk aplikasi AnalisButir AI
 */
const App = () => {
  // Authentication
  const { user, loading: authLoading, error: authError, signIn, signUp, logOut } = useAuth();

  // Exams Management
  const { exams, loading: examsLoading, error: examsError, createExam, deleteExam } = useExams(user);

  // Analysis
  const { analysisResults, summary, reliability, analyze } = useAnalysis();

  // AI Suggestions
  const { suggestion, loading: aiLoading, getSuggestion: getAiSuggestion, clearSuggestion } = useAI(GEMINI_API_KEY);

  // UI State
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [activeExam, setActiveExam] = useState(null);
  const [createViewMode, setCreateViewMode] = useState('manual'); // 'manual' or 'upload'

  // Validate config and debug logging on mount
  useEffect(() => {
    console.log('[App] Mounted');
    validateFirebaseConfig();
    console.log('[App] User:', user?.email || 'not authenticated');
    console.log('[App] Auth loading:', authLoading);
    console.log('[App] Auth error:', authError);
  }, [user, authLoading, authError]);

  // ===== Authentication Handlers =====
  const handleSignIn = async (email, password) => {
    try {
      await signIn(email, password);
      setView(VIEWS.DASHBOARD);
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      await signUp(email, password);
      setView(VIEWS.DASHBOARD);
    } catch (err) {
      console.error('Sign up error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setView(VIEWS.DASHBOARD);
      setActiveExam(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // ===== Exam Handlers =====
  const handleCreateTester = async () => {
    try {
      const testerExam = generateTesterExam();
      await createExam(testerExam);
      alert('Data tester berhasil dibuat!');
    } catch (err) {
      alert('Gagal membuat data tester: ' + err.message);
    }
  };

  const handleCreateExam = async (formData) => {
    try {
      if (formData.fromFile) {
        // Persist imported exam into Firestore (creates subcollections)
        await persistExamFromFile(user.uid, formData.title, formData.questions, formData.answerKey);
      } else {
        // Manual entry mode
        const newExam = generateEmptyExam(formData.title, formData.questionCount);
        await createExam(newExam);
      }

      setView(VIEWS.DASHBOARD);
    } catch (err) {
      alert('Gagal membuat ujian: ' + err.message);
    }
  };

  const handleViewAnalysis = (exam) => {
    setActiveExam(exam);
    analyze(exam);
    setView(VIEWS.ANALYZE);
  };

  const handleDeleteExam = async (examId) => {
    try {
      await deleteExam(examId);
    } catch (err) {
      alert('Gagal menghapus ujian: ' + err.message);
    }
  };

  // ===== AI Handlers =====
  const handleGetAiSuggestion = async (questionData) => {
    try {
      await getAiSuggestion(questionData);
    } catch (err) {
      console.error('AI Error:', err);
    }
  };

  // ===== Navigation Handlers =====
  const handleNavigation = (newView) => {
    setView(newView);
    if (newView === VIEWS.DASHBOARD) {
      setActiveExam(null);
    }
  };

  const handleUploadCSV = () => {
    setCreateViewMode('upload');
    setView(VIEWS.CREATE);
  };

  // ===== Render: Loading State =====
  if (authLoading) {
    return <LoadingSpinner message="Menginisialisasi aplikasi..." />;
  }

  // ===== Render: Auth Page =====
  if (!user) {
    return (
      <AuthPage
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        loading={authLoading}
        error={authError}
      />
    );
  }

  // ===== Render: Main App =====
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogoClick={() => handleNavigation(VIEWS.DASHBOARD)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        {/* Dashboard View */}
        {view === VIEWS.DASHBOARD && (
          <DashboardView
            exams={exams}
            loading={examsLoading}
            onCreateTester={handleCreateTester}
            onCreateNew={() => {
              setCreateViewMode('manual');
              handleNavigation(VIEWS.CREATE);
            }}
            onUploadCSV={handleUploadCSV}
            onViewAnalysis={handleViewAnalysis}
            onDelete={handleDeleteExam}
          />
        )}

        {/* Analyze View */}
        {view === VIEWS.ANALYZE && activeExam && (
          <AnalyzeView
            exam={activeExam}
            analysisResults={analysisResults}
            summary={summary}
            reliability={reliability}
            onBack={() => handleNavigation(VIEWS.DASHBOARD)}
            onGetAiSuggestion={handleGetAiSuggestion}
            loadingAI={aiLoading}
          />
        )}

        {/* Create View */}
        {view === VIEWS.CREATE && (
          <CreateView
            loading={examsLoading}
            onSubmit={handleCreateExam}
            onCancel={() => handleNavigation(VIEWS.DASHBOARD)}
            initialMode={createViewMode}
          />
        )}
      </main>

      {/* AI Modal */}
      {suggestion && (
        <AIModal
          suggestion={suggestion}
          onClose={clearSuggestion}
        />
      )}

      {/* Loading Spinner */}
      {aiLoading && <LoadingSpinner message="AI sedang menganalisis data..." />}
    </div>
  );
};

export default App;

