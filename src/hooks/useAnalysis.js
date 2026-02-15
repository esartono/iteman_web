import { useState, useCallback } from 'react';
import { runAdvancedAnalysis, transformExamForAnalysis } from '../services/advancedAnalysisService';
import { runAnalysis, getAnalysisSummary } from '../services/analysisService';

/**
 * Custom hook untuk mengelola analisis soal
 * Menggunakan advanced analysis (ITEMAN-like)
 * @returns {Object} {analysisResults, summary, reliability, loading, analyze}
 */
export const useAnalysis = () => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [reliability, setReliability] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = useCallback((exam) => {
    try {
      setLoading(true);
      
      if (!exam || !exam.answerKey || !exam.submissions || exam.submissions.length === 0) {
        setAnalysisResults([]);
        setSummary(null);
        setReliability(null);
        return;
      }

      // Transform exam data untuk advanced analysis
      const transformedExam = transformExamForAnalysis(exam);
      
      if (transformedExam.error) {
        console.error('Transform error:', transformedExam.error);
        setAnalysisResults([]);
        setSummary(null);
        setReliability(null);
        return;
      }

      // Run advanced analysis (ITEMAN-like)
      const analysisResult = runAdvancedAnalysis(transformedExam);

      if (analysisResult.success) {
        setAnalysisResults(analysisResult.data.questions);
        setSummary(analysisResult.data.summary);
        setReliability(analysisResult.data.reliability);
        console.log('[useAnalysis] Advanced analysis completed:', analysisResult.data);
      } else {
        console.error('Analysis failed:', analysisResult.error);
        setAnalysisResults([]);
        setSummary(null);
        setReliability(null);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisResults([]);
      setSummary(null);
      setReliability(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisResults([]);
    setSummary(null);
    setReliability(null);
  }, []);

  return {
    analysisResults,
    summary,
    reliability,
    loading,
    analyze,
    clearAnalysis
  };
};
