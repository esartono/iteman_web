# Struktur Database ITEMAN - AnalisButir AI Pro

## Hierarki Firestore

```
artifacts/
└── {APP_ID}
    └── users/
        └── {userId}
            └── exams/
                └── {examId}
                    ├── metadata (exam info)
                    ├── settings (exam settings)
                    ├── questions/ (subcollection)
                    │   └── {questionId}
                    ├── classes/ (subcollection - untuk manage kelas)
                    ├── submissions/ (subcollection)
                    │   └── {submissionId}
                    └── analysis/ (subcollection - cache hasil analisis)
                        ├── itemAnalysis
                        ├── testAnalysis
                        └── recommendations
```

---

## 1. Exam Collection (Root Level)

**Path**: `artifacts/{APP_ID}/users/{userId}/exams/{examId}`

```javascript
{
  // ===== IDENTITAS =====
  id: "exam_20260215_001",
  title: "UTS Matematika Kelas 10 - Semester 1",
  description: "Ujian Tengah Semester Matematika",
  
  // ===== METADATA =====
  metadata: {
    schoolName: "SMA Negeri 1 Jakarta",
    subject: "Matematika",
    gradeLevel: 10,
    className: "X-IPA-1",
    semester: 1,
    academicYear: "2025/2026",
    createdBy: "guru_001",
    createdAt: "2026-02-15T10:30:00Z",
    administeredAt: "2026-02-16T08:00:00Z", // Kapan ujian dilaksanakan
    analyzedAt: "2026-02-17T14:30:00Z"
  },
  
  // ===== KONFIGURASI UJIAN =====
  settings: {
    totalQuestions: 10,
    timeLimit: 90, // menit
    passingScore: 70,
    allowRetake: false,
    shuffleQuestions: false,
    showAnswerAfterSubmit: true,
    questionsPerPage: 5
  },
  
  // ===== JAWABAN & SOAL =====
  answerKey: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1], // Index 0-3 = A-D
  questions: [
    // Lihat struktur Questions di bawah
  ],
  
  // ===== STATISTIK RINGKAS =====
  stats: {
    totalSubmissions: 25,
    totalStudents: 25,
    averageScore: 72.5,
    minScore: 45,
    maxScore: 98,
    passCount: 20,
    failCount: 5,
    passPercentage: 80
  },
  
  // ===== FLAGS & STATUS =====
  status: "published", // draft, published, archived, closed
  isTesterData: false,
  importedFromFile: true,
  hasActualData: false, // true = benar-benar data hasil ujian, false = sample/preview
  dataSource: "csv_import", // manual, csv_import, upload
  
  // ===== RELIABILITAS & METADATA ANALISIS =====
  reliabilityMetrics: {
    alpha: 0.825, // Alpha Cronbach
    stdError: 4.5,
    seOfMeasurement: 3.2
  },
  
  // ===== TAGS & METADATA =====
  tags: ["matematika", "uts", "2025-2026"],
  visibility: "private", // private, shared, public
  
  // ===== TIMESTAMPS =====
  updatedAt: "2026-02-17T14:30:00Z",
  deletedAt: null
}
```

---

## 2. Questions Subcollection

**Path**: `artifacts/{APP_ID}/users/{userId}/exams/{examId}/questions/{questionId}`

```javascript
{
  // ===== IDENTITAS =====
  id: "q_001",
  index: 0, // Posisi di exam (0-based)
  
  // ===== TEKS & OPSI =====
  text: "Hasil dari 2x + 3 = 15 adalah...",
  options: [
    "A. x = 4",
    "B. x = 6",
    "C. x = 8",
    "D. x = 10"
  ],
  correctAnswer: 1, // Index 0-3
  
  // ===== METADATA SOAL =====
  metadata: {
    domain: "Aljabar", // Topik/Domain
    competency: "Menyelesaikan persamaan linear satu variabel",
    learningObjective: "C3 - Menerapkan", // Bloom level
    bloomLevel: "Application", // Remember, Understand, Apply, Analyze, Evaluate, Create
    difficulty: 0.65, // Estimasi (0-1)
    timeEstimate: 3, // Menit estimasi
    source: "Buku Paket Kelas 10",
    author: "Tim Penulis"
  },
  
  // ===== ANALISIS ITEM (Cache) =====
  analysis: {
    pValue: 0.72, // Indeks Kesukaran
    dValue: 0.45, // Daya Pembeda
    pointBiserial: 0.58, // Korelasi item-total
    effectiveness: "GOOD",
    
    // Distractor Analysis
    distractors: [
      { option: "A", count: 2, percentage: "8%", effectiveness: "WEAK" },
      { option: "B", count: 18, percentage: "72%", effectiveness: "CORRECT", isCorrect: true },
      { option: "C", count: 3, percentage: "12%", effectiveness: "FAIR" },
      { option: "D", count: 2, percentage: "8%", effectiveness: "WEAK" }
    ]
  },
  
  // ===== METADATA SISTEM =====
  createdAt: "2026-02-15T10:30:00Z",
  updatedAt: "2026-02-17T14:30:00Z"
}
```

---

## 3. Submissions Subcollection

**Path**: `artifacts/{APP_ID}/users/{userId}/exams/{examId}/submissions/{submissionId}`

