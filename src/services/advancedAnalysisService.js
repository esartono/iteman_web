/**
 * Advanced analysis service
 * Implementasi lengkap ITEMAN-like analysis
 * - Point Biserial Correlation
 * - Alpha Cronbach Reliability
 * - Distractor Analysis
 * - Enhanced Metrics
 */

/**
 * Comprehensive exam analysis sesuai ITEMAN
 * @param {Object} exam - Exam object dengan questions, answerKey, submissions
 * @returns {Object} Complete analysis results
 */
export const runAdvancedAnalysis = (exam) => {
  if (!exam?.submissions?.length || !exam?.answerKey?.length) {
    return {
      success: false,
      error: 'Exam harus memiliki submissions dan answer key'
    };
  }

  try {
    // 1. Hitung total scores untuk setiap siswa
    const studentScores = calculateStudentScores(exam);

    // 2. Analisis per soal
    const questionAnalyses = exam.answers.map((questionAnswers, questionIndex) => {
      return analyzeQuestion(
        questionIndex,
        questionAnswers,
        exam.answerKey[questionIndex],
        studentScores,
        exam.submissions.length
      );
    });

    // 3. Hitung reliabilitas keseluruhan
    const reliability = calculateAlphaCronbach(
      exam.submissions,
      exam.answerKey,
      studentScores
    );

    // 4. Summary statistics
    const summary = generateSummary(questionAnalyses, reliability);

    return {
      success: true,
      data: {
        questions: questionAnalyses,
        reliability,
        summary,
        timestamp: new Date().toISOString()
      }
    };
  } catch (err) {
    console.error('Advanced analysis error:', err);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Hitung skor total untuk setiap siswa
 * @param {Object} exam - Exam object
 * @returns {Array} Array of student total scores
 */
function calculateStudentScores(exam) {
  return exam.submissions.map(submission => {
    let score = 0;
    submission.answers.forEach((answer, index) => {
      if (answer === exam.answerKey[index]) {
        score++;
      }
    });
    return score;
  });
}

/**
 * Analisis detail per soal
 * @param {number} questionIndex - Index soal
 * @param {Array} answers - Array jawaban siswa untuk soal ini
 * @param {number} correctAnswer - Jawaban benar
 * @param {Array} studentScores - Total scores siswa
 * @param {number} totalStudents - Jumlah siswa
 * @returns {Object} Detailed question analysis
 */
function analyzeQuestion(questionIndex, answers, correctAnswer, studentScores, totalStudents) {
  // 1. Count correct/incorrect
  const correct = answers.filter(a => a === correctAnswer).length;
  const incorrect = totalStudents - correct;

  // 2. P-value (Indeks Kesukaran)
  const pValue = correct / totalStudents;

  // 3. D-value (Daya Pembeda) - menggunakan 27% method
  const groupSize = Math.ceil(totalStudents * 0.27);
  const topStudents = studentScores
    .map((score, idx) => ({ score, idx }))
    .sort((a, b) => b.score - a.score)
    .slice(0, groupSize)
    .map(s => s.idx);

  const bottomStudents = studentScores
    .map((score, idx) => ({ score, idx }))
    .sort((a, b) => a.score - b.score)
    .slice(0, groupSize)
    .map(s => s.idx);

  const correctTop = topStudents.filter(idx => answers[idx] === correctAnswer).length;
  const correctBottom = bottomStudents.filter(idx => answers[idx] === correctAnswer).length;

  const dValue = (correctTop - correctBottom) / groupSize;

  // 4. Point Biserial Correlation
  const pointBiserial = calculatePointBiserial(answers, studentScores, correctAnswer);

  // 5. Distractor Analysis
  const distractors = analyzeDistractors(answers, correctAnswer, totalStudents);

  // 6. Determine status
  const status = determineQuestionStatus(pValue, dValue, pointBiserial);

  return {
    index: questionIndex + 1,
    pValue: pValue.toFixed(3),
    dValue: dValue.toFixed(3),
    pointBiserial: pointBiserial.toFixed(3),
    correctCount: correct,
    totalCount: totalStudents,
    status,
    difficulty: getDifficultyLevel(pValue),
    discrimination: getDiscriminationLevel(dValue),
    distractors,
    metrics: {
      correct,
      incorrect,
      effectiveness: ((correct / totalStudents) * 100).toFixed(1) + '%'
    }
  };
}

/**
 * Hitung Point Biserial Correlation
 * Korelasi antara jawaban item dengan skor total
 * @param {Array} answers - Answers for this question
 * @param {Array} scores - Total scores for all students
 * @param {number} correctAnswer - Correct answer
 * @returns {number} Point biserial correlation
 */
function calculatePointBiserial(answers, scores, correctAnswer) {
  const n = answers.length;
  
  // Kelompok yang benar dan salah
  const correctGroup = scores.filter((_, idx) => answers[idx] === correctAnswer);
  const incorrectGroup = scores.filter((_, idx) => answers[idx] !== correctAnswer);

  const p = correctGroup.length / n; // Proporsi benar
  const q = 1 - p; // Proporsi salah

  if (p === 0 || p === 1 || correctGroup.length === 0 || incorrectGroup.length === 0) {
    return 0;
  }

  // Mean scores untuk yang benar dan salah
  const meanCorrect = correctGroup.reduce((a, b) => a + b, 0) / correctGroup.length;
  const meanIncorrect = incorrectGroup.reduce((a, b) => a + b, 0) / incorrectGroup.length;

  // Standard deviation of total scores
  const meanTotal = scores.reduce((a, b) => a + b, 0) / n;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - meanTotal, 2), 0) / n;
  const sd = Math.sqrt(variance);

  if (sd === 0) return 0;

  // Point Biserial formula: rpb = (meanCorrect - meanIncorrect) / sd * sqrt(p*q)
  const rpb = ((meanCorrect - meanIncorrect) / sd) * Math.sqrt(p * q);

  return rpb;
}

