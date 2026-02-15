import { TESTER_CONFIG, DEFAULT_VALUES } from '../config/appConfig';
import { createExam } from './firestoreService';

/**
 * Buat data ujian tester dengan 10 soal dan 20 siswa simulasi
 * @returns {Object} Exam object siap untuk disimpan ke Firestore
 */
export const generateTesterExam = () => {
  const testerQuestions = generateTesterQuestions();
  const answerKey = generateAnswerKey();
  const submissions = generateStudentSubmissions(answerKey);

  return {
    title: 'Ujian Tester (10 Soal Umum)',
    description: 'Data tester otomatis untuk demo aplikasi',
    answerKey,
    questions: testerQuestions,
    submissions,
    createdAt: new Date().toISOString(),
    isTesterData: true
  };
};

/**
 * Generate 10 pertanyaan tester
 * @returns {Array} Array of question objects
 */
export const generateTesterQuestions = () => {
  return [
    {
      text: 'Apa nama planet terdekat dari Matahari?',
      options: ['A. Venus', 'B. Mars', 'C. Merkurius', 'D. Jupiter']
    },
    {
      text: 'Siapakah pencipta lagu Indonesia Raya?',
      options: ['A. Ismail Marzuki', 'B. W.R. Supratman', 'C. Ibu Sud', 'D. Kusbini']
    },
    {
      text: 'Berapa hasil dari 15 x 12?',
      options: ['A. 150', 'B. 170', 'C. 180', 'D. 190']
    },
    {
      text: 'Unsur kimia dengan lambang "O" adalah...',
      options: ['A. Emas', 'B. Perak', 'C. Oksigen', 'D. Osmium']
    },
    {
      text: 'Ibukota negara Jepang adalah...',
      options: ['A. Seoul', 'B. Beijing', 'C. Tokyo', 'D. Bangkok']
    },
    {
      text: 'Benua terkecil di dunia adalah...',
      options: ['A. Asia', 'B. Australia', 'C. Eropa', 'D. Afrika']
    },
    {
      text: 'Mamalia yang bisa terbang adalah...',
      options: ['A. Burung', 'B. Kelelawar', 'C. Ayam', 'D. Tupai']
    },
    {
      text: 'Candi Borobudur terletak di provinsi...',
      options: ['A. Jawa Barat', 'B. Jawa Tengah', 'C. Jawa Timur', 'D. DIY']
    },
    {
      text: 'Gas yang dibutuhkan tumbuhan untuk fotosintesis adalah...',
      options: ['A. Oksigen', 'B. Karbondioksida', 'C. Nitrogen', 'D. Hidrogen']
    },
    {
      text: 'Zat hijau daun pada tumbuhan disebut...',
      options: ['A. Stomata', 'B. Klorofil', 'C. Akar', 'D. Batang']
    }
  ];
};

/**
 * Generate answer key untuk soal tester
 * @returns {Array} Array of correct answers
 */
export const generateAnswerKey = () => {
  return ['C', 'B', 'C', 'C', 'C', 'B', 'B', 'B', 'B', 'B'];
};

/**
 * Generate 20 siswa simulasi dengan jawaban berbeda berdasarkan kemampuan
 * @param {Array} answerKey - Kunci jawaban
 * @returns {Array} Array of submission objects
 */
export const generateStudentSubmissions = (answerKey) => {
  const submissions = [];
  const { STUDENT_COUNT, SMART_STUDENTS, STRUGGLING_STUDENTS } = TESTER_CONFIG;

  for (let i = 1; i <= STUDENT_COUNT; i++) {
    const isSmartStudent = i <= SMART_STUDENTS;
    const isStrugglingStudent = i >= STUDENT_COUNT - STRUGGLING_STUDENTS + 1;

    const answers = answerKey.map((correct) => {
      const rand = Math.random();

      if (isSmartStudent) {
        // Siswa pintar: 90% benar, 10% salah
        return rand > 0.1 ? correct : getRandomWrongAnswer(correct);
      }

      if (isStrugglingStudent) {
        // Siswa kesulitan: 30% benar, 70% salah
        return rand > 0.7 ? correct : getRandomAnswer();
      }

      // Siswa rata-rata: 50% benar, 50% salah
      return rand > 0.5 ? correct : getRandomAnswer();
    });

    submissions.push({
      id: `S${i}`,
      studentName: `Siswa Tester ${i}`,
      answers
    });
  }

  return submissions;
};

/**
 * Dapatkan jawaban acak yang bukan jawaban yang benar
 * @param {string} correctAnswer - Jawaban yang benar
 * @returns {string} Random answer yang bukan correct
 */
export const getRandomWrongAnswer = (correctAnswer) => {
  const options = ['A', 'B', 'C', 'D'];
  return options.find(opt => opt !== correctAnswer);
};

/**
 * Dapatkan jawaban acak dari semua opsi
 * @returns {string} Random answer (A, B, C, atau D)
 */
export const getRandomAnswer = () => {
  const options = ['A', 'B', 'C', 'D'];
  return options[Math.floor(Math.random() * 4)];
};