```javascript
{
  // ===== IDENTITAS =====
  id: "sub_student_001",
  studentId: "student_001",
  studentName: "Ahmad Wijaya",
  studentNumber: "10-001",
  className: "X-IPA-1",
  
  // ===== METADATA SUBMISSION =====
  submissionMetadata: {
    submittedAt: "2026-02-16T09:15:30Z",
    startedAt: "2026-02-16T08:00:00Z",
    completedAt: "2026-02-16T09:15:30Z",
    timeSpent: 75, // detik (75 menit)
    isLate: false,
    ipAddress: "192.168.1.100" // Opsional, untuk keamanan
  },
  
  // ===== JAWABAN ITEM =====
  answers: [1, 1, 0, 2, 3, 1, 2, 3, 0, 1], // Index per soal
  itemResponses: [
    {
      questionId: "q_001",
      studentAnswer: 1, // Index
      isCorrect: true,
      timeSpent: 5 // Detik
    },
    {
      questionId: "q_002",
      studentAnswer: 1,
      isCorrect: true,
      timeSpent: 6
    },
    // ...
  ],
  
  // ===== SCORING =====
  scoring: {
    rawScore: 8, // Jumlah benar
    totalQuestions: 10,
    percentScore: 80,
    isPass: true,
    gradeLevel: "A", // A, B, C, D, E
    feedback: "Bagus! Anda sudah menguasai materi dengan baik."
  },
  
  // ===== METADATA SISTEM =====
  submitted: true,
  isReviewed: false,
  updatedAt: "2026-02-16T09:15:30Z"
}
```

---

## 4. Analysis Results Subcollection (Cache)

**Path**: `artifacts/{APP_ID}/users/{userId}/exams/{examId}/analysis/{analysisId}`

```javascript
{
  // ===== ITEM ANALYSIS =====
  itemAnalysis: {
    totalItems: 10,
    items: [
      {
        itemIndex: 0,
        pValue: 0.72,
        dValue: 0.45,
        pointBiserial: 0.58,
        status: "GOOD",
        difficulty: "Moderate",
        discrimination: "Good"
      },
      // ... lebih banyak items
    ]
  },
  
  // ===== TEST ANALYSIS =====
  testAnalysis: {
    reliability: {
      alpha: 0.825,
      interpretation: "Good - Acceptable for most purposes",
      level: "HIGH"
    },
    
    difficulty: {
      average: 0.65,
      easiest: 0.45,
      hardest: 0.85,
      distribution: "moderate"
    },
    
    discrimination: {
      average: 0.42,
      poorItems: 2,
      goodItems: 8,
      negativeItems: 0
    },
    
    validity: {
      pointBiserialAverage: 0.55,
      validItems: 8,
      weakItems: 2
    }
  },
  
  // ===== RECOMMENDATIONS =====
  recommendations: [
    "✅ Kualitas soal sudah baik, lanjutkan dengan perbaikan minor",
    "✅ Reliabilitas test sangat baik (Alpha = 0.825)",
    "⚠️ Soal nomor 5 dan 7 memiliki daya pembeda lemah, pertimbangkan revisi",
    "💡 Test siap digunakan untuk penilaian"
  ],
  
  // ===== TIMESTAMP =====
  analyzedAt: "2026-02-17T14:30:00Z"
}
```

---

## 5. Classes Subcollection (Opsional)

**Path**: `artifacts/{APP_ID}/users/{userId}/exams/{examId}/classes/{classId}`

```javascript
{
  id: "class_x_ipa_1",
  name: "X-IPA-1",
  totalStudents: 25,
  students: [
    {
      studentId: "student_001",
      name: "Ahmad Wijaya",
      studentNumber: "10-001"
    },
    // ...
  ],
  createdAt: "2026-02-15T10:30:00Z"
}
```

---

## Perbandingan: Schema Lama vs Baru

| Field | Lama | Baru | Alasan |
|-------|------|------|--------|
| Exam structure | Simple | Hierarki dengan subcollections | Scalability & performance |
| Student info | Minimal | Lengkap (id, name, class) | ITEMAN memerlukan student metadata |
| Question metadata | Minimal | Domain, competency, bloom level | Item response analysis |
| Item analysis | Cache di exam | Subcollection terpisah | Real-time updates & queries |
| Submission detail | Simple answers array | itemResponses dengan timing | Detailed analysis |
| Reliability data | Tidak ada | Alpha, SEM, dll | ITEMAN requirement |
| Metadata timestamps | Sedikit | Lengkap (created, admin, analyzed) | Audit trail & tracking |

---

## Migration Strategy

### Phase 1: Add New Fields (Non-Breaking)
1. Update testerService untuk generate soal dengan structure baru
2. Update csvService untuk parse ke structure baru
3. Existing exams tetap kompatibel (backward compatible)

### Phase 2: Update Submissions Format
1. New submissions menggunakan itemResponses dengan timing
2. Old submissions tetap bekerja untuk backward compatibility

### Phase 3: Add Analysis Subcollection
1. Save analysis results ke subcollection terpisah
2. Cache untuk performance optimization

### Phase 4: Migration Script (Opsional)
1. Script untuk migrate existing data ke format baru
2. Jalankan manual saat ready

---

## Firestore Rules Implications

```javascript
// Baru perlu rules untuk:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User exams
    match /artifacts/{appId}/users/{userId}/exams/{examId} {
      allow read, write: if request.auth.uid == userId;
      
      // Subcollections
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

---

## Benefits

✅ **ITEMAN Compliance**: Semua data yang diperlukan untuk item response analysis  
✅ **Scalability**: Subcollections untuk performance  
✅ **Extensibility**: Mudah tambah field baru  
✅ **Audit Trail**: Timestamps lengkap untuk tracking  
✅ **Real-time Analysis**: Instant updates ketika ada submission baru  
✅ **Backward Compatible**: Old exams tetap berfungsi  

---

## Next Steps

1. Update `testerService.js` untuk generate dengan structure baru
2. Update `csvService.js` untuk parse dengan structure baru
3. Update `advancedAnalysisService.js` untuk read dari structure baru
4. Add migration function untuk existing data (opsional)
