import React, { useState } from 'react';
import { Lock, Unlock, User, KeyRound, AlertCircle, X, LogIn, Heart } from 'lucide-react';

export default function SideLoginDrawer({ isOpen, onToggle, onClose, onLogin, onOpenRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLostPassword, setShowLostPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Fadlan geli email-kaaga ama username-ka.');
      return;
    }
    if (!password) {
      setError('Fadlan geli password-kaaga.');
      return;
    }

    setLoading(true);
    try {
      await onLogin({ email: trimmedEmail, password });
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Galitaanku ma guuleysan. Hubi Email & Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Right-Edge Lock Tab Button (Exactly like the sample screenshot) */}
      <button
        type="button"
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#1e293b]/95 hover:bg-[#334155] active:bg-[#0f172a] text-white p-3 rounded-l-2xl shadow-2xl border-y border-l border-white/20 backdrop-blur-md transition-all cursor-pointer focus:outline-none hover:pl-4 group"
        aria-label="User Login"
        title="User / Admin Login"
      >
        {isOpen ? (
          <Unlock className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 group-hover:scale-110 transition-transform" />
        ) : (
          <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-slate-200 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Dark Slide-Out Login Drawer from Right (Matching sample screenshot) */}
      <div 
        className={`fixed top-0 right-0 h-full w-[310px] sm:w-[360px] bg-[#111827]/98 backdrop-blur-2xl border-l border-white/10 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-7 sm:p-8 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <h3 className="text-xl font-normal text-slate-100 tracking-wide">
                User Login
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Lost Password Notice */}
          {showLostPassword ? (
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-white/10 text-xs text-slate-300 space-y-3 mb-6">
              <p className="font-bold text-white text-sm">Lost Password / Caawinaad</p>
              <p className="text-xs leading-relaxed text-slate-300">
                Haddii aad ilowday password-kaaga, fadlan si toos ah ula xiriir maamulka Madahiye:
              </p>
              <p className="text-rose-400 font-extrabold text-sm">📞 +252 61 679 6362</p>
              <button
                type="button"
                onClick={() => setShowLostPassword(false)}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Ku Noqo Login-ka
              </button>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-[#1f293d]/90 hover:bg-[#25324b] focus:bg-[#25324b] border border-white/10 focus:border-white/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 bg-[#1f293d]/90 hover:bg-[#25324b] focus:bg-[#25324b] border border-white/10 focus:border-white/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>

              {/* Links & Submit Action */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowLostPassword(true)}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer underline underline-offset-2"
                >
                  Lost Password
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-transparent hover:bg-white/10 active:bg-white/20 text-white font-medium text-sm rounded-lg border border-white/40 hover:border-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? '...' : 'Login'}
                </button>
              </div>
            </form>
          )}

          {/* Quick Register Switch */}
          {onOpenRegister && (
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-slate-400">
                Wali ma lihid akoon?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="text-rose-400 hover:text-rose-300 font-bold underline underline-offset-2 cursor-pointer"
                >
                  Is-diiwaangeli
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Bottom Helper Info */}
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Madahiye Blood Donation Platform
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Admin: <span className="text-slate-300 font-mono">Emre@gmail.com</span> / <span className="text-slate-300 font-mono">321</span>
          </p>
        </div>
      </div>

      {/* Backdrop overlay when Drawer is open */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}
    </>
  );
}
