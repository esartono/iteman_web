import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { parseCSV, validateFile, readFile, downloadCSVTemplate } from '../services/csvService';

/**
 * View untuk membuat exam baru
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onSubmit - Callback ketika form di-submit
 * @param {Function} props.onCancel - Callback untuk cancel
 * @param {string} props.initialMode - Initial mode ('manual' or 'upload')
 */
const CreateView = ({ loading, onSubmit, onCancel, initialMode = 'manual' }) => {
  // Manual entry mode
  const [title, setTitle] = useState('');
  const [questionCount, setQuestionCount] = useState(10);

  // File upload mode
  const [uploadMode, setUploadMode] = useState(initialMode === 'upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [parseErrors, setParseErrors] = useState([]);
  const [parseWarnings, setParseWarnings] = useState([]);
  const [parsedData, setParsedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadMode) {
      // Manual entry mode
      if (!title.trim()) {
        alert('Judul ujian tidak boleh kosong');
        return;
      }

      if (questionCount < 1 || questionCount > 50) {
        alert('Jumlah soal harus antara 1-50');
        return;
      }

      try {
        await onSubmit({
          title: title.trim(),
          questionCount: parseInt(questionCount)
        });

        // Reset form
        setTitle('');
        setQuestionCount(10);
      } catch (err) {
        console.error('Submission error:', err);
      }
    } else {
      // File upload mode
      if (!uploadTitle.trim()) {
        alert('Judul ujian tidak boleh kosong');
        return;
      }

      if (!parsedData) {
        alert('Silakan upload file soal terlebih dahulu');
        return;
      }

      try {
        await onSubmit({
          title: uploadTitle.trim(),
          questions: parsedData.questions,
          answerKey: parsedData.answerKey,
          fromFile: true
        });

        // Reset form
        setUploadTitle('');
        setSelectedFile(null);
        setParsedData(null);
        setParseErrors([]);
        setParseWarnings([]);
      } catch (err) {
        console.error('Submission error:', err);
      }
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setSelectedFile(file);
    setParseErrors([]);
    setParseWarnings([]);
    setParsedData(null);

    try {
      const content = await readFile(file);
      const result = parseCSV(content);

      if (result.success) {
        setParsedData(result.data);
        setParseWarnings(result.errors);
      } else {
        setParseErrors(result.errors);
        setParsedData(null);
      }
    } catch (err) {
      setParseErrors([err.message]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mode Toggle */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              setUploadMode(false);
              setSelectedFile(null);
              setParsedData(null);
              setParseErrors([]);
              setParseWarnings([]);
            }}
            className={`flex-1 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest transition ${
              !uploadMode
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ✎ Buat Manual
          </button>
          <button
            type="button"
            onClick={() => {
              setUploadMode(true);
              setTitle('');
            }}
            className={`flex-1 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest transition ${
              uploadMode
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📤 Upload File
          </button>
        </div>
      </div>

      {/* Manual Entry Form */}
      {!uploadMode && (
        <div className="max-w-xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          {/* Title */}
          <h2 className="text-2xl font-black mb-8 text-slate-800 uppercase tracking-tight text-center">
            Buat Ujian Baru
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                Judul Ujian
              </label>
              <input
                type="text"
                placeholder="Contoh: UTS Fisika Kelas 10"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            {/* Question Count Input */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                Jumlah Soal
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
              <p className="text-[10px] text-slate-400 mt-2">Minimal 1 soal, maksimal 50 soal</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Ujian'}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-300 transition"
            >
              Batalkan
            </button>
          </form>
        </div>
      )}

      {/* File Upload Form */}
      {uploadMode && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          {/* Title */}
          <h2 className="text-2xl font-black mb-8 text-slate-800 uppercase tracking-tight text-center">
            Upload Soal dari File
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exam Title Input */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                Judul Ujian
              </label>
              <input
                type="text"
                placeholder="Contoh: UTS Fisika Kelas 10"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            {/* Download Template Button */}
            <div>
              <button
                type="button"
                onClick={downloadCSVTemplate}
                className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Template CSV
              </button>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Download template untuk melihat format yang benar
              </p>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">
                Pilih File CSV
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-input"
                />
                <label htmlFor="csv-input" className="cursor-pointer">
                  <Upload className="mx-auto mb-4 text-slate-400" size={24} />
                  <p className="font-bold text-slate-700 mb-1">Klik atau drag file CSV</p>
                  <p className="text-[12px] text-slate-500">
                    {selectedFile ? selectedFile.name : 'Maks ukuran: 1MB'}
                  </p>
                </label>
              </div>
            </div>

            {/* Parse Errors */}
            {parseErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-[12px] font-bold text-red-700 mb-2">❌ Kesalahan:</p>
                <ul className="space-y-1">
                  {parseErrors.map((error, idx) => (
                    <li key={idx} className="text-[11px] text-red-600">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Parse Warnings */}
            {parseWarnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <p className="text-[12px] font-bold text-yellow-700 mb-2">⚠️ Peringatan:</p>
                <ul className="space-y-1">
                  {parseWarnings.map((warning, idx) => (
                    <li key={idx} className="text-[11px] text-yellow-600">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Parsed Data Preview */}
            {parsedData && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-[12px] font-bold text-green-700 mb-2">✅ Berhasil diparse:</p>
                  <p className="text-[12px] text-green-600">
                    {parsedData.questions.length} soal ditemukan dan siap diupload
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-[12px] font-bold text-blue-700 mb-2">ℹ️ Catatan Penting:</p>
                  <p className="text-[12px] text-blue-600">
                    Sistem akan secara otomatis membuat <strong>15 simulasi siswa</strong> untuk preview analisis ITEMAN.
                    Anda dapat mengganti data ini dengan jawaban siswa sebenarnya kemudian.
                  </p>
                </div>
              </div>
            )}

            {/* Preview Questions */}
            {parsedData && parsedData.questions.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-60 overflow-y-auto">
                <p className="text-[12px] font-bold text-slate-700 mb-3">Preview Soal:</p>
                <div className="space-y-3">
                  {parsedData.questions.slice(0, 3).map((q, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-[11px] font-bold text-slate-800 mb-1">
                        Soal {idx + 1}: {q.text.substring(0, 50)}...
                      </p>
                      <p className="text-[11px] text-slate-600">
                        Jawaban benar: {['A', 'B', 'C', 'D'][parsedData.answerKey[idx]]}
                      </p>
                    </div>
                  ))}
                  {parsedData.questions.length > 3 && (
                    <p className="text-[11px] text-slate-500 text-center">
                      +{parsedData.questions.length - 3} soal lainnya...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !parsedData}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Ujian'}
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-300 transition"
            >
              Batalkan
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateView;
