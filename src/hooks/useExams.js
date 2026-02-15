import { useState, useEffect } from 'react';
import { subscribeToExams, createExam as firestoreCreateExam, deleteExam as firestoreDeleteExam } from '../services/firestoreService';

/**
 * Custom hook untuk mengelola data exam
 * @param {Object} user - Firebase user object
 * @returns {Object} {exams, loading, error, createExam, deleteExam}
 */
export const useExams = (user) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Subscribe ke exams ketika user berubah
  useEffect(() => {
    if (!user) {
      setExams([]);
      return;
    }

    const unsubscribe = subscribeToExams(
      user.uid,
      (data) => {
        setExams(data);
        setError(null);
      },
      (err) => {
        console.error('Error loading exams:', err);
        setError('Gagal memuat data ujian');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createExam = async (examData) => {
    if (!user) {
      setError('User tidak ditemukan');
      throw new Error('No user');
    }

    try {
      setLoading(true);
      setError(null);
      const examId = await firestoreCreateExam(user.uid, examData);
      return examId;
    } catch (err) {
      const errorMsg = 'Gagal membuat ujian: ' + err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (examId) => {
    if (!user) {
      setError('User tidak ditemukan');
      throw new Error('No user');
    }

    try {
      setLoading(true);
      setError(null);
      await firestoreDeleteExam(user.uid, examId);
      setExams(prev => prev.filter(e => e.id !== examId));
    } catch (err) {
      const errorMsg = 'Gagal menghapus ujian: ' + err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getExamById = (examId) => {
    return exams.find(e => e.id === examId);
  };

  const clearError = () => setError(null);

  return {
    exams,
    loading,
    error,
    isEmpty: exams.length === 0,
    createExam,
    deleteExam,
    getExamById,
    clearError
  };
};
