import React, { useState } from 'react';
import { Lock, Unlock, User, KeyRound, AlertCircle, ArrowRight, X } from 'lucide-react';

export default function MaintenanceLanding({ onLogin, onEnterPlatform }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
      setError('Please enter your username or email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await onLogin({ email: trimmedEmail, password });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0d1117] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Dark Mountain Background Image with Vignette Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80')`
        }}
      />

      {/* Dark Atmospheric Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/80 via-[#0b0f19]/40 to-[#0b0f19]/90" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80" />

      {/* Top Header - Madahiye Brand */}
      <header className="relative z-10 pt-10 text-center">
        <h2 className="text-xl md:text-2xl font-light tracking-widest text-slate-200 uppercase drop-shadow-md">
          Madahiye
        </h2>
      </header>

      {/* Center Hero Message */}
      <main className="relative z-10 text-center px-4 max-w-3xl mx-auto my-auto py-12">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight leading-tight drop-shadow-lg mb-4">
          Maintenance mode is on
        </h1>
        <p className="text-xs sm:text-sm md:text-base font-light text-slate-300 tracking-wide max-w-xl mx-auto drop-shadow">
          Site will be available soon. Thank you for your patience!
        </p>

        {/* Optional Subtle Button to View Platform Directly */}
        {onEnterPlatform && (
          <div className="mt-8">
            <button
              onClick={onEnterPlatform}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-slate-200 backdrop-blur-md transition-all cursor-pointer hover:scale-105"
            >
              <span>Explore Platform (Public Mode)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 pb-8 text-center text-xs font-light text-slate-400 tracking-wider">
        © Madahiye 2026
      </footer>

      {/* Floating Right-Edge Lock Button */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-[#1e293b]/90 hover:bg-[#334155] active:bg-[#0f172a] text-white p-3.5 rounded-l-2xl shadow-2xl border-y border-l border-white/10 backdrop-blur-md transition-all cursor-pointer focus:outline-none hover:pl-4 group"
        aria-label="Toggle Login Panel"
        title="Admin / User Login"
      >
        {isDrawerOpen ? (
          <Unlock className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
        ) : (
          <Lock className="w-6 h-6 text-slate-200 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Dark Slide-Out Login Drawer from Right */}
      <div 
        className={`fixed top-0 right-0 h-full w-[310px] sm:w-[360px] bg-[#111827]/95 backdrop-blur-2xl border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.7)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-7 sm:p-8 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <h3 className="text-xl font-normal text-slate-100 tracking-wide">
              User Login
            </h3>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Lost Password Modal / Notice */}
          {showLostPassword ? (
            <div className="p-4 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-300 space-y-3 mb-6">
              <p className="font-bold text-white">Reset / Recover Access</p>
              <p className="text-[11px] leading-relaxed text-slate-300">
                To reset your password or recover administrator credentials, contact Madahiye Support at:
              </p>
              <p className="text-rose-400 font-bold">📞 +252 61 679 6362</p>
              <button
                type="button"
                onClick={() => setShowLostPassword(false)}
                className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username / Email Input */}
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
        </div>

        {/* Bottom Helper Info */}
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-500">
            Madahiye Emergency Platform
          </p>
          <p className="text-[10px] text-slate-600 mt-1">
            Admin: <span className="text-slate-400 font-mono">Emre@gmail.com</span> / <span className="text-slate-400 font-mono">321</span>
          </p>
        </div>
      </div>

      {/* Backdrop overlay when Drawer is open */}
      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}
    </div>
  );
}