/**
 * Generate ujian kosong dengan jumlah soal yang ditentukan
 * @param {string} title - Judul ujian
 * @param {number} questionCount - Jumlah soal
 * @returns {Object} Empty exam object
 */
export const generateEmptyExam = (title, questionCount) => {
  const questions = Array(questionCount)
    .fill(0)
    .map((_, i) => ({
      text: `${DEFAULT_VALUES.QUESTION_PREFIX} ${i + 1}`,
      options: ['A', 'B', 'C', 'D']
    }));

  return {
    title,
    description: 'Ujian baru (belum ada submission)',
    answerKey: Array(questionCount).fill(DEFAULT_VALUES.EXAM_ANSWER),
    questions,
    submissions: [],
    createdAt: new Date().toISOString(),
    isTesterData: false
  };
};

/**
 * Generate ujian dari file upload (dengan soal dan jawaban)
 * Auto-generate sample submissions untuk preview analysis
 * @param {string} title - Judul ujian
 * @param {Array} questions - Array of question objects
 * @param {Array} answerKey - Array of answer indices
 * @returns {Object} Exam object dengan soal dari file + sample submissions
 */
export const generateExamFromFile = (title, questions, answerKey) => {
  // Auto-generate sample submissions untuk preview (15 siswa)
  const sampleSubmissions = generateSampleSubmissions(answerKey, 15);

  return {
    title,
    description: `Ujian diimport dari file (${questions.length} soal).
    Data ini mencakup 15 simulasi siswa untuk preview analisis. 
    Anda dapat mengganti dengan data siswa sebenarnya nanti.`,
    answerKey,
    questions,
    submissions: sampleSubmissions,
    createdAt: new Date().toISOString(),
    isTesterData: false,
    importedFromFile: true,
    hasActualData: false // Flag untuk menandai bahwa ini adalah sample data
  };
};

/**
 * Persist exam imported from file into Firestore using hierarchical schema
 * @param {string} userId
 * @param {string} title
 * @param {Array} questions
 * @param {Array} answerKey
 * @returns {Promise<string>} examId
 */
export const persistExamFromFile = async (userId, title, questions, answerKey) => {
  const examObj = generateExamFromFile(title, questions, answerKey);
  // Transform questions/submissions into expected shape for createExam
  const payload = {
    title: examObj.title,
    description: examObj.description,
    questions: examObj.questions.map((q, idx) => ({
      index: idx,
      prompt: q.text ?? q.prompt ?? '',
      options: q.options ?? q.choices ?? [],
      correct: q.correct ?? q.answer ?? null
    })),
    submissions: examObj.submissions.map(s => ({ answers: s.answers || s })),
    importedFromFile: true,
    hasActualData: false
  };

  const examId = await createExam(userId, payload);
  return examId;
};

/**
 * Generate sample submissions untuk preview
 * Membuat variasi jawaban yang realistis:
 * - Beberapa siswa bagus (80%+ benar)
 * - Beberapa siswa sedang (50-70% benar)
 * - Beberapa siswa kurang (30-50% benar)
 * - Beberapa siswa sangat kurang (<30% benar)
 * 
 * @param {Array} answerKey - Answer key
 * @param {number} count - Jumlah submissions (default 15)
 * @returns {Array} Sample submissions
 */
function generateSampleSubmissions(answerKey, count = 15) {
  const submissions = [];
  const groups = {
    excellent: Math.ceil(count * 0.2), // 20% bagus
    good: Math.ceil(count * 0.25),     // 25% sedang
    fair: Math.ceil(count * 0.3),      // 30% cukup
    poor: Math.ceil(count * 0.25)      // 25% kurang
  };

  let submissionId = 0;

  // Group Excellent (80-100% correct)
  for (let i = 0; i < groups.excellent; i++) {
    submissions.push({
      id: `student_${submissionId++}`,
      answers: answerKey.map((correctAnswer, idx) => {
        // 80% chance correct, 20% chance wrong
        if (Math.random() < 0.8) return correctAnswer;
        return Math.floor(Math.random() * 4);
      })
    });
  }

  // Group Good (60-80% correct)
  for (let i = 0; i < groups.good; i++) {
    submissions.push({
      id: `student_${submissionId++}`,
      answers: answerKey.map((correctAnswer) => {
        // 70% chance correct
        if (Math.random() < 0.7) return correctAnswer;
        return Math.floor(Math.random() * 4);
      })
    });
  }

  // Group Fair (40-60% correct)
  for (let i = 0; i < groups.fair; i++) {
    submissions.push({
      id: `student_${submissionId++}`,
      answers: answerKey.map((correctAnswer) => {
        // 50% chance correct
        if (Math.random() < 0.5) return correctAnswer;
        return Math.floor(Math.random() * 4);
      })
    });
  }

  // Group Poor (0-40% correct)
  for (let i = 0; i < groups.poor; i++) {
    submissions.push({
      id: `student_${submissionId++}`,
      answers: answerKey.map((correctAnswer) => {
        // 30% chance correct
        if (Math.random() < 0.3) return correctAnswer;
        return Math.floor(Math.random() * 4);
      })
    });
  }

  return submissions;
};
