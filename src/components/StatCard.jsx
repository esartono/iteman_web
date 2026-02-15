import React from 'react';

/**
 * Kartu statistik untuk menampilkan ringkasan data
 * @param {Object} props - Component props
 * @param {string} props.label - Label statistik
 * @param {number|string} props.value - Nilai statistik
 * @param {string} props.color - CSS color class (default: text-slate-800)
 * @param {React.ReactNode} props.icon - Icon element
 */
const StatCard = ({ label, value, color = 'text-slate-800', icon }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-2 text-slate-400">
        {icon}
        <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
  );
};

export default StatCard;