/**
 * Analisis Distractor (pilihan jawaban yang tidak benar)
 * @param {Array} answers - Jawaban siswa untuk soal ini
 * @param {number} correctAnswer - Jawaban benar
 * @param {number} totalStudents - Total siswa
 * @returns {Array} Distractor analysis
 */
function analyzeDistractors(answers, correctAnswer, totalStudents) {
  const options = ['A', 'B', 'C', 'D'];
  const distractors = [];

  options.forEach((option, idx) => {
    const count = answers.filter(a => a === idx).length;
    const percentage = ((count / totalStudents) * 100).toFixed(1);
    
    distractors.push({
      option,
      count,
      percentage: percentage + '%',
      isCorrect: idx === correctAnswer,
      effectiveness: idx === correctAnswer ? 'CORRECT' : analyzeDistractorEffectiveness(count, totalStudents)
    });
  });

  return distractors.sort((a, b) => b.count - a.count);
}

/**
 * Evaluasi efektivitas distractor
 * Distractor efektif jika dipilih oleh minimal 5% siswa
 * @param {number} count - Jumlah yang memilih distractor ini
 * @param {number} total - Total siswa
 * @returns {string} Effectiveness level
 */
function analyzeDistractorEffectiveness(count, total) {
  const percentage = (count / total) * 100;
  if (percentage === 0) return 'NOT CHOSEN';
  if (percentage < 5) return 'WEAK';
  if (percentage < 15) return 'FAIR';
  return 'STRONG';
}

/**
 * Calculate Alpha Cronbach Reliability
 * Mengukur internal consistency dari tes
 * @param {Array} submissions - Student submissions
 * @param {Array} answerKey - Answer key
 * @param {Array} scores - Student total scores
 * @returns {Object} Reliability metrics
 */
function calculateAlphaCronbach(submissions, answerKey, scores) {
  const n = submissions.length; // Jumlah siswa
  const k = answerKey.length; // Jumlah soal

  if (k <= 1) {
    return {
      alpha: 0,
      interpretation: 'Minimal 2 soal untuk hitung reliabilitas',
      reliability: 'UNDEFINED'
    };
  }

  // 1. Hitung variance setiap item
  const itemVariances = [];
  
  for (let i = 0; i < k; i++) {
    const itemScores = submissions.map(submission => 
      submission.answers[i] === answerKey[i] ? 1 : 0
    );
    const mean = itemScores.reduce((a, b) => a + b, 0) / n;
    const variance = itemScores.reduce((sum, score) => 
      sum + Math.pow(score - mean, 2), 0) / n;
    itemVariances.push(variance);
  }

  // 2. Hitung variance total scores
  const meanTotal = scores.reduce((a, b) => a + b, 0) / n;
  const totalVariance = scores.reduce((sum, score) => 
    sum + Math.pow(score - meanTotal, 2), 0) / n;

  // 3. Formula Alpha Cronbach
  const sumItemVariances = itemVariances.reduce((a, b) => a + b, 0);
  const alpha = (k / (k - 1)) * (1 - (sumItemVariances / totalVariance));

  // Clamp alpha antara 0 dan 1
  const clampedAlpha = Math.max(0, Math.min(1, alpha));

  return {
    alpha: clampedAlpha.toFixed(3),
    interpretation: getReliabilityInterpretation(clampedAlpha),
    reliability: getReliabilityLevel(clampedAlpha),
    sumItemVariances: sumItemVariances.toFixed(3),
    totalVariance: totalVariance.toFixed(3),
    numberOfItems: k,
    numberOfStudents: n
  };
}

/**
 * Get reliability interpretation based on alpha value
 */
function getReliabilityInterpretation(alpha) {
  if (alpha >= 0.9) return 'Excellent - Over-qualified (terlalu reliable, mungkin ada item yang redundant)';
  if (alpha >= 0.8) return 'Good - Acceptable for most purposes';
  if (alpha >= 0.7) return 'Acceptable - Minimum for most social sciences';
  if (alpha >= 0.6) return 'Questionable - Consider revising';
  if (alpha >= 0.5) return 'Poor - Need significant revision';
  return 'Unacceptable - Needs major changes';
}

