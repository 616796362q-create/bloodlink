import React, { useState } from 'react';
import { Menu, X, Home, Droplet, HelpCircle, LogIn, LayoutDashboard, LogOut, Shield } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, onOpenAuth, currentUser, onOpenDashboard, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    onOpenDashboard();
    setMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    onOpenAuth();
    setMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass-header sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo -> Always goes to Home landing page */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center group text-left cursor-pointer"
          >
            <img 
              src="/logo.png" 
              alt="Madahiye Logo" 
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => handleNavClick('home')} 
              className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 ${activeView === 'home' ? 'text-rose-600 font-bold' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('find-blood')} 
              className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 ${activeView === 'find-blood' ? 'text-rose-600 font-bold' : ''}`}
            >
              <span>Find Blood</span>
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')} 
              className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 ${activeView === 'how-it-works' ? 'text-rose-600 font-bold' : ''}`}
            >
              How It Works
            </button>
          </nav>

          {/* Desktop Header Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!currentUser ? (
              <button 
                onClick={handleAuthClick} 
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <strong className="block text-slate-800 font-bold">{currentUser.fullName}</strong>
                  <span className={`uppercase text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                    currentUser.role === 'admin' 
                      ? 'text-purple-600 bg-purple-50 border-purple-200' 
                      : 'text-rose-600 bg-rose-50 border-rose-100'
                  }`}>
                    {currentUser.role === 'admin' ? '🛡️ Admin' : (currentUser.role === 'donor' ? '🩸 Donor' : '❤️ Receiver')}
                  </span>
                </div>
                <button 
                  onClick={handleDashboardClick} 
                  className={`px-4 py-2.5 font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentUser.role === 'admin' 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20' 
                      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{currentUser.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}</span>
                </button>
                <button 
                  onClick={handleLogoutClick} 
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden gap-2">
            {!currentUser ? (
              <button 
                onClick={handleAuthClick} 
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                Login
              </button>
            ) : (
              <button 
                onClick={handleDashboardClick} 
                className={`px-3 py-2 text-white font-extrabold text-xs rounded-xl shadow-sm ${
                  currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-rose-600'
                }`}
              >
                {currentUser.role === 'admin' ? '🛡️ Admin' : 'Dashboard'}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900" />
              ) : (
                <Menu className="w-6 h-6 text-slate-900" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          
          {/* User Profile Banner on Mobile if logged in */}
          {currentUser && (
            <div className="p-3 mb-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email || currentUser.phone}</p>
              </div>
              <span className={`uppercase text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                currentUser.role === 'admin' 
                  ? 'text-purple-600 bg-purple-50 border-purple-200' 
                  : 'text-rose-600 bg-rose-50 border-rose-100'
              }`}>
                {currentUser.role === 'admin' ? '🛡️ Admin' : (currentUser.role === 'donor' ? '🩸 Donor' : '❤️ Receiver')}
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeView === 'home'
                ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-100'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-5 h-5 text-rose-600" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNavClick('find-blood')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeView === 'find-blood'
                ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-100'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Droplet className="w-5 h-5 text-rose-600 fill-rose-100" />
            <span>Find Blood</span>
          </button>

          <button
            onClick={() => handleNavClick('how-it-works')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeView === 'how-it-works'
                ? 'bg-rose-50 text-rose-600 shadow-sm border border-rose-100'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-5 h-5 text-rose-600" />
            <span>How It Works</span>
          </button>

          {/* Action Buttons in Mobile Menu */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!currentUser ? (
              <button
                onClick={handleAuthClick}
                className="w-full flex items-center justify-center gap-2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-rose-600/20 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleDashboardClick}
                  className={`w-full flex items-center justify-center gap-2 py-3 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all ${
                    currentUser.role === 'admin' 
                      ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' 
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{currentUser.role === 'admin' ? '🛡️ Open Admin Panel' : 'My Dashboard'}</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
