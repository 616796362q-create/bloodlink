import React from 'react';

export default function Navbar({ activeView, setActiveView, onOpenAuth, currentUser, onOpenDashboard, onLogout }) {
  const handleHomeClick = () => {
    if (currentUser) {
      onOpenDashboard();
    } else {
      setActiveView('home');
    }
  };

  return (
    <header className="glass-header sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo -> Always goes to Home landing page */}
          <button onClick={() => setActiveView('home')} className="flex items-center group text-left cursor-pointer">
            <img 
              src="/logo.png" 
              alt="Madahiye Logo" 
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => setActiveView('home')} 
              className={`hover:text-rose-600 transition-colors ${activeView === 'home' ? 'text-rose-600 font-bold' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveView('find-blood')} 
              className={`hover:text-rose-600 transition-colors flex items-center ${activeView === 'find-blood' ? 'text-rose-600 font-bold' : ''}`}
            >
              <span>Find Blood</span>
            </button>
            <button 
              onClick={() => setActiveView('how-it-works')} 
              className={`hover:text-rose-600 transition-colors ${activeView === 'how-it-works' ? 'text-rose-600 font-bold' : ''}`}
            >
              How It Works
            </button>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {!currentUser ? (
              <button 
                onClick={onOpenAuth} 
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right text-xs">
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
                  onClick={onOpenDashboard} 
                  className={`px-4 py-2.5 font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer ${
                    currentUser.role === 'admin' 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                >
                  {currentUser.role === 'admin' ? '🛡️ Admin Panel' : 'My Dashboard'}
                </button>
                <button 
                  onClick={onLogout} 
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
