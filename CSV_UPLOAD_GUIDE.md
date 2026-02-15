# Fitur Upload File Soal (CSV) - ITEMAN Integrated

## Pengenalan

AnalisButir AI sekarang mendukung fitur upload soal dalam format CSV (Comma-Separated Values) dengan integrasi penuh ke **analisis ITEMAN profesional**. 

**FITUR BARU**: Ketika Anda upload soal via CSV, sistem secara otomatis:
- ✅ Membuat **15 simulasi siswa** dengan variasi jawaban yang realistis
- ✅ Memungkinkan preview lengkap analisis ITEMAN (P-value, D-value, Point Biserial, Alpha Cronbach, dll)
- ✅ Anda dapat mengganti dengan data siswa sebenarnya nanti

Ini memungkinkan Anda melihat kualitas soal segera setelah upload, tanpa perlu mengumpulkan data siswa dulu!

## Format CSV

### Struktur File

File CSV harus memiliki format berikut:

```
Soal,Opsi A,Opsi B,Opsi C,Opsi D,Jawaban Benar
"Pertanyaan 1","Pilihan AA","Pilihan AB","Pilihan AC","Pilihan AD","A"
"Pertanyaan 2","Pilihan BA","Pilihan BB","Pilihan BC","Pilihan BD","B"
```

### Penjelasan Kolom

| Kolom | Deskripsi | Contoh |
|-------|-----------|--------|
| **Soal** | Teks pertanyaan | "Apa ibu kota Indonesia?" |
| **Opsi A** | Text pilihan A | "Jakarta" |
| **Opsi B** | Text pilihan B | "Bandung" |
| **Opsi C** | Text pilihan C | "Yogyakarta" |
| **Opsi D** | Text pilihan D | "Surabaya" |
| **Jawaban Benar** | Jawaban yang benar (A/B/C/D) | "A" |

### Aturan Penting

1. ✅ **Header harus di baris pertama** - Harus tepat: `Soal,Opsi A,Opsi B,Opsi C,Opsi D,Jawaban Benar`

2. ✅ **Gunakan tanda kutip untuk teks yang mengandung koma**
   ```
   "Apa hasil 1+1?" → BENAR ✅
   Apa hasil 1+1?  → SALAH ❌ (tanpa kutip)
   
   "Pilihan, A" → BENAR ✅ (kutip karena ada koma)
   Pilihan, A   → SALAH ❌ (akan terpotong jadi 2 kolom)
   ```

3. ✅ **Jawaban harus A, B, C, atau D saja**
   ```
   "A" → BENAR ✅
   "a" → BENAR ✅ (akan otomatis jadi uppercase)
   "opsi A" → SALAH ❌
   "1" → SALAH ❌
   ```

4. ✅ **Minimal 2 baris** (1 header + minimal 1 soal)

5. ✅ **Maksimal 50 soal** dalam satu file

6. ✅ **Ukuran file maksimal 1MB**

## Contoh File CSV

### ✅ BENAR (Recommended)

```csv
Soal,Opsi A,Opsi B,Opsi C,Opsi D,Jawaban Benar
"Apa nama planet terdekat dari Matahari?","Venus","Mars","Merkurius","Jupiter","C"
"Siapakah pencipta lagu Indonesia Raya?","Ismail Marzuki","W.R. Supratman","Ibu Sud","Kusbini","B"
"Berapa hasil dari 15 x 12?","150","170","180","190","C"
```

### ❌ SALAH (Jangan gunakan)

```csv
Soal,Opsi A,Opsi B,Opsi C,Opsi D,Jawaban Benar
Apa nama planet terdekat dari Matahari?,Venus,Mars,Merkurius,Jupiter,C
```
Masalah: Tidak ada tanda kutip, bisa berakibat parsing error jika teks mengandung koma

## Cara Menggunakan

### Step 1: Download Template
1. Buka aplikasi AnalisButir AI
2. Klik tombol **Buat Ujian Baru**
3. Pilih tab **"📤 Upload File"**
4. Klik tombol **"Download Template CSV"**

### Step 2: Isi Template
1. Buka file `template-soal.csv` di Excel atau text editor
2. Ganti contoh soal dengan soal Anda sendiri
3. Pastikan format tetap correct (header, kutip, dll)
4. **Simpan dengan format CSV**

### Step 3: Upload File
1. Masuk ke aplikasi, pilih **"📤 Upload File"**
2. Masukkan **Judul Ujian**
3. Klik area upload atau drag-drop file CSV
4. Tunggu system memproses file
5. Periksa preview soal
6. Klik **"Simpan Ujian"**

### Step 4: Lihat Analisis ITEMAN Preview
Ketika Anda upload soal, sistem akan:
1. Secara otomatis membuat **15 simulasi siswa** dengan jawaban bervariasi
2. Menampilkan badge **📊 Preview** di dashboard
3. Anda dapat langsung klik "Lihat Analisis" untuk melihat:
   - ✅ P-Value (Indeks Kesukaran)
   - ✅ D-Value (Daya Pembeda)
   - ✅ Point Biserial Correlation
   - ✅ Alpha Cronbach Reliability
   - ✅ Distractor Analysis
   - ✅ Recommendations untuk perbaikan soal

### Step 5: Ganti dengan Data Siswa Sebenarnya (Opsional)
Jika Anda ingin mengganti data simulasi dengan hasil ujian sebenarnya:
- Fitur import submission data akan segera tersedia
- Untuk sekarang, gunakan preview data untuk validasi soal

## Fitur Sample Data

