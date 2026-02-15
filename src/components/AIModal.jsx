import React from 'react';
import { Brain, XCircle } from 'lucide-react';

/**
 * Modal untuk menampilkan saran AI
 * @param {Object} props - Component props
 * @param {string} props.suggestion - Konten saran AI
 * @param {Function} props.onClose - Callback ketika modal ditutup
 */
const AIModal = ({ suggestion, onClose }) => {
  if (!suggestion) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white">
              <Brain size={24} />
            </div>
            <div>
              <h3 className="font-black text-indigo-900 uppercase tracking-tight">Saran Pakar AI</h3>
              <p className="text-[10px] font-black text-indigo-400 uppercase">
                Analisis Psikometrik & Pedagogis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition"
            aria-label="Close modal"
          >
            <XCircle size={24} className="text-slate-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-medium flex-1">
          {suggestion}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
          >
            Tutup Analisis
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
