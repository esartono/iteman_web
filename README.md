# AnalisButir AI - Aplikasi Analisis Kualitas Soal Ujian

AnalisButir AI adalah aplikasi web modern untuk menganalisis kualitas butir soal ujian menggunakan metode kuantitatif standar pendidikan (Indeks Kesukaran dan Daya Pembeda). Dilengkapi dengan integrasi AI untuk memberikan saran perbaikan soal yang bermasalah.

## Fitur Utama

- **Autentikasi Firebase**: Login/Register dengan email dan password
- **Analisis Kuantitatif**: 
  - Indeks Kesukaran (P-Value)
  - Daya Pembeda (D-Value)
  - Status otomatis kualitas soal
- **AI Advisor**: Saran dari Gemini AI untuk perbaikan soal
- **Data Tester**: Demo data dengan 10 soal dan 20 siswa simulasi
- **Real-time Sync**: Sinkronisasi otomatis dengan Firestore
- **Responsive Design**: Dioptimalkan untuk desktop dan mobile

## Teknologi

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Icons**: Lucide React
- **AI**: Google Gemini 2.5 Flash API

## Instalasi

### Prasyarat
- Node.js v24+ dan npm
- Akun Firebase dengan Firestore Database

### Setup Lokal

```bash
# Clone project
git clone <repo-url>
cd analisa-soal

# Install dependencies
npm install --legacy-peer-deps

# Setup environment variables
# Buat file .env atau inject config saat runtime
# Diperlukan: FIREBASE_CONFIG, GEMINI_API_KEY

# Development server
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

## Konfigurasi Firebase

Untuk menjalankan aplikasi, Anda perlu meng-inject Firebase config pada runtime:

```javascript
// Di dalam HTML atau saat inisialisasi app
window.__firebase_config = JSON.stringify({
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
});

window.__app_id = "analisis-soal-v1"; // Custom app ID
window.__initial_auth_token = "optional-custom-token";
```

## Integrasi Gemini AI

Untuk menggunakan fitur AI Advisor, tambahkan API Key:

```javascript
// Edit src/App.jsx baris ~49
const apiKey = "YOUR_GEMINI_API_KEY";
```

## Struktur Project

```
src/
├── App.jsx           # Komponen utama aplikasi
├── index.css         # Tailwind CSS
├── main.jsx          # Entry point
└── assets/           # Static assets
```

## Penggunaan

### 1. Login/Register
- Gunakan email dan password untuk membuat akun atau login

### 2. Gunakan Data Tester
- Klik tombol "Gunakan Data Tester" untuk import demo data
- Include 10 soal dan 20 siswa simulasi

### 3. Buat Ujian Baru
- Klik "Ujian Baru"
- Isi judul dan jumlah soal
- Soal akan dibuat dengan placeholder (dapat diedit di Firestore)

### 4. Analisis Hasil
- Klik "Lihat Analisis" pada ujian
- Lihat statistik: Indeks Kesukaran, Daya Pembeda, Status Soal
- Klik tombol "Tanya AI" untuk mendapat saran perbaikan

## Rumus Analisis

### Indeks Kesukaran (P-Value)
```
P = Σ(Jawaban Benar) / Total Siswa
```
- **P < 0.3**: Terlalu Sukar
- **P > 0.7**: Terlalu Mudah
- **0.3 ≤ P ≤ 0.7**: Baik

### Daya Pembeda (D-Value)
```
D = (Upper Group - Lower Group) / Ukuran Grup
Grup = 27% dari total siswa (top dan bottom)
```
- **D < 0**: Negative Discrimination
- **D < 0.2**: Daya Pembeda Rendah
- **D ≥ 0.2**: Daya Pembeda Baik

## API Endpoints

Firebase Collections:
```
/artifacts/{appId}/users/{uid}/exams
├── id: string (auto)
├── title: string
├── answerKey: string[]
├── questions: object[]
│   ├── text: string
│   └── options: string[]
├── submissions: object[]
│   ├── id: string
│   ├── studentName: string
│   └── answers: string[]
└── createdAt: timestamp
```

## Troubleshooting

### ERESOLVE Dependency Tree Error
```bash
npm install --legacy-peer-deps
```

### Firebase Config Error
Pastikan `__firebase_config` sudah di-inject sebelum app mount.

### AI API Error
- Periksa API Key Gemini
- Pastikan quota API belum terlampaui
- Check error response di browser console

## Development

### Hot Module Replacement (HMR)
Vite menyediakan HMR otomatis - edit file dan lihat perubahan real-time.

### Linting
```bash
npm run lint
```

### Build untuk Production
```bash
npm run build
# Output: dist/
```

## Lisensi

MIT

## Kontak & Support

Untuk pertanyaan atau bug report, silakan buat issue di repository ini.

