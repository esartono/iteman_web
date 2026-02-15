import { ANALYSIS_THRESHOLDS } from '../config/appConfig';

/**
 * Jalankan analisis kuantitatif soal
 * @param {Object} exam - Exam data dengan answerKey, submissions, questions
 * @returns {Array} Array of analysis results per question
 */
export const runAnalysis = (exam) => {
  const { answerKey, submissions, questions } = exam;
  
  if (!submissions || submissions.length === 0) {
    return [];
  }

  const totalStudents = submissions.length;
  
  // Hitung skor setiap siswa
  const studentsWithScores = submissions.map(submission => {
    let score = 0;
    submission.answers.forEach((answer, idx) => {
      if (answer === answerKey[idx]) score++;
    });
    return { ...submission, totalScore: score };
  }).sort((a, b) => b.totalScore - a.totalScore);

  // Tentukan ukuran grup (27% dari total siswa)
  const groupSize = Math.max(1, Math.round(totalStudents * ANALYSIS_THRESHOLDS.GROUP_SIZE_PERCENT));
  const upperGroup = studentsWithScores.slice(0, groupSize);
  const lowerGroup = studentsWithScores.slice(-groupSize);

  // Analisis setiap soal
  return answerKey.map((key, idx) => {
    // Hitung jawaban yang benar
    const correctTotal = submissions.filter(s => s.answers[idx] === key).length;
    const upperCorrect = upperGroup.filter(s => s.answers[idx] === key).length;
    const lowerCorrect = lowerGroup.filter(s => s.answers[idx] === key).length;

    // Hitung P-Value (Indeks Kesukaran) dan D-Value (Daya Pembeda)
    const pValue = correctTotal / totalStudents;
    const dValue = groupSize > 0 ? (upperCorrect - lowerCorrect) / groupSize : 0;

    // Tentukan status
    const { status, color } = getQuestionStatus(pValue, dValue);

    return {
      index: idx + 1,
      questionText: questions?.[idx]?.text || `Soal Nomor ${idx + 1}`,
      pValue: pValue.toFixed(2),
      dValue: dValue.toFixed(2),
      status,
      color,
      isBad: dValue < 0.3 || pValue < ANALYSIS_THRESHOLDS.P_DIFFICULT || pValue > 0.8
    };
  });
};

/**
 * Tentukan status dan warna kualitas soal berdasarkan nilai P dan D
 * @param {number} pValue - Indeks Kesukaran (0-1)
 * @param {number} dValue - Daya Pembeda (-1 to 1)
 * @returns {Object} {status, color}
 */
export const getQuestionStatus = (pValue, dValue) => {
  let status = 'Baik';
  let color = 'bg-green-100 text-green-700';

  // Cek P-Value terlebih dahulu
  if (pValue < ANALYSIS_THRESHOLDS.P_DIFFICULT) {
    status = 'Terlalu Sukar';
    color = 'bg-orange-100 text-orange-700';
  } else if (pValue > ANALYSIS_THRESHOLDS.P_EASY) {
    status = 'Terlalu Mudah';
    color = 'bg-blue-100 text-blue-700';
  }

  // Cek D-Value
  if (dValue < ANALYSIS_THRESHOLDS.D_NEGATIVE) {
    status = 'Daya Pembeda Negatif';
    color = 'bg-red-200 text-red-800 font-bold';
  } else if (dValue < ANALYSIS_THRESHOLDS.D_POOR) {
    status = 'Daya Pembeda Rendah';
    color = 'bg-red-100 text-red-700';
  }

  return { status, color };
};

/**
 * Hitung statistik ringkas exam
 * @param {Array} analysisResults - Hasil dari runAnalysis
 * @returns {Object} Summary statistics
 */
export const getAnalysisSummary = (analysisResults) => {
  if (!analysisResults || analysisResults.length === 0) {
    return { goodQuestions: 0, needRevision: 0, averageP: 0, averageD: 0 };
  }

  const badCount = analysisResults.filter(r => r.isBad).length;
  const goodCount = analysisResults.length - badCount;
  const avgP = (analysisResults.reduce((sum, r) => sum + parseFloat(r.pValue), 0) / analysisResults.length).toFixed(2);
  const avgD = (analysisResults.reduce((sum, r) => sum + parseFloat(r.dValue), 0) / analysisResults.length).toFixed(2);

  return {
    goodQuestions: goodCount,
    needRevision: badCount,
    averageP: avgP,
    averageD: avgD
  };
};
