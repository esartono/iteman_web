import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading spinner overlay yang menutupi seluruh layar
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message (default: 'Memuat...')
 */
const LoadingSpinner = ({ message = 'Memuat...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 z-[110] flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
