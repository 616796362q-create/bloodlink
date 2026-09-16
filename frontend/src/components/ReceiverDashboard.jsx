import React, { useState, useRef } from 'react';
import { 
  Phone, CheckCircle, XCircle, Clock, Droplet, Heart, 
  MapPin, Search, Plus, User, Camera, Copy, Check, 
  MessageCircle, ShieldCheck, Sparkles, Filter, AlertCircle 
} from 'lucide-react';

export default function ReceiverDashboard({ user = {}, requests = [], onFindBloodClick }) {
  const [activeTab, setActiveTab] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem(`profile_pic_${user?.id || 'guest'}`) || null;
  });
  const fileInputRef = useRef(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setProfilePic(dataUrl);
      localStorage.setItem(`profile_pic_${user?.id || 'guest'}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyPhone = (phone, reqId) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(reqId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fullName   = user?.fullName || 'Receiver Member';
  const bloodType  = user?.bloodType || user?.bloodTypeNeeded || 'Any';
  const region     = user?.region || 'Banaadir';
  const district   = user?.district || 'Hodan';
  const phone      = user?.phone || '';
  const initials   = fullName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const totalReqs  = requests.length;
  const accepted   = requests.filter(r => r.status === 'Accepted').length;
  const pending    = requests.filter(r => r.status === 'Pending').length;
  const rejected   = requests.filter(r => r.status === 'Rejected').length;

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'accepted') return r.status === 'Accepted';
    if (activeTab === 'pending') return r.status === 'Pending';
    if (activeTab === 'rejected') return r.status === 'Rejected';
    return true;
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#060a17] via-[#0c1322] to-[#060a17] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ─── Hero Profile Header ─── */}
        <div className="relative rounded-[2rem] overflow-hidden mb-8 shadow-2xl border border-white/10">
          {/* Vibrant Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8] via-[#1e3a8a] to-[#0f172a] opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          {/* Ambient decorative blobs */}
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-10 flex flex-wrap items-center justify-between gap-6">
            
            <div className="flex items-center gap-6">
              {/* Avatar Circle with Upload */}
              <div 
                className="relative flex-shrink-0 cursor-pointer group" 
                onClick={() => fileInputRef.current?.click()}
                title="Guji si aad sawir u geliso"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl overflow-hidden transition-transform group-hover:scale-105">
                  {profilePic ? (
                    <img src={profilePic} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{initials}</span>
                  )}
                </div>
                {/* Camera icon hover overlay */}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                {/* Blood droplet badge */}
                <div className="absolute -bottom-1 -right-1 bg-rose-600 rounded-full p-1.5 shadow-lg border-2 border-white/30 flex items-center justify-center">
                  <Droplet className="w-3.5 h-3.5 text-white fill-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>

              {/* Name & Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-white/20 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/20">
                    Requester Portal
                  </span>
                  <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Member
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight truncate">
                  {fullName}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-white/75 text-xs font-medium">
                  {(district || region) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-300" />
                      {district ? `${district}, ` : ''}{region}
                    </span>
                  )}
                  {phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-300" />
                      {phone}
                    </span>
                  )}
                  {bloodType && (
                    <span className="flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                      Blood Needed: <strong className="text-white ml-0.5 bg-rose-500/30 px-2 py-0.5 rounded-md border border-rose-400/40">{bloodType}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action button: Find Blood */}
            <button
              onClick={onFindBloodClick}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-2xl shadow-xl shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-rose-400/30 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>+ Find Blood Donors</span>
            </button>

          </div>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requests',   value: totalReqs, icon: Droplet,      color: 'from-blue-600 to-indigo-700',   bg: 'bg-blue-500/10 text-blue-400',   border: 'border-blue-500/20' },
            { label: 'Accepted & Ready', value: accepted,  icon: CheckCircle,  color: 'from-emerald-600 to-green-700', bg: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'Pending Approval', value: pending,   icon: Clock,        color: 'from-amber-500 to-orange-600',  bg: 'bg-amber-500/10 text-amber-400',   border: 'border-amber-500/20' },
            { label: 'Declined / Closed',value: rejected,  icon: XCircle,      color: 'from-rose-600 to-red-700',      bg: 'bg-rose-500/10 text-rose-400',     border: 'border-rose-500/20' },
          ].map(({ label, value, icon: Icon, bg, border }) => (
            <div key={label} className={`bg-[#11192e]/80 backdrop-blur-md border ${border} rounded-2xl p-5 flex flex-col gap-3 shadow-lg hover:bg-[#15203a] transition-all`}>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shadow-inner`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-[11px] text-white/50 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Filter Tabs & Section Header ─── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Your Blood Requests
            </h2>
            <p className="text-xs text-white/50 mt-0.5">Track your requests and directly connect with donors once accepted.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#11192e] p-1.5 rounded-2xl border border-white/10">
            {[
              { id: 'all',      label: 'All',      count: totalReqs },
              { id: 'accepted', label: 'Accepted', count: accepted },
              { id: 'pending',  label: 'Pending',  count: pending },
              { id: 'rejected', label: 'Declined', count: rejected },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/10 text-white/50'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Requests List ─── */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 bg-[#11192e]/60 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl border border-blue-500/20 shadow-inner">
                🩸
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {requests.length === 0 ? 'No Blood Requests Yet' : 'No requests in this category'}
              </h3>
              <p className="text-white/50 max-w-sm mx-auto text-xs mb-6">
                {requests.length === 0 
                  ? 'You haven\'t created any blood requests yet. Find a voluntary donor in your area now.'
                  : 'There are no blood requests matching the selected filter.'}
              </p>
              <button
                onClick={onFindBloodClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <Search className="w-4 h-4" />
                <span>Find Voluntary Blood Donors</span>
              </button>
            </div>
          ) : (
            filteredRequests.map(req => {
              const isAccepted = req.status === 'Accepted';
              const isRejected = req.status === 'Rejected';
              const isPending  = req.status === 'Pending';

              // Build direct WhatsApp link to donor if accepted
              const donorCleanPhone = (req.donorPhone || '').replace(/\D/g, '');
              const waText = `Asc ${req.donorName}, waxaan kugu soo xiriiray codsigii dhiig bixinta Madahiye (${req.bloodType}). Aad baad ugu mahadsantahay inaad aqbashay! 🙏`;
              const waUrl = `https://wa.me/${donorCleanPhone}?text=${encodeURIComponent(waText)}`;

              return (
                <div 
                  key={req.id} 
                  className={`relative rounded-3xl p-6 transition-all border shadow-xl ${
                    isAccepted 
                      ? 'bg-[#112328]/80 border-emerald-500/30' 
                      : isRejected
                        ? 'bg-[#24131a]/80 border-rose-500/20'
                        : 'bg-[#11192e]/80 border-white/10'
                  }`}
                >
                  {/* Top Row: Donor info & Status badge */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      {/* Blood Type Avatar badge */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-600/30 border border-rose-400/30 flex-shrink-0">
                        {req.bloodType}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-xs font-semibold">Donor:</span>
                          <h4 className="font-extrabold text-white text-base leading-tight">{req.donorName}</h4>
                        </div>
                        <p className="text-xs text-white/50 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white/40" />
                          {req.region} — {req.district} • <span className="text-white/30">{req.createdAt}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-emerald" />
                          Accepted by Donor
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          Pending Donor Approval
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          <XCircle className="w-3.5 h-3.5" />
                          Declined
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary Strip (Fee paid, units, payment method) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-white/5 rounded-2xl p-3.5 border border-white/5 mb-4 text-white/80">
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">Service Fee:</span>
                      <span className="font-bold text-white">$3.00 USD <span className="text-white/40 font-normal">({req.paymentMethod || 'EVC Plus'})</span></span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">Units Requested:</span>
                      <span className="font-bold text-white">{req.units || 1} Unit(s)</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">Receipt Reference:</span>
                      <span className="font-mono text-blue-300 text-[11px] font-bold">{req.transactionRef || req.id}</span>
                    </div>
                  </div>

                  {/* Dynamic Action / Contact Panel */}
                  {isAccepted ? (
                    <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 rounded-2xl p-4 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                            <span>Donor Contact Number:</span>
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-base font-black text-white tracking-wide bg-black/40 px-2.5 py-0.5 rounded-lg border border-emerald-400/30">
                              {req.donorPhone}
                            </span>
                            <button 
                              onClick={() => handleCopyPhone(req.donorPhone, req.id)}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                              title="Copy Phone Number"
                            >
                              {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {donorCleanPhone && (
                          <a 
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        <a 
                          href={`tel:${req.donorPhone}`}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Donor</span>
                        </a>
                      </div>
                    </div>
                  ) : isPending ? (
                    <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 flex items-center gap-3 text-xs text-white/60">
                      <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
                      <span>Codsigaaga waxaa loo diray donor-ka. Taleefanka donor-ka wuxuu toos u soo baxayaa isla marka uu aqbalo.</span>
                    </div>
                  ) : (
                    <div className="bg-rose-500/10 rounded-2xl p-3.5 border border-rose-500/20 flex items-center gap-3 text-xs text-rose-300/80">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>Donor-kani ma heli karin dhiig xilligan. Fadlan raadi donor kale oo diyaar ah.</span>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
