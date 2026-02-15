import React from 'react';
import { Plus, Trash2, FileText, Beaker, Upload } from 'lucide-react';

/**
 * Dashboard view - menampilkan list exam dan opsi untuk membuat exam terbaru
 * @param {Object} props - Component props
 * @param {Array} props.exams - List exam objects
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onCreateTester - Callback untuk buat tester data
 * @param {Function} props.onCreateNew - Callback untuk buat exam baru
 * @param {Function} props.onUploadCSV - Callback untuk upload CSV
 * @param {Function} props.onViewAnalysis - Callback untuk lihat analysis
 * @param {Function} props.onDelete - Callback untuk delete exam
 */
const DashboardView = ({
  exams,
  loading,
  onCreateTester,
  onCreateNew,
  onUploadCSV,
  onViewAnalysis,
  onDelete
}) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl">
        <div>
          <h2 className="text-2xl font-black mb-1">Selamat Datang!</h2>
          <p className="text-indigo-200 text-sm">Mulai analisis kualitas soal Anda sekarang.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {/* Tester Button */}
          <button
            onClick={onCreateTester}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition font-bold text-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Beaker size={18} />
            {loading ? 'Memuat...' : 'Data Tester'}
          </button>

          {/* Upload CSV Button */}
          <button
            onClick={onUploadCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition font-bold text-sm shadow-lg shadow-green-900/50"
          >
            <Upload size={18} /> Upload CSV
          </button>

          {/* Create New Button */}
          <button
            onClick={onCreateNew}
            className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition font-bold text-sm shadow-lg shadow-indigo-900/50"
          >
            <Plus size={18} /> Ujian Baru
          </button>
        </div>
      </div>

      {/* Exam Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          // Empty State
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <FileText className="mx-auto text-slate-200 mb-4" size={64} />
            <p className="text-slate-400 font-bold">
              Gunakan 'Data Tester' untuk mencoba aplikasi ini dengan cepat.
            </p>
          </div>
        ) : (
          // Exam Cards
          exams.map(exam => (
            <ExamCard
              key={exam.id}
              exam={exam}
              onViewAnalysis={() => onViewAnalysis(exam)}
              onDelete={() => onDelete(exam.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Individual exam card component
 */
const ExamCard = ({ exam, onViewAnalysis, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Hapus ujian "${exam.title}"?`)) {
      onDelete();
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col group">
      {/* Title */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-lg text-slate-800">{exam.title}</h3>
        {exam.importedFromFile && exam.hasActualData === false && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold whitespace-nowrap ml-2">
            📊 Preview
          </span>
        )}
      </div>

      {/* Preview Data Notice */}
      {exam.importedFromFile && exam.hasActualData === false && (
        <p className="text-xs text-slate-500 mb-4 italic leading-tight">
          Menggunakan 15 simulasi siswa untuk preview analisis
        </p>
      )}

      {/* Info Tags */}
      <div className="flex gap-3 mb-6">
        <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {exam.answerKey?.length || 0} Soal
        </div>
        <div className="bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">
          {exam.submissions?.length || 0} Siswa
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={onViewAnalysis}
          className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-lg"
        >
          Lihat Analisis
        </button>
        <button
          onClick={handleDelete}
          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
          title="Hapus ujian"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default DashboardView;
