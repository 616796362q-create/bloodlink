import React, { useState } from 'react';
import { 
  Users, Activity, Shield, ChevronRight, 
  Edit2, Trash2, Lock, Unlock, X, Check, Heart, 
  BarChart2, RefreshCw, Eye, EyeOff, UserPlus, AlertCircle, 
  Plus, Droplet, MapPin, Phone, Search
} from 'lucide-react';

export default function AdminDashboard({ 
  users = [], 
  donors = [], 
  requests = [], 
  receivers = [], 
  onToggleBlock, 
  onEditUser, 
  onDeleteUser, 
  onAddDonor,
  onToggleDonorAvailability,
  onRefresh 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletingUser, setDeletingUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [donorSearch, setDonorSearch] = useState('');

  // Add Donor Modal State
  const [isAddDonorOpen, setIsAddDonorOpen] = useState(false);
  const [newDonor, setNewDonor] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    bloodType: 'O+',
    region: 'Banaadir',
    district: 'Hodan',
    availability: 'Available'
  });
  const [addDonorError, setAddDonorError] = useState('');
  const [submittingDonor, setSubmittingDonor] = useState(false);

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const totalUsers = users.length;
  const allDonors = donors.length > 0 ? donors : users.filter(u => u.role === 'donor').map(u => ({
    id: 'dnr-' + u.id,
    userId: u.id,
    fullName: u.fullName,
    phone: u.phone,
    email: u.email,
    bloodType: u.bloodType || 'O+',
    region: u.region || 'Banaadir',
    district: u.district || 'Hodan',
    availability: u.availability || 'Available',
    donationsCount: 0,
    verified: true
  }));

  const totalDonors = allDonors.length;
  const totalReceivers = users.filter(u => u.role === 'receiver').length || (receivers || []).length;
  const activeRequestsCount = (requests || []).filter(r => r.status === 'Pending' || r.status === 'Accepted').length;

  const registeredReceivers = users.filter(u => u.role === 'receiver');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'donors', label: 'Blood Donors', icon: Heart, count: totalDonors },
    { id: 'users', label: 'All Users', icon: Users, count: totalUsers },
    { id: 'requests', label: 'Blood Requests', icon: Activity, count: (requests || []).length + registeredReceivers.length },
  ];

  const openEdit = (u) => {
    setEditingUser(u);
    setEditForm({ fullName: u.fullName, email: u.email || '', phone: u.phone || '', role: u.role, password: u.password || '' });
  };

  const submitEdit = async () => {
    if (onEditUser) await onEditUser(editingUser.id, editForm);
    setEditingUser(null);
  };

  const handleCreateDonor = async (e) => {
    e.preventDefault();
    setAddDonorError('');

    if (!newDonor.fullName.trim()) {
      setAddDonorError('Fadlan geli magaca buuxa ee donor-ka.');
      return;
    }
    if (!newDonor.phone.trim()) {
      setAddDonorError('Fadlan geli lambarka taleefanka.');
      return;
    }
    if (!newDonor.password || newDonor.password.length < 6) {
      setAddDonorError('Password-ku waa inuu ka koobnaadaa ugu yaraan 6 xaraf.');
      return;
    }

    try {
      setSubmittingDonor(true);
      if (onAddDonor) {
        await onAddDonor({
          fullName: newDonor.fullName.trim(),
          phone: newDonor.phone.trim(),
          email: newDonor.email.trim() || `${newDonor.fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          password: newDonor.password,
          bloodType: newDonor.bloodType,
          region: newDonor.region,
          district: newDonor.district || 'Hodan',
          availability: newDonor.availability
        });
      }
      setIsAddDonorOpen(false);
      setNewDonor({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        bloodType: 'O+',
        region: 'Banaadir',
        district: 'Hodan',
        availability: 'Available'
      });
    } catch (err) {
      setAddDonorError(err.message || 'Lama darin donor-ka.');
    } finally {
      setSubmittingDonor(false);
    }
  };

  const filteredDonorsList = allDonors.filter(d => {
    const q = donorSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (d.fullName && d.fullName.toLowerCase().includes(q)) ||
      (d.phone && d.phone.toLowerCase().includes(q)) ||
      (d.bloodType && d.bloodType.toLowerCase().includes(q)) ||
      (d.district && d.district.toLowerCase().includes(q)) ||
      (d.region && d.region.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-60'} min-h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-200 shrink-0`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs shrink-0">
                <img src="/logo.png" alt="Madahiye" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block leading-tight">Madahiye</span>
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">Admin Control</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs mx-auto shrink-0">
              <img src="/logo.png" alt="Madahiye" className="w-full h-full object-contain" />
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-xl text-xs font-bold transition-all gap-3 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {!sidebarCollapsed && item.count !== undefined && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center shrink-0 shadow-xs">
              <img src="/logo.png" alt="Madahiye" className="w-full h-full object-contain" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <p className="text-[11px] font-bold text-slate-800">System Admin</p>
                <p className="text-[10px] text-emerald-600 font-semibold">● Online</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'donors' && 'Blood Donors (Dadka Dhiigga Bixiya)'}
                {activeTab === 'users' && 'All Registered Users'}
                {activeTab === 'requests' && 'Blood Requests & Registered Needers'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Madahiye Admin Control Panel</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddDonorOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Ku dar Donor</span>
              </button>
              <button
                onClick={onRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Real Accurate Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Voluntary Donors', value: totalDonors, color: 'text-rose-600', bg: 'bg-rose-50', icon: Heart, onClick: () => setActiveTab('donors') },
                  { label: 'Blood Needers', value: totalReceivers, color: 'text-blue-600', bg: 'bg-blue-50', icon: Users, onClick: () => setActiveTab('requests') },
                  { label: 'Active Requests', value: activeRequestsCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: Activity, onClick: () => setActiveTab('requests') },
                  { label: 'Total Users', value: totalUsers, color: 'text-purple-600', bg: 'bg-purple-50', icon: Shield, onClick: () => setActiveTab('users') },
                ].map(card => (
                  <div 
                    key={card.label} 
                    onClick={card.onClick}
                    className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start gap-3 cursor-pointer hover:border-slate-300 transition-colors`}
                  >
                    <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                      <p className={`text-2xl font-black mt-0.5 ${card.color}`}>{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Donors Highlights */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-600" />
                      Registered Blood Donors ({totalDonors})
                    </h2>
                    <p className="text-[11px] text-slate-400">Voluntary blood donors in the platform</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('donors')}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                  >
                    View All Donors →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3 rounded-l-xl">Donor Name</th>
                        <th className="p-3">Blood Type</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allDonors.slice(0, 6).map(d => (
                        <tr key={d.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                              {d.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <span>{d.fullName}</span>
                          </td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                              {d.bloodType}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-700">{d.phone || '—'}</td>
                          <td className="p-3 text-slate-500">{d.district ? `${d.district}, ${d.region}` : d.region}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.availability === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                              {d.availability === 'Available' ? '🟢 Available' : '🔴 Away'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                const matchingUser = users.find(u => u.id === d.userId || u.id === d.id);
                                if (matchingUser) openEdit(matchingUser);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10px]"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {allDonors.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">No donors registered yet.</div>
                  )}
                </div>
              </div>

              {/* Users Overview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-700">
                    Recent Registered Users ({users.length})
                  </h2>
                  <button onClick={() => setActiveTab('users')} className="text-xs text-blue-600 font-bold">
                    View All Users →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3 rounded-l-xl">Name</th>
                        <th className="p-3">Email / Phone</th>
                        <th className="p-3">Password</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right rounded-r-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.slice(0, 6).map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-slate-800">{u.fullName}</td>
                          <td className="p-3 text-slate-500 font-mono text-[10px]">{u.email || u.phone}</td>
                          <td className="p-3 font-mono text-[11px]">
                            {u.password ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-700">
                                  {visiblePasswords[u.id] ? u.password : '••••••••'}
                                </span>
                                <button
                                  onClick={() => togglePasswordVisibility(u.id)}
                                  className="text-slate-400 hover:text-slate-600 p-0.5"
                                  title={visiblePasswords[u.id] ? "Hide" : "Show"}
                                >
                                  {visiblePasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            {u.role === 'admin' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700">ADMIN</span>
                            ) : u.role === 'receiver' ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">🆘 RECEIVER</span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">🩸 DONOR ({u.bloodType || 'O+'})</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600 font-medium text-[11px]">
                            {u.district ? `${u.district}, ${u.region || ''}` : (u.region || '—')}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {u.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => openEdit(u)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10px]"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ─── Dedicated Blood Donors Tab ─── */}
          {activeTab === 'donors' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-600" />
                    All Blood Donors ({allDonors.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage voluntary donors, update availability, or register new donors.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search donor name, phone, blood..."
                      value={donorSearch}
                      onChange={e => setDonorSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 w-64"
                    />
                  </div>

                  <button
                    onClick={() => setIsAddDonorOpen(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Ku dar Donor Cusub</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Donor Name</th>
                      <th className="p-4">Blood Type</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Location (District/Region)</th>
                      <th className="p-4">Availability</th>
                      <th className="p-4">Verified</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDonorsList.map(d => {
                      const matchingUser = users.find(u => u.id === d.userId || u.id === d.id || (u.phone && u.phone === d.phone));
                      const isAvail = d.availability === 'Available';

                      return (
                        <tr key={d.id} className="hover:bg-slate-50/80">
                          <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center font-black text-xs shadow-sm">
                              {d.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{d.fullName}</p>
                              <p className="text-[10px] text-slate-400">{d.email || 'No email'}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-xl text-xs font-black bg-rose-100 text-rose-700 border border-rose-200 shadow-xs">
                              {d.bloodType}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-800">
                            💬 {d.phone || '—'}
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            📍 {d.district ? `${d.district}, ` : ''}{d.region || 'Banaadir'}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => onToggleDonorAvailability && onToggleDonorAvailability(d.id, isAvail ? 'Not Available' : 'Available')}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isAvail 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                              title="Click to toggle availability"
                            >
                              <span>{isAvail ? '🟢 Available' : '🔴 Away'}</span>
                            </button>
                          </td>
                          <td className="p-4">
                            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                              ✓ Verified
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {matchingUser && (
                                <button
                                  onClick={() => openEdit(matchingUser)}
                                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10px] flex items-center gap-1"
                                >
                                  <Edit2 className="w-3 h-3" /> Edit
                                </button>
                              )}
                              {matchingUser && (
                                <button
                                  onClick={() => setDeletingUser(matchingUser)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredDonorsList.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No donors match your search. Click "+ Ku dar Donor Cusub" to add one.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email / Phone</th>
                      <th className="p-4">Password</th>
                      <th className="p-4">Role / Blood Needed</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="p-4 font-bold text-slate-800">{u.fullName}</td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">{u.email || u.phone}</td>
                        <td className="p-4 font-mono text-[11px]">
                          {u.password ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-700">
                                {visiblePasswords[u.id] ? u.password : '••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(u.id)}
                                className="text-slate-400 hover:text-slate-600 p-0.5"
                                title={visiblePasswords[u.id] ? "Hide password" : "Show password"}
                              >
                                {visiblePasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          {u.role === 'admin' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700">
                              ADMIN
                            </span>
                          ) : u.role === 'receiver' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                              🆘 NEED BLOOD ({u.bloodType || 'O+'})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                              🩸 DONOR ({u.bloodType || 'O+'})
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-slate-600 font-medium">
                          {u.district ? `${u.district}, ${u.region || ''}` : (u.region || '—')}
                        </td>
                        <td className="p-4 text-slate-400">{u.createdAt || '—'}</td>
                        <td className="p-4">
                          <button
                            onClick={() => onToggleBlock(u.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              u.isBlocked
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            {u.isBlocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(u)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              title="Edit user"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => setDeletingUser(u)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              
              {/* Registered Receivers */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5">
                <div className="mb-4">
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    🆘 Registered Blood Receivers / Needers ({ registeredReceivers.length })
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Users seeking blood with specified blood group & region</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Receiver Name</th>
                        <th className="p-3">Email / Phone</th>
                        <th className="p-3">Blood Type Needed</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Registered Date</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registeredReceivers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-bold text-slate-800">{u.fullName}</td>
                          <td className="p-3 text-slate-500 font-mono text-[10px]">{u.phone || u.email}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                              🩸 {u.bloodType || 'O+'}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">
                            {u.district ? `${u.district}, ${u.region || ''}` : (u.region || '—')}
                          </td>
                          <td className="p-3 text-slate-400">{u.createdAt || '—'}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => openEdit(u)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10px] inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {registeredReceivers.length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-xs">No registered blood receivers yet.</div>
                  )}
                </div>
              </div>

              {/* Direct Blood Requests */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5">
                <div className="mb-4">
                  <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600" />
                    🩸 Blood Requests ({ (requests || []).length })
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Requests submitted through the platform</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Req ID</th>
                        <th className="p-4">Receiver</th>
                        <th className="p-4">Donor</th>
                        <th className="p-4">Blood Needed</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(requests || []).map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/80">
                          <td className="p-4 font-mono font-bold text-slate-700">{r.id}</td>
                          <td className="p-4 font-semibold text-slate-800">{r.receiverName}</td>
                          <td className="p-4 font-medium text-slate-700">{r.donorName}</td>
                          <td className="p-4 font-bold text-rose-600">{r.bloodType} ×{r.units} Unit(s)</td>
                          <td className="p-4 text-slate-500">{r.district}, {r.region}</td>
                          <td className="p-4 text-slate-400">{r.createdAt || '—'}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : r.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(requests || []).length === 0 && (
                    <div className="text-center py-10 text-slate-400 text-xs">No blood requests created yet.</div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ─── ADD DONOR MODAL ─── */}
      {isAddDonorOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Ku dar Donor Cusub</h3>
                  <p className="text-[11px] text-slate-400">Diiwaangeli qof dhiig bixiye ah (Add voluntary blood donor)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddDonorOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addDonorError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addDonorError}</span>
              </div>
            )}

            <form onSubmit={handleCreateDonor} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Magaca Buuxa (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Axmed Cali Maxamed"
                  value={newDonor.fullName}
                  onChange={e => setNewDonor({ ...newDonor, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Phone & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefoonka (Phone) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 615123456"
                    value={newDonor.phone}
                    onChange={e => setNewDonor({ ...newDonor, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Ugu yaraan 6 xaraf"
                    value={newDonor.password}
                    onChange={e => setNewDonor({ ...newDonor, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email / Gmail (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. axmed@gmail.com"
                  value={newDonor.email}
                  onChange={e => setNewDonor({ ...newDonor, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Blood Type & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nooca Dhiigga (Blood Type)</label>
                  <select
                    value={newDonor.bloodType}
                    onChange={e => setNewDonor({ ...newDonor, bloodType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Xaaladda (Availability)</label>
                  <select
                    value={newDonor.availability}
                    onChange={e => setNewDonor({ ...newDonor, availability: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Available">🟢 Available (Diyaar)</option>
                    <option value="Not Available">🔴 Away (Maqan)</option>
                  </select>
                </div>
              </div>

              {/* Region & District */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gobolka (Region)</label>
                  <select
                    value={newDonor.region}
                    onChange={e => setNewDonor({ ...newDonor, region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {['Banaadir', 'Hiran', 'Bari', 'Nugaal', 'Mudug', 'Lower Shabelle', 'Waqooyi Galbeed', 'Hirshabelle', 'Jubaland', 'Puntland', 'Somaliland', 'South West'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degmada (District)</label>
                  <input
                    type="text"
                    placeholder="e.g. Hodan, Waberi, Shibis"
                    value={newDonor.district}
                    onChange={e => setNewDonor({ ...newDonor, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDonorOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  disabled={submittingDonor}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{submittingDonor ? 'Waa la keydinayaa...' : 'Keydi Donor-ka'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900">Edit User Account</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName || ''}
                  onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone || ''}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Password</label>
                <input
                  type="text"
                  value={editForm.password || ''}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-medium"
                  placeholder="Enter new password or leave unchanged"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Role</label>
                <select
                  value={editForm.role || 'donor'}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                >
                  <option value="donor">Donor (Blood Donor)</option>
                  <option value="receiver">Receiver (Needs Blood)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Delete User Account?</h3>
            <p className="text-xs text-slate-500 mb-5">
              Are you sure you want to delete <strong className="text-slate-800">{deletingUser.fullName}</strong>? This will permanently remove their records.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingUser(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (onDeleteUser) await onDeleteUser(deletingUser.id);
                  setDeletingUser(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
