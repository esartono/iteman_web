import { useState, useCallback } from 'react';
import { getAiSuggestion as fetchAiSuggestion } from '../services/aiService';

/**
 * Custom hook untuk mengelola AI suggestions
 * @param {string} apiKey - Gemini API key
 * @returns {Object} {suggestion, loading, error, getSuggestion, clearSuggestion}
 */
export const useAI = (apiKey) => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSuggestion = useCallback(async (questionData) => {
    try {
      setLoading(true);
      setError(null);
      setSuggestion(null);

      if (!apiKey) {
        throw new Error('Gemini API Key tidak dikonfigurasi');
      }

      const result = await fetchAiSuggestion(questionData, apiKey);
      setSuggestion(result);
      return result;
    } catch (err) {
      console.error('AI Error:', err);
      const errorMsg = err.message || 'Gagal mendapatkan saran dari AI';
      setError(errorMsg);
      setSuggestion(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const clearSuggestion = useCallback(() => {
    setSuggestion(null);
    setError(null);
  }, []);

  return {
    suggestion,
    loading,
    error,
    getSuggestion,
    clearSuggestion
  };
};
