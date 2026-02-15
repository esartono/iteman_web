import React from 'react';
import { ChevronLeft, Brain, AlertCircle, CheckCircle2, FileText, User } from 'lucide-react';
import StatCard from './StatCard';

/**
 * View untuk analisis soal dengan metrics ITEMAN lengkap
 * @param {Object} props - Component props
 * @param {Object} props.exam - Exam object yang sedang dianalisis
 * @param {Array} props.analysisResults - Hasil analisis dari setiap soal
 * @param {Object} props.summary - Summary statistik
 * @param {Object} props.reliability - Reliability statistics
 * @param {Function} props.onBack - Callback untuk kembali
 * @param {Function} props.onGetAiSuggestion - Callback untuk tanya AI
 * @param {boolean} props.loadingAI - Loading state untuk AI
 */
const AnalyzeView = ({
  exam,
  analysisResults,
  summary,
  reliability,
  onBack,
  onGetAiSuggestion,
  loadingAI
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-3 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 transition shadow-sm"
          title="Kembali ke dashboard"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            {exam.title}
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Metode Kuantitatif Standar Pendidikan
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Siswa"
            value={exam.submissions?.length || 0}
            icon={<User size={14} />}
          />
          <StatCard
            label="Butir Soal"
            value={exam.answerKey.length}
            icon={<FileText size={14} />}
          />
          <StatCard
            label="Perlu Revisi"
            value={summary.needRevision}
            color="text-red-500"
            icon={<AlertCircle size={14} />}
          />
          <StatCard
            label="Kualitas Baik"
            value={summary.goodQuestions}
            color="text-green-500"
            icon={<CheckCircle2 size={14} />}
          />
        </div>
      )}

      {/* Reliability Section */}
      {reliability && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Alpha Cronbach Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-[2rem] border border-purple-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-purple-600 mb-2 tracking-widest">
                  Alpha Cronbach (Reliabilitas)
                </p>
                <p className="text-4xl font-black text-purple-900">
                  {reliability.alpha}
                </p>
                <p className="text-xs text-purple-700 mt-2 font-bold">
                  {reliability.reliability} RELIABILITY
                </p>
              </div>
              <div className="text-4xl">🔍</div>
            </div>
            <p className="text-xs text-purple-600 mt-3 leading-relaxed">
              {reliability.interpretation}
            </p>
          </div>

          {/* Test Quality Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-[2rem] border border-blue-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-blue-600 mb-2 tracking-widest">
                  Test Quality Summary
                </p>
                <p className="text-sm font-bold text-blue-900 mt-2">
                  Rata-rata Kesukaran: <span className="text-lg">{summary.averageDifficulty}</span>
                </p>
                <p className="text-sm font-bold text-blue-900 mt-1">
                  Rata-rata Daya Pembeda: <span className="text-lg">{summary.averageDiscrimination}</span>
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {summary?.recommendation && (
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-xl">
          <p className="text-xs font-black uppercase text-indigo-600 mb-3 tracking-widest">
            💡 Rekomendasi
          </p>
          <ul className="space-y-2">
            {summary.recommendation.map((rec, idx) => (
              <li key={idx} className="text-sm text-indigo-900 font-semibold">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analysis Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            {/* Table Header */}
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4">No</th>
                <th className="p-4">P-Value</th>
                <th className="p-4">D-Value</th>
                <th className="p-4">Point Biserial</th>
                <th className="p-4">Status</th>
                <th className="p-4">Distractors</th>
                <th className="p-4 text-center">AI Advisor</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-50">
              {analysisResults.map(result => (
                <AnalysisRow
                  key={result.index}
                  result={result}
                  onAskAI={() => onGetAiSuggestion(result)}
                  loadingAI={loadingAI}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Individual row dalam analysis table
 */
const AnalysisRow = ({ result, onAskAI, loadingAI }) => {
  const [expanded, setExpanded] = React.useState(false);

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'GOOD': return 'bg-green-100 text-green-700';
      case 'FAIR': return 'bg-yellow-100 text-yellow-700';
      case 'POOR': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <>
      <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {/* No */}
        <td className="p-4 font-black text-slate-800">{result.index}</td>

        {/* P-Value */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs">{result.pValue}</span>
            <div className="text-[9px] text-slate-500">{result.difficulty}</div>
          </div>
        </td>

        {/* D-Value */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs">{result.dValue}</span>
            <div className="text-[9px] text-slate-500">{result.discrimination}</div>
          </div>
        </td>

        {/* Point Biserial */}
        <td className="p-4">
          <span className="font-mono font-bold text-xs">{result.pointBiserial}</span>
        </td>

        {/* Status */}
        <td className="p-4">
          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusColor(result.status)}`}>
            {result.status}
          </span>
        </td>

        {/* Distractors Summary */}
        <td className="p-4">
          <div className="text-[9px] space-y-1">
            {result.distractors.slice(0, 3).map((d, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className={`font-bold ${d.isCorrect ? 'text-green-700' : 'text-slate-600'}`}>
                  {d.option}:
                </span>
                <span className="text-slate-600">{d.percentage}</span>
              </div>
            ))}
          </div>
        </td>

        {/* AI Button */}
        <td className="p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAskAI();
            }}
            disabled={loadingAI}
            className={`mx-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
              result.status === 'POOR'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : result.status === 'FAIR'
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Brain size={12} /> AI
          </button>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {expanded && (
        <tr className="bg-slate-50 border-t-2 border-slate-200">
          <td colSpan="7" className="p-6">
            <div className="space-y-4">
              {/* Metrics Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricBox label="Jawab Benar" value={`${result.correctCount}/${result.totalCount}`} />
                <MetricBox label="Persentase" value={result.metrics.effectiveness} />
                <MetricBox label="Difficulty" value={result.difficulty} />
                <MetricBox label="Discrimination" value={result.discrimination} />
              </div>

              {/* Distractor Details */}
              <div>
                <p className="text-xs font-black text-slate-600 mb-3 uppercase">Analisis Pilihan Jawaban:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {result.distractors.map((d, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${d.isCorrect ? 'bg-green-50 border-green-200' : 'bg-slate-100 border-slate-200'}`}>
                      <p className="text-[10px] font-bold uppercase text-slate-600">{d.option}</p>
                      <p className={`text-lg font-black mt-1 ${d.isCorrect ? 'text-green-700' : 'text-slate-700'}`}>
                        {d.percentage}
                      </p>
                      <p className={`text-[9px] mt-1 font-semibold ${
                        d.isCorrect
                          ? 'text-green-700'
                          : d.effectiveness === 'STRONG'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {d.effectiveness}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

/**
 * Metric Box Component untuk expanded details
 */
const MetricBox = ({ label, value }) => (
  <div className="bg-white p-3 rounded-lg border border-slate-200">
    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</p>
    <p className="text-lg font-black text-slate-800">{value}</p>
  </div>
);

export default AnalyzeView;
