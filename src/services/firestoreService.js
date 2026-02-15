import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
  serverTimestamp,
  getDocs,
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { APP_ID } from '../config/appConfig';

/**
 * Get reference ke collection exams untuk user tertentu
 * @param {string} userId - Firebase user ID
 * @returns {Object} Firestore collection reference
 */
export const getExamsCollection = (userId) => {
  return collection(db, 'artifacts', APP_ID, 'users', userId, 'exams');
};

/**
 * Subscribe ke perubahan daftar ujian user
 * @param {string} userId - Firebase user ID
 * @param {Function} onData - Callback ketika data berubah
 * @param {Function} onError - Callback error
 * @returns {Function} Unsubscribe function
 */
export const subscribeToExams = (userId, onData, onError) => {
  const examsRef = getExamsCollection(userId);

  return onSnapshot(
    examsRef,
    (snapshot) => {
      const exams = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      onData(exams);
    },
    (error) => {
      console.error('Error subscribing to exams:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Fetch single exam with its subcollections (questions, submissions, analysis)
 * @param {string} userId
 * @param {string} examId
 * @returns {Promise<Object>} assembled exam object
 */
export const fetchExamById = async (userId, examId) => {
  try {
    const examRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'exams', examId);
    const examSnap = await getDoc(examRef);
    if (!examSnap.exists()) return null;
    const examData = { id: examSnap.id, ...examSnap.data() };

    const questionsCol = collection(db, 'artifacts', APP_ID, 'users', userId, 'exams', examId, 'questions');
    const submissionsCol = collection(db, 'artifacts', APP_ID, 'users', userId, 'exams', examId, 'submissions');
    const analysisCol = collection(db, 'artifacts', APP_ID, 'users', userId, 'exams', examId, 'analysis');

    const [qSnap, sSnap, aSnap] = await Promise.all([
      getDocs(query(questionsCol, orderBy('index'))),
      getDocs(submissionsCol),
      getDocs(analysisCol)
    ]);

    examData.questions = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    examData.submissions = sSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    examData.analysis = aSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return examData;
  } catch (err) {
    console.error('Error fetching exam by id:', err);
    throw err;
  }
};

/**
 * Tambah ujian baru ke Firestore
 * @param {string} userId - Firebase user ID
 * @param {Object} examData - Exam object
 * @returns {Promise<string>} Document ID dari ujian yang dibuat
 */
export const createExam = async (userId, examData) => {
  try {
    const examsRef = getExamsCollection(userId);
    const examMeta = {
      title: examData.title || 'Untitled Exam',
      description: examData.description || '',
      questionCount: Array.isArray(examData.questions) ? examData.questions.length : 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      importedFromFile: !!examData.importedFromFile || false,
      meta: examData.meta || {}
    };

    const examDocRef = await addDoc(examsRef, examMeta);
    const examId = examDocRef.id;

    // Batch write questions and submissions if present
    const batch = writeBatch(db);

    if (Array.isArray(examData.questions) && examData.questions.length > 0) {
      const questionsCol = collection(db, 'artifacts', APP_ID, 'users', userId, 'exams', examId, 'questions');
      examData.questions.forEach((q, idx) => {
        const qRef = doc(questionsCol);
        batch.set(qRef, {
          index: typeof idx === 'number' ? idx : (q.index ?? 0),
          prompt: q.prompt ?? q.text ?? '',
          options: q.options ?? q.choices ?? [],
          correct: q.correct ?? q.answer ?? null,
          meta: q.meta ?? {}
        });
      });
    }

    if (Array.isArray(examData.submissions) && examData.submissions.length > 0) {
      const submissionsCol = collection(db, 'artifacts', APP_ID, 'users', userId, 'exams', examId, 'submissions');
      examData.submissions.forEach((s) => {
        const sRef = doc(submissionsCol);
        batch.set(sRef, {
          submittedAt: s.submittedAt ? s.submittedAt : serverTimestamp(),
          answers: s.answers || [],
          meta: s.meta || {}
        });
      });
    }

    await batch.commit();
    return examId;
  } catch (err) {
    console.error('Error creating exam:', err);
    throw err;
  }
};

/**
 * Hapus ujian dari Firestore
 * @param {string} userId - Firebase user ID
 * @param {string} examId - ID exam yang akan dihapus
 * @returns {Promise<void>}
 */
export const deleteExam = async (userId, examId) => {
  try {
    // Delete subcollections (questions, submissions, analysis) first
    const basePath = ['artifacts', APP_ID, 'users', userId, 'exams', examId];
    const questionsCol = collection(db, ...basePath, 'questions');
    const submissionsCol = collection(db, ...basePath, 'submissions');
    const analysisCol = collection(db, ...basePath, 'analysis');

    const [qSnap, sSnap, aSnap] = await Promise.all([
      getDocs(questionsCol),
      getDocs(submissionsCol),
      getDocs(analysisCol)
    ]);

    const batch = writeBatch(db);

    qSnap.docs.forEach(d => batch.delete(doc(db, ...basePath, 'questions', d.id)));
    sSnap.docs.forEach(d => batch.delete(doc(db, ...basePath, 'submissions', d.id)));
    aSnap.docs.forEach(d => batch.delete(doc(db, ...basePath, 'analysis', d.id)));

    // Commit deletions for subcollections
    await batch.commit();

    // Finally delete exam meta doc
    const examRef = doc(db, 'artifacts', APP_ID, 'users', userId, 'exams', examId);
    await deleteDoc(examRef);
  } catch (err) {
    console.error('Error deleting exam and subcollections:', err);
    throw err;
  }
};

/**
 * Bulk delete multiple exams
 * @param {string} userId - Firebase user ID
 * @param {Array<string>} examIds - Array of exam IDs
 * @returns {Promise<void>}
 */
export const deleteMultipleExams = async (userId, examIds) => {
  try {
    const promises = examIds.map(examId => deleteExam(userId, examId));
    await Promise.all(promises);
  } catch (err) {
    console.error('Error deleting multiple exams:', err);
    throw err;
  }
};

/**
 * Validate exam data structure
 * @param {Object} examData - Exam object to validate
 * @returns {Object} {isValid, errors}
 */
export const validateExamData = (examData) => {
  const errors = [];

  if (!examData.title || examData.title.trim() === '') {
    errors.push('Judul ujian tidak boleh kosong');
  }

  if (!Array.isArray(examData.answerKey) || examData.answerKey.length === 0) {
    errors.push('Answer key harus array dan tidak kosong');
  }

  if (!Array.isArray(examData.questions) || examData.questions.length === 0) {
    errors.push('Questions harus array dan tidak kosong');
  }

  if (examData.answerKey.length !== examData.questions.length) {
    errors.push('Jumlah soal harus sama dengan jumlah jawaban');
  }

  if (examData.submissions && !Array.isArray(examData.submissions)) {
    errors.push('Submissions harus array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