/**
 * Get reliability level categorization
 */
function getReliabilityLevel(alpha) {
  if (alpha >= 0.8) return 'HIGH';
  if (alpha >= 0.6) return 'MODERATE';
  if (alpha >= 0.4) return 'LOW';
  return 'VERY LOW';
}

/**
 * Determine kelayakan soal berdasarkan multiple criteria
 */
function determineQuestionStatus(pValue, dValue, pointBiserial) {
  const issues = [];

  // Check P-value (kesukaran)
  if (pValue < 0.3) issues.push('TOO_DIFFICULT');
  if (pValue > 0.9) issues.push('TOO_EASY');

  // Check D-value (daya pembeda)
  if (dValue < 0.2) issues.push('POOR_DISCRIMINATION');
  if (dValue < 0) issues.push('NEGATIVE_DISCRIMINATION');

  // Check Point Biserial
  if (pointBiserial < 0.2) issues.push('WEAK_CORRELATION');
  if (pointBiserial < 0) issues.push('NEGATIVE_CORRELATION');

  // Determine overall status
  if (issues.length === 0) return 'GOOD';
  if (issues.length === 1) return 'FAIR';
  return 'POOR';
}

/**
 * Get difficulty level
 */
function getDifficultyLevel(pValue) {
  if (pValue < 0.3) return 'VERY DIFFICULT';
  if (pValue < 0.5) return 'DIFFICULT';
  if (pValue < 0.7) return 'MODERATE';
  if (pValue < 0.85) return 'EASY';
  return 'VERY EASY';
}

/**
 * Get discrimination level
 */
function getDiscriminationLevel(dValue) {
  if (dValue < 0) return 'NEGATIVE';
  if (dValue < 0.2) return 'POOR';
  if (dValue < 0.4) return 'SATISFACTORY';
  if (dValue < 0.6) return 'GOOD';
  return 'EXCELLENT';
}

/**
 * Generate summary statistics
 */
function generateSummary(questionAnalyses, reliability) {
  const goodQuestions = questionAnalyses.filter(q => q.status === 'GOOD').length;
  const fairQuestions = questionAnalyses.filter(q => q.status === 'FAIR').length;
  const poorQuestions = questionAnalyses.filter(q => q.status === 'POOR').length;

  // Average metrics
  const avgP = questionAnalyses.reduce((sum, q) => sum + parseFloat(q.pValue), 0) / questionAnalyses.length;
  const avgD = questionAnalyses.reduce((sum, q) => sum + parseFloat(q.dValue), 0) / questionAnalyses.length;

  return {
    totalQuestions: questionAnalyses.length,
    goodQuestions,
    fairQuestions,
    poorQuestions,
    needRevision: fairQuestions + poorQuestions,
    averageDifficulty: avgP.toFixed(3),
    averageDiscrimination: avgD.toFixed(3),
    reliability: reliability.reliability,
    alpha: parseFloat(reliability.alpha),
    recommendation: generateRecommendation(goodQuestions, fairQuestions, poorQuestions, parseFloat(reliability.alpha))
  };
}

/**
 * Generate recommendation untuk test/exam
 */
function generateRecommendation(good, fair, poor, alpha) {
  let recommendations = [];

  // Quality assessment
  const totalQuestions = good + fair + poor;
  const goodPercentage = (good / totalQuestions) * 100;

  if (goodPercentage >= 80) {
    recommendations.push('✅ Kualitas soal sudah baik, lanjutkan dengan perbaikan minor');
  } else if (goodPercentage >= 50) {
    recommendations.push('⚠️ Perlu revisi pada beberapa soal yang status FAIR/POOR');
  } else {
    recommendations.push('❌ Banyak soal yang perlu revisi serius sebelum digunakan');
  }

  // Reliability assessment
  if (alpha >= 0.8) {
    recommendations.push('✅ Reliabilitas test sangat baik');
  } else if (alpha >= 0.6) {
    recommendations.push('⚠️ Reliabilitas test sedang, pertimbangkan menambah soal atau revisi');
  } else {
    recommendations.push('❌ Reliabilitas test kurang baik, perlu banyak revisi');
  }

  // Overall recommendation
  if (good >= fair + poor) {
    recommendations.push('💡 Test siap digunakan untuk penilaian');
  } else {
    recommendations.push('💡 Lakukan perbaikan sebelum menggunakan test');
  }

  return recommendations;
}

/**
 * Transform exam data menjadi format yang siap untuk analisis
 * @param {Object} exam - Exam dari Firestore
 * @returns {Object} Transformed exam data
 */
export const transformExamForAnalysis = (exam) => {
  if (!exam?.submissions?.length) {
    return {
      error: 'Tidak ada data submission'
    };
  }

  // Extract answers from submissions
  const answers = [];
  const answerKey = exam.answerKey || [];
  
  for (let i = 0; i < answerKey.length; i++) {
    const questionAnswers = exam.submissions.map(sub => sub.answers?.[i] || -1);
    answers.push(questionAnswers);
  }

  return {
    ...exam,
    answers // Add extracted answers for analysis
  };
};
