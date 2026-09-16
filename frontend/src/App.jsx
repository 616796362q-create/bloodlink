import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FindBlood from './components/FindBlood';
import DonorProfileModal from './components/DonorProfileModal';
import DonorDashboard from './components/DonorDashboard';
import ReceiverDashboard from './components/ReceiverDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import SuccessModal from './components/SuccessModal';

import { INITIAL_DONORS, INITIAL_REQUESTS, INITIAL_PAYMENTS, INITIAL_USERS } from './services/mockData';
import { fetchDonors, createBloodRequest, updateRequestStatus, toggleDonorAvailability, fetchAdminStats, toggleUserBlock, registerUser, loginUser, editUser, deleteUser } from './services/api';

export default function App() {
  const [activeView, setActiveView] = useState('home'); // home, find-blood, how-it-works, donor-dashboard, receiver-dashboard, admin-dashboard
  const [activeRole, setActiveRole] = useState('guest'); // guest, donor, receiver, admin
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bloodlink_user') || 'null'); } catch { return null; }
  });

  const [donors, setDonors] = useState(INITIAL_DONORS || []);
  const [requests, setRequests] = useState(INITIAL_REQUESTS || []);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS || []);
  const [users, setUsers] = useState(INITIAL_USERS || []);
  const [receivers, setReceivers] = useState([]);

  const [selectedDonorProfile, setSelectedDonorProfile] = useState(null);
  const [selectedDonorForRequest, setSelectedDonorForRequest] = useState(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState('login');
  const [authModalRole, setAuthModalRole] = useState('donor');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Load from API gracefully on mount
  useEffect(() => {
    async function loadData() {
      try {
        const fetchedDonorsData = await fetchDonors();
        if (fetchedDonorsData && Array.isArray(fetchedDonorsData) && fetchedDonorsData.length > 0) {
          setDonors(fetchedDonorsData);
        }
      } catch (err) {
        console.warn('Initial donors load (using local cache):', err.message);
      }
    }
    loadData();
  }, []);

  // Re-fetch fresh data whenever the admin dashboard is opened
  useEffect(() => {
    if (activeView === 'admin-dashboard' && currentUser?.role === 'admin') {
      refreshData();
    }
  }, [activeView]);

  const startSession = (user, customView = null) => {
    if (!user) return;
    const role = user.role || 'donor';
    setCurrentUser(user);
    setActiveRole(role);
    if (customView) {
      setActiveView(customView);
    } else if (activeView === 'find-blood' || activeView === 'home' || activeView === 'how-it-works') {
      // Keep on current page so user sees find-blood donors or landing page immediately!
    } else {
      setActiveView(role === 'admin' ? 'admin-dashboard' : `${role}-dashboard`);
    }
    localStorage.setItem('bloodlink_user', JSON.stringify(user));
  };

  useEffect(() => {
    if (currentUser) {
      setActiveRole(currentUser.role || 'donor');
    }
  }, []);

  const refreshData = async () => {
    try {
      const stats = await fetchAdminStats();
      if (stats) {
        if (Array.isArray(stats.donors)) setDonors(stats.donors);
        if (Array.isArray(stats.requests)) setRequests(stats.requests);
        if (Array.isArray(stats.payments)) setPayments(stats.payments);
        if (Array.isArray(stats.users)) setUsers(stats.users);
        if (Array.isArray(stats.receivers)) setReceivers(stats.receivers);
      }
    } catch (err) {
      console.warn('[BloodLink] refreshData failed:', err);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Direct WhatsApp Blood Request → Always goes to Madahiye (+252 61 679 6362)
  const handleDirectWhatsAppRequest = (donor) => {
    // Connect directly to Madahiye company official WhatsApp
    const MADAHIYE_WA = "252616796362";

    const waText = 
      `*🩸 CODSIGA DHIIGA — SHIRKADDA MADAHIYE*\n` +
      `----------------------------------------\n` +
      `*Assalaamu Calaykum Maamulka Madahiye*,\n` +
      `Waxaan u baahanahay dhiig degdeg ah oo aan ka helay madasha Madahiye.\n\n` +
      `📋 *Faahfaahinta Codsiga:* \n` +
      `• *Nooca Dhiigga loo baahan yahay:* ${donor.bloodType}\n` +
      `• *Goobta / Degmada:* ${donor.district || 'Hodan'}, ${donor.region || 'Banaadir'}\n` +
      `• *Magaca Codsadaha:* ${currentUser?.fullName || 'Codsade'}\n` +
      `• *Telefoonka Codsadaha:* ${currentUser?.phone || 'Lama dhiibin'}\n\n` +
      `👤 *Dhiig-bixiyaha (Donor) aan ka doortay nidaamka:* \n` +
      `• *Magaca Donor-ka:* ${donor.fullName}\n` +
      `• *Dhiiggiisa:* ${donor.bloodType}\n` +
      `• *Goobta Donor-ka:* ${donor.district || 'Hodan'}, ${donor.region || 'Banaadir'}\n` +
      `----------------------------------------\n` +
      `Fadlan si degdeg ah noola soo xiriira si aan dhiiggan u helno. Mahadsanid! 🙏`;

    const whatsappUrl = `https://wa.me/${MADAHIYE_WA}?text=${encodeURIComponent(waText)}`;

    try {
      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.warn('WhatsApp popup notice:', e);
    }

    showToast(`💬 WhatsApp-ka Madahiye (+252 61 679 6362) ayaa toos loogu xirayaa...`);
  };

  // Donor Status Update (Accept / Reject)
  const handleStatusChange = async (requestId, newStatus) => {
    const updated = await updateRequestStatus(requestId, newStatus);
    setRequests(prev => (prev || []).map(r => r.id === requestId ? updated : r));
    showToast(`Request ${newStatus.toLowerCase()} successfully!`);
  };

  // Donor Availability Toggle (Set Available / Set Away)
  const handleToggleAvailability = async (newStatus) => {
    try {
      let donor = (donors || []).find(d => 
        currentUser && (
          (d.userId && d.userId === currentUser.id) || 
          (d.id && d.id === currentUser.id) ||
          (d.phone && currentUser.phone && d.phone.trim() === currentUser.phone.trim())
        )
      );

      if (!donor) {
        donor = {
          id: 'dnr-' + Date.now(),
          userId: currentUser?.id || 'usr-' + Date.now(),
          fullName: currentUser?.fullName || 'Donor Member',
          phone: currentUser?.phone || '',
          bloodType: currentUser?.bloodType || 'O+',
          region: currentUser?.region || 'Banaadir',
          district: currentUser?.district || 'Hodan',
          availability: newStatus,
          donationsCount: 0,
          verified: true
        };
        setDonors(prev => [donor, ...(prev || [])]);
        showToast(newStatus === 'Available' ? '🟢 Xaaladda: Available (Profile-kaagu wuu muuqdaa)' : '🔒 Xaaladda: Away (Xogtaada waa la qariyay)');
        return;
      }

      setDonors(prev => (prev || []).map(d => (d.id === donor.id || d.userId === donor.userId || d.phone === donor.phone) ? { ...d, availability: newStatus } : d));
      try {
        await toggleDonorAvailability(donor.id, newStatus);
      } catch (err) {
        console.warn('API sync warning:', err);
      }
      showToast(newStatus === 'Available' ? '🟢 Xaaladda: Available (Profile-kaagu wuu muuqdaa)' : '🔒 Xaaladda: Away (Xogtaada waa la qariyay)');
    } catch (err) {
      showToast(err.message || 'Unable to update availability.');
    }
  };

  // Admin Toggle Block User
  const handleToggleBlock = async (userId) => {
    const updated = await toggleUserBlock(userId);
    setUsers(prev => (prev || []).map(u => u.id === userId ? updated : u));
    showToast('User block status updated by Admin!');
  };

  // Admin Edit User
  const handleEditUser = async (userId, data) => {
    try {
      const updated = await editUser(userId, data);
      setUsers(prev => (prev || []).map(u => u.id === userId ? { ...u, ...updated } : u));
      showToast('User updated successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to update user.');
    }
  };

  // Admin Delete User
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(prev => (prev || []).filter(u => u.id !== userId));
      setDonors(prev => (prev || []).filter(d => d.userId !== userId && d.id !== userId));
      showToast('User deleted successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to delete user.');
    }
  };

  // Admin Add Donor
  const handleAdminAddDonor = async (donorData) => {
    try {
      const res = await registerUser({
        ...donorData,
        role: 'donor'
      });
      if (res.donor) {
        setDonors(prev => [res.donor, ...(prev || []).filter(d => d.id !== res.donor.id)]);
      }
      setUsers(prev => [res, ...(prev || []).filter(u => u.id !== res.id)]);
      await refreshData();
      showToast(`✅ Donor (${donorData.fullName}) si guul leh ayaa loogu daray!`);
      return res;
    } catch (err) {
      showToast(err.message || 'Lama darin donor-ka.');
      throw err;
    }
  };

  // Admin Toggle Donor Availability
  const handleAdminToggleDonorAvailability = async (donorId, newStatus) => {
    try {
      setDonors(prev => (prev || []).map(d => d.id === donorId ? { ...d, availability: newStatus } : d));
      await toggleDonorAvailability(donorId, newStatus);
      showToast(`Donor availability status: ${newStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update donor availability.');
    }
  };

  // Register Handler
  const handleRegisterSuccess = async ({ fullName, email, phone, password, role, bloodType, region, district }) => {
    try {
      const res = await registerUser({ fullName, email, phone, password, role, bloodType, region, district });
      const userRole = res.role || role || 'donor';
      const newUser = {
        id: res.id || res.userId || 'usr-' + Date.now(),
        fullName: res.fullName || fullName,
        email: res.email || email,
        phone: res.phone || phone || '',
        role: userRole,
        bloodType: res.bloodType || bloodType || 'O+',
        region: res.region || region || 'Banaadir',
        district: res.district || district || ''
      };

      if (res.donor) {
        setDonors(prev => [res.donor, ...(prev || []).filter(d => d.id !== res.donor.id)]);
      }

      setIsAuthOpen(false);
      startSession(newUser);
      showToast('Koontadaada Madahiye waa diyaar.');

      try {
        await refreshData();
      } catch (e) {
        console.warn('Background refresh error ignored', e);
      }
    } catch (err) {
      showToast(err.message || 'Diiwaangelintu ma guuleysan. Fadlan ku celi.');
    }
  };

  const handleLogin = async ({ email, phone, password }) => {
    try {
      const user = await loginUser({ email, phone, password });
      setIsAuthOpen(false);
      startSession(user);
      showToast(`Kusoo dhawoow, ${user.fullName}.`);
      try { await refreshData(); } catch (e) {}
    } catch (err) {
      showToast(err.message || 'Galitaanku ma guuleysan. Hubi Gmail & Password.');
    }
  };

  const activeDonor = (donors || []).find(d => 
    currentUser && (
      (d.userId && d.userId === currentUser.id) || 
      (d.phone && currentUser.phone && d.phone.trim() === currentUser.phone.trim())
    )
  );

  const donorRequests = (requests || []).filter(r => 
    currentUser && (
      (r.donorUserId && r.donorUserId === currentUser.id) ||
      (activeDonor && r.donorId && r.donorId === activeDonor.id) ||
      (r.donorPhone && currentUser.phone && r.donorPhone.trim() === currentUser.phone.trim())
    )
  );

  const receiverRequests = (requests || []).filter(r => 
    currentUser && (
      (r.receiverId && r.receiverId === currentUser.id) ||
      (r.receiverPhone && currentUser.phone && r.receiverPhone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')) ||
      (r.receiverName && currentUser.fullName && r.receiverName.trim().toLowerCase() === currentUser.fullName.trim().toLowerCase())
    )
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-navy-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-bounce">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar 
        activeView={activeView}
        setActiveView={setActiveView}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onOpenAuth={() => {
          setAuthModalView('login');
          setIsAuthOpen(true);
        }}
        currentUser={currentUser}
        onOpenDashboard={() => setActiveView(currentUser?.role === 'admin' ? 'admin-dashboard' : `${currentUser?.role}-dashboard`)}
        onLogout={() => { localStorage.removeItem('bloodlink_user'); setCurrentUser(null); setActiveRole('guest'); setActiveView('home'); }}
      />

      {/* Main Views Router */}
      <main className="flex-grow">
        {activeView === 'home' && (
          currentUser ? (
            currentUser.role === 'admin' ? (
              <AdminDashboard 
                users={users}
                requests={requests}
                payments={payments}
                receivers={receivers}
                onToggleBlock={handleToggleBlock}
              />
            ) : currentUser.role === 'receiver' ? (
              <ReceiverDashboard 
                user={currentUser}
                requests={receiverRequests}
                onFindBloodClick={() => setActiveView('find-blood')}
              />
            ) : (
              <DonorDashboard 
                user={currentUser}
                donor={activeDonor}
                requests={donorRequests}
                onStatusChange={handleStatusChange}
                onToggleAvailability={handleToggleAvailability}
              />
            )
          ) : (
            <>
              <Hero 
                onFindBlood={() => setActiveView('find-blood')}
                onBecomeDonor={() => {
                  setAuthModalView('register-step1');
                  setAuthModalRole('donor');
                  setIsAuthOpen(true);
                }}
                donorsCount={donors ? donors.length : 0}
                livesSaved={requests ? requests.filter(r => r.status === 'Completed').length : 0}
              />
              <HowItWorks 
                onSearchClick={() => setActiveView('find-blood')}
              />
            </>
          )
        )}

        {activeView === 'how-it-works' && (
          <HowItWorks onSearchClick={() => setActiveView('find-blood')} />
        )}

        {activeView === 'find-blood' && (
          !currentUser ? (
            <div className="py-20 max-w-2xl mx-auto px-4 text-center">
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xl relative overflow-hidden">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl font-bold shadow-md shadow-rose-500/10">
                  🩸
                </div>
                <h2 className="text-2xl font-black text-navy-900">Find Blood Donors Locked</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  Fadlan gal akoonkaaga (Login) ama is-diiwaangeli (Sign Up) si aad u aragto liiska dhiig-bixiyeyaasha (Donors) oo aad dhiig u codsato.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    onClick={() => { setAuthModalView('login'); setIsAuthOpen(true); }} 
                    className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    🔑 Login (Soo Gal)
                  </button>
                  <button 
                    onClick={() => { setAuthModalView('register-step1'); setIsAuthOpen(true); }} 
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    ✨ Sign Up (Is Diiwaangeli)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <FindBlood 
              donors={donors}
              currentUser={currentUser}
              onSelectDonorProfile={donor => {
                setSelectedDonorProfile(donor);
              }}
              onRequestBlood={donor => {
                handleDirectWhatsAppRequest(donor);
              }}
            />
          )
        )}

        {activeView === 'donor-dashboard' && (
          !currentUser ? (
            <div className="py-20 max-w-2xl mx-auto px-4 text-center">
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xl relative overflow-hidden">
                <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl font-bold shadow-md shadow-rose-500/10">
                  🩸
                </div>
                <h2 className="text-2xl font-black text-navy-900">Donor Portal Locked</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  Sign in or register a Donor account to access your personal dashboard, update donation availability, and respond to incoming blood requests.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    onClick={() => setIsAuthOpen(true)} 
                    className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
                  >
                    🔑 Sign In / Register as Donor
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <DonorDashboard 
              user={currentUser}
              donor={activeDonor}
              requests={donorRequests}
              onStatusChange={handleStatusChange}
              onToggleAvailability={handleToggleAvailability}
            />
          )
        )}

        {activeView === 'receiver-dashboard' && (
          !currentUser ? (
            <div className="py-20 max-w-2xl mx-auto px-4 text-center">
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xl relative overflow-hidden">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl font-bold shadow-md shadow-blue-500/10">
                  ❤️
                </div>
                <h2 className="text-2xl font-black text-navy-900">Receiver Portal Locked</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  Sign in or register an account to track your blood requests, check payment receipts, and unlock verified donor contact phone numbers.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    onClick={() => setIsAuthOpen(true)} 
                    className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
                  >
                    🔑 Sign In / Register as Receiver
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ReceiverDashboard 
              user={currentUser}
              requests={receiverRequests}
              onFindBloodClick={() => setActiveView('find-blood')}
            />
          )
        )}

        {activeView === 'admin-dashboard' && (
          !currentUser || currentUser.role !== 'admin' ? (
            <div className="py-20 max-w-2xl mx-auto px-4 text-center">
              <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xl relative overflow-hidden">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl font-bold shadow-md shadow-purple-500/10">
                  🛡️
                </div>
                <h2 className="text-2xl font-black text-navy-900">Admin Dashboard Restricted</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  Administrative privilege required. Please sign in using your Admin credentials (+252 61 679 6362).
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    onClick={() => setIsAuthOpen(true)} 
                    className="w-full sm:w-auto px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all hover:scale-[1.02]"
                  >
                    🔐 Sign In as Administrator
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <AdminDashboard 
              users={users}
              donors={donors}
              requests={requests}
              payments={payments}
              receivers={receivers}
              onToggleBlock={handleToggleBlock}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onAddDonor={handleAdminAddDonor}
              onToggleDonorAvailability={handleAdminToggleDonorAvailability}
              onRefresh={refreshData}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-slate-400 text-xs py-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-sm">
              <img src="/logo.png" alt="Madahiye" className="h-7 w-auto object-contain" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Connect. Donate. Save a Life. © 2026 Madahiye Community Platform.</p>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-xs font-semibold">
            <button onClick={() => setActiveView('home')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => setActiveView('find-blood')} className="hover:text-white transition-colors">Find Blood</button>
            <button onClick={() => setActiveView('how-it-works')} className="hover:text-white transition-colors">How It Works</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedDonorProfile && (
        <DonorProfileModal 
          donor={selectedDonorProfile}
          onClose={() => setSelectedDonorProfile(null)}
          onRequestBlood={donor => handleDirectWhatsAppRequest(donor)}
        />
      )}

      {isAuthOpen && (
        <AuthModal 
          key={`${authModalView}-${authModalRole}`}
          onClose={() => setIsAuthOpen(false)}
          onRegisterSuccess={handleRegisterSuccess}
          onLogin={handleLogin}
          initialView={authModalView}
          initialRole={authModalRole}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal 
          onClose={() => setIsSuccessOpen(false)}
          onViewReceiverDashboard={() => {
            setActiveRole('receiver');
            setActiveView('receiver-dashboard');
          }}
        />
      )}

    </div>
  );
}
