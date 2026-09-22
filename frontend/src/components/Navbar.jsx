import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Droplet, HelpCircle, LogIn, LayoutDashboard, LogOut, User } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, onOpenAuth, currentUser, onOpenDashboard, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <>
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo -> Always goes to Home */}
            <button 
              type="button"
              onClick={() => handleNavClick('home')} 
              className="flex items-center group text-left cursor-pointer focus:outline-none"
            >
              <img 
                src="/logo.png" 
                alt="Madahiye Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
              <button 
                type="button"
                onClick={() => handleNavClick('home')} 
                className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'home' ? 'text-rose-600 font-extrabold' : ''
                }`}
              >
                Home
              </button>
              <button 
                type="button"
                onClick={() => handleNavClick('find-blood')} 
                className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'find-blood' ? 'text-rose-600 font-extrabold' : ''
                }`}
              >
                Find Blood
              </button>
              <button 
                type="button"
                onClick={() => handleNavClick('how-it-works')} 
                className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'how-it-works' ? 'text-rose-600 font-extrabold' : ''
                }`}
              >
                How It Works
              </button>
            </nav>

            {/* Desktop Actions (Login / Dashboard / Logout) */}
            <div className="hidden md:flex items-center space-x-4">
              {!currentUser ? (
                <button 
                  type="button"
                  onClick={handleAuthClick} 
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
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
                    type="button"
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
                    type="button"
                    onClick={handleLogoutClick} 
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Top Controls: Find Blood Quick Badge + Hamburger Button */}
            <div className="flex items-center md:hidden gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('find-blood')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'find-blood' 
                    ? 'bg-rose-600 text-white shadow-sm' 
                    : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}
              >
                <Droplet className="w-3.5 h-3.5 fill-current" />
                <span>Find Blood</span>
              </button>

              {/* 3-Line Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-900 transition-colors focus:outline-none cursor-pointer"
                aria-label="Menu"
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

        {/* Mobile Dropdown Menu (Opens cleanly from top header) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-2xl">
            
            {/* User Info if logged in */}
            {currentUser && (
              <div className="p-3 mb-2 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-900">{currentUser.fullName}</p>
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

            {/* Mobile Navigation Links */}
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left cursor-pointer transition-colors ${
                activeView === 'home'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-slate-800 hover:bg-slate-100 active:bg-slate-200'
              }`}
            >
              <Home className="w-5 h-5 text-rose-600" />
              <span>Home (Bogga Hore)</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('find-blood')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left cursor-pointer transition-colors ${
                activeView === 'find-blood'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-slate-800 hover:bg-slate-100 active:bg-slate-200'
              }`}
            >
              <Droplet className="w-5 h-5 text-rose-600 fill-rose-100" />
              <span>Find Blood (Raadi Dhiig)</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('how-it-works')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-left cursor-pointer transition-colors ${
                activeView === 'how-it-works'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-slate-800 hover:bg-slate-100 active:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-5 h-5 text-rose-600" />
              <span>How It Works (Sida uu u Shaqeeyo)</span>
            </button>

            {/* Mobile User Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {!currentUser ? (
                <button
                  type="button"
                  onClick={handleAuthClick}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Is-diiwaangeli</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleDashboardClick}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer ${
                      currentUser.role === 'admin' 
                        ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' 
                        : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{currentUser.role === 'admin' ? '🛡️ Fur Admin Panel' : 'Fur Dashboard-kaaga'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout (Ka Bax)</span>
                  </button>
                </>
              )}
            </div>

          </div>
        )}
      </header>

      {/* Floating Dark Backdrop when mobile menu is open */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Modern Mobile Bottom Navigation Bar (Permanent at bottom of screen on Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-2 flex items-center justify-around">
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'home' ? 'text-rose-600 font-black' : 'text-slate-500 font-semibold'
          }`}
        >
          <Home className={`w-5 h-5 ${activeView === 'home' ? 'text-rose-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Highlighted Find Blood Button in center */}
        <button
          type="button"
          onClick={() => handleNavClick('find-blood')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeView === 'find-blood' 
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 font-black' 
              : 'bg-rose-50 text-rose-600 font-bold border border-rose-100'
          }`}
        >
          <Droplet className={`w-5 h-5 ${activeView === 'find-blood' ? 'text-white fill-white' : 'text-rose-600 fill-rose-100'}`} />
          <span className="text-[10px] mt-0.5">Find Blood</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavClick('how-it-works')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'how-it-works' ? 'text-rose-600 font-black' : 'text-slate-500 font-semibold'
          }`}
        >
          <HelpCircle className={`w-5 h-5 ${activeView === 'how-it-works' ? 'text-rose-600 stroke-[2.5]' : 'text-slate-500'}`} />
          <span className="text-[10px] mt-0.5">Info</span>
        </button>

        {!currentUser ? (
          <button
            type="button"
            onClick={handleAuthClick}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 font-semibold transition-all cursor-pointer"
          >
            <User className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] mt-0.5">Login</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDashboardClick}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
              currentUser.role === 'admin' ? 'text-purple-600 font-black' : 'text-rose-600 font-black'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{currentUser.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
          </button>
        )}
      </div>
    </>
  );
}