### Apa itu Sample Data?
Ketika Anda upload CSV dengan soal dan jawaban kunci, sistem membuat **15 simulasi siswa** dengan distribusi kemampuan:

| Kelompok | Jumlah | Tingkat Kebenaran | Deskripsi |
|----------|--------|-------------------|-----------|
| **Excellent** | 3 siswa | 80-100% | Siswa yang sangat pandai |
| **Good** | 4 siswa | 60-80% | Siswa yang kemampuannya baik |
| **Fair** | 4 siswa | 40-60% | Siswa dengan kemampuan sedang |
| **Poor** | 4 siswa | 0-40% | Siswa yang masih kurang |

### Mengapa Sample Data?
1. **Preview Analisis**: Lihat kualitas soal tanpa menunggu nilai siswa sebenarnya
2. **Validasi Soal**: Pastikan soal berfungsi baik sebelum digunakan
3. **Iterasi Cepat**: Revisi soal berdasarkan analisis preview
4. **Fleksibilitas**: Ganti dengan data sebenarnya kapan saja nanti

### Bagaimana Mengidentifikasi Preview Data?
- 🏷️ Kartu ujian akan menampilkan badge **📊 Preview**
- 📝 Deskripsi exam akan menyebutkan "15 simulasi siswa"
- 👥 Jumlah siswa selalu 15 untuk data preview

## Troubleshooting

### Error: "File CSV harus memiliki minimal 2 baris"
**Penyebab**: File hanya berisi header tanpa soal  
**Solusi**: Tambahkan minimal 1 baris soal di bawah header

### Error: "Baris X: Format tidak valid. Diharapkan 6 kolom"
**Penyebab**: Jumlah kolom tidak sesuai (kurang/lebih dari 6)  
**Solusi**: Periksa bahwa setiap baris memiliki tepat 6 kolom (Soal, Opsi A-D, Jawaban)

### Error: "Baris X: Soal tidak boleh kosong"
**Penyebab**: Kolom soal kosong  
**Solusi**: Isi kolom Soal dengan pertanyaan yang valid

### Error: "Baris X: Semua opsi (A-D) harus terisi"
**Penyebab**: Salah satu opsi (A/B/C/D) kosong  
**Solusi**: Pastikan semua 4 opsi terisi

### Error: "Baris X: Jawaban benar harus A, B, C, atau D"
**Penyebab**: Jawaban tidak valid (bukan A/B/C/D)  
**Solusi**: Ubah jawaban menjadi salah satu dari: A, B, C, atau D (case-insensitive)

### Error: "Tipe file harus CSV"
**Penyebab**: File bukan CSV (bisa .xlsx, .xls, .txt)  
**Solusi**: Save file dalam format CSV dari Excel

**Cara save CSV dari Excel**:
1. Buka file di Excel
2. **File** → **Save As**
3. Pilih format: **CSV (Comma delimited) (.csv)**
4. Klik **Save**

### File Berhasil Upload tapi Preview Kosong
**Penyebab**: Semua baris memiliki error  
**Solusi**: Periksa pesan warning/error dan perbaiki format

## Tips & Trik

### 1. Gunakan Excel untuk Edit
```
✅ RECOMMENDED:
- Buka template di Excel
- Edit dengan mudah
- Gunakan features Excel untuk validasi
- Save sebagai CSV

❌ Jangan gunakan:
- Notepad (risiko format error)
- Google Sheets (bisa ada format issues)
```

### 2. Validasi Sebelum Upload
Sebelum upload, pastikan:
- ✅ Tidak ada spasi kosong di baris
- ✅ Semua teks menggunakan tanda kutip
- ✅ Jawaban hanya A/B/C/D
- ✅ Tidak ada baris kosong di tengah data

### 3. Contoh Proper CSV
```csv
Soal,Opsi A,Opsi B,Opsi C,Opsi D,Jawaban Benar
"Soal dengan koma?","Opsi A, dengan koma","Opsi B","Opsi C","Opsi D","A"
"Berapa 2+2?","3","4","5","6","B"
"Kota apa ini: Jakarta?","Ibukota Indonesia","Kota besar","Kota pesisir","Semua benar","A"
```

## Fitur Lanjutan

### Preview Soal
Setelah upload, aplikasi menampilkan:
- ✅ Jumlah soal yang berhasil diparse
- ✅ Preview 3 soal pertama
- ✅ Peringatan untuk baris dengan error
- ❌ Baris yang error (tidak dimasukkan ke ujian)

### Validasi Real-time
- File divalidasi saat upload
- Error ditampilkan langsung
- Warnings ditampilkan jika ada baris dengan masalah
- Anda bisa memperbaiki dan re-upload

## FAQ

### Q: Bisakah saya edit soal setelah upload?
**A**: Ya, Anda bisa edit soal di view analisa setelah membuat ujian (fitur manual edit soal akan datang di update berikutnya).

### Q: Apakah saya harus download template?
**A**: Tidak harus, tapi sangat disarankan. Template memastikan format yang benar.

### Q: Berapa maksimal soal per file?
**A**: Maksimal 50 soal dalam satu file. Untuk lebih banyak, upload file terpisah.

### Q: Apakah urutan soal preserved?
**A**: Ya, urutan soal di file CSV akan sama dengan urutan di aplikasi.

### Q: Bisa upload ulang dengan soal yang sama?
**A**: Yes, akan membuat ujian baru dengan soal yang sama.

## Kontribusi

Jika menemukan bug atau ada saran fitur CSV upload, silakan lapor di GitHub issues atau hubungi tim development.

---

**Selamat mencoba fitur upload soal! Happy analyzing! 📊**
