// App ID untuk Firestore path
export const APP_ID = import.meta.env.VITE_APP_ID || 'analisis-soal-v1';

// Gemini API configuration
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';
export const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// AI System prompt
export const AI_SYSTEM_PROMPT = 'Anda adalah pakar psikometri dan evaluasi pendidikan.';

// Views
export const VIEWS = {
  AUTH: 'auth',
  DASHBOARD: 'dashboard',
  ANALYZE: 'analyze',
  CREATE: 'create'
};

// Auth Views
export const AUTH_VIEWS = {
  LOGIN: 'login',
  SIGNUP: 'signup'
};

// Analysis thresholds
export const ANALYSIS_THRESHOLDS = {
  P_DIFFICULT: 0.3,
  P_EASY: 0.7,
  D_POOR: 0.2,
  D_NEGATIVE: 0,
  GROUP_SIZE_PERCENT: 0.27
};

// Tester data config
export const TESTER_CONFIG = {
  QUESTION_COUNT: 10,
  STUDENT_COUNT: 20,
  SMART_STUDENTS: 6,
  STRUGGLING_STUDENTS: 6
};

// Default values
export const DEFAULT_VALUES = {
  EXAM_ANSWER: 'A',
  QUESTION_PREFIX: 'Soal Nomor'
};
