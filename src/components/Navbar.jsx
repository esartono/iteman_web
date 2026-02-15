import React from 'react';
import { BarChart2, LogOut } from 'lucide-react';

/**
 * Navigation bar aplikasi
 * @param {Object} props - Component props
 * @param {Object} props.user - Firebase user object
 * @param {Function} props.onLogoClick - Callback untuk klik logo
 * @param {Function} props.onLogout - Callback untuk logout
 */
const Navbar = ({ user, onLogoClick, onLogout }) => {
  return (
    <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          onClick={onLogoClick}
          role="button"
          tabIndex={0}
        >
          <BarChart2 className="text-indigo-600" size={24} />
          <h1 className="font-black text-lg tracking-tight uppercase">AnalisButir</h1>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">
            {user?.email || 'User Anonim'}
          </span>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
