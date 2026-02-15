import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { AUTH_VIEWS } from '../config/appConfig';

/**
 * Authentication page untuk login dan signup
 * @param {Object} props - Component props
 * @param {Function} props.onSignIn - Callback untuk sign in
 * @param {Function} props.onSignUp - Callback untuk sign up
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message
 */
const AuthPage = ({ onSignIn, onSignUp, loading, error }) => {
  const [authView, setAuthView] = useState(AUTH_VIEWS.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Email dan password harus diisi');
      return;
    }

    try {
      if (authView === AUTH_VIEWS.LOGIN) {
        await onSignIn(email, password);
      } else {
        await onSignUp(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden relative">
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-4 rounded-3xl shadow-lg">
              <BarChart2 className="text-white" size={32} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-center text-slate-800 mb-6 uppercase tracking-tight">
            AnalisButir AI
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs font-bold text-center">{error}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Proses...'
                : authView === AUTH_VIEWS.LOGIN
                  ? 'Masuk'
                  : 'Daftar'}
            </button>
          </form>

          {/* Toggle Auth View */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setAuthView(
                authView === AUTH_VIEWS.LOGIN ? AUTH_VIEWS.SIGNUP : AUTH_VIEWS.LOGIN
              )}
              className="text-indigo-600 font-bold text-sm hover:underline transition"
            >
              {authView === AUTH_VIEWS.LOGIN
                ? 'Belum punya akun? Daftar'
                : 'Sudah punya akun? Masuk'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
