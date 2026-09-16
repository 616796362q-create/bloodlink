import React, { useState, useEffect, useRef } from 'react';
import { Droplet, Heart, MapPin, Phone, CheckCircle, XCircle, Clock, Activity, Star, Shield, Bell, TrendingUp, User, Camera } from 'lucide-react';

export default function DonorDashboard({ user, donor, requests, onStatusChange, onToggleAvailability }) {
  const [availability, setAvailability] = useState(donor?.availability || 'Available');
  const [profilePic, setProfilePic] = useState(() => {
    // Load saved profile pic from localStorage
    const saved = localStorage.getItem(`profile_pic_${user?.id || 'guest'}`);
    return saved || null;
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (donor?.availability) setAvailability(donor.availability);
  }, [donor?.availability]);

  const handleAvail = (newStatus) => {
    setAvailability(newStatus);
    onToggleAvailability(newStatus);
  };

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

  const bloodType     = donor?.bloodType || user?.bloodType || 'O+';
  const district      = donor?.district  || user?.district  || '';
  const region        = donor?.region    || user?.region    || 'Banaadir';
  const phone         = user?.phone      || donor?.phone    || '';
  const fullName      = user?.fullName   || 'Donor';
  const initials      = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const totalReqs     = (requests || []).length;
  const accepted      = (requests || []).filter(r => r.status === 'Accepted').length;
  const pending       = (requests || []).filter(r => r.status === 'Pending').length;
  const isAvailable   = availability === 'Available';

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#12192d] to-[#0a0f1e] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ─── Hero Profile Card ─── */}
        <div className="relative rounded-[2rem] overflow-hidden mb-8 shadow-2xl">
          {/* Gradient BG */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#a30b2c] via-[#7d0921] to-[#4a0415] opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

          <div className="relative z-10 p-8 sm:p-10 flex flex-wrap items-center gap-6">
            {/* Avatar Circle — click to upload photo */}
            <div className="relative flex-shrink-0 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur border-4 border-white/30 flex items-center justify-center shadow-xl overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{initials}</span>
                )}
              </div>
              {/* Camera overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              {/* Blood Type Badge */}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2.5 py-0.5 shadow-lg border border-rose-100">
                <span className="text-[#a30b2c] text-xs font-black">{bloodType}</span>
              </div>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </div>

            {/* Name & Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                  Donor Portal
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isAvailable ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'bg-slate-400/20 text-slate-300 border border-slate-400/30'}`}>
                  ● {availability}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight truncate">
                {fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-white/70 text-xs font-medium">
                {(district || region) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {district ? `${district}, ` : ''}{region}
                  </span>
                )}
                {phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Droplet className="w-3 h-3 fill-white/70" />
                  Blood: <strong className="text-white ml-0.5">{bloodType}</strong>
                </span>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Donation Status</span>
              <div className="flex rounded-2xl overflow-hidden border border-white/20 shadow-lg">
                <button
                  onClick={() => handleAvail('Available')}
                  className={`px-4 py-2 text-xs font-bold transition-all ${isAvailable ? 'bg-emerald-500 text-white shadow-inner' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                >
                  ✓ Available
                </button>
                <button
                  onClick={() => handleAvail('Not Available')}
                  className={`px-4 py-2 text-xs font-bold transition-all ${!isAvailable ? 'bg-slate-600 text-white shadow-inner' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                >
                  Away
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Away Status Notice Banner */}
        {!isAvailable && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs font-semibold backdrop-blur-sm animate-in fade-in">
            <span className="text-xl flex-shrink-0">🔒</span>
            <div>
              <p className="font-bold text-amber-200">Xaaladdaada waa: Away (Maqan)</p>
              <p className="text-amber-300/80 text-[11px] mt-0.5">Taleefankaaga iyo wicitaankaaga tooska ah waa la qariyay si aan laguu dhibin inta aadan diyaar ahayn.</p>
            </div>
          </div>
        )}

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: totalReqs, icon: Bell, color: 'from-violet-600 to-purple-700', light: 'bg-violet-500/10 text-violet-300' },
            { label: 'Accepted',       value: accepted,  icon: CheckCircle, color: 'from-emerald-600 to-green-700', light: 'bg-emerald-500/10 text-emerald-300' },
            { label: 'Pending',        value: pending,   icon: Clock, color: 'from-amber-500 to-orange-600', light: 'bg-amber-500/10 text-amber-300' },
          ].map(({ label, value, icon: Icon, color, light }) => (
            <div key={label} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/8 transition-colors">
              <div className={`w-9 h-9 rounded-xl ${light} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-[11px] text-white/50 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Requests Section ─── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-400" />
              Requests Received
            </h2>
            {totalReqs > 0 && (
              <span className="text-xs font-bold text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {totalReqs} total
              </span>
            )}
          </div>

          {(requests || []).length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center backdrop-blur">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white/40 text-sm font-semibold">No blood requests yet</p>
              <p className="text-white/25 text-xs mt-1">Requests will appear here when someone needs your blood type</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(requests || []).map(req => {
                const isPending  = req.status === 'Pending';
                const isAccepted = req.status === 'Accepted';
                const isRejected = req.status === 'Rejected';

                return (
                  <div key={req.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur hover:bg-white/8 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {/* Requester Avatar */}
                        <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-rose-300" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{req.receiverName || 'Anonymous'}</h4>
                          <p className="text-[11px] text-white/40 mt-0.5">
                            📍 {req.region || ''}{req.district ? ` — ${req.district}` : ''} • {req.createdAt || 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-black px-2.5 py-1 rounded-xl">
                          {req.bloodType} · {req.units || 1} unit{req.units > 1 ? 's' : ''}
                        </span>
                        <span className={`text-[11px] px-2.5 py-1 rounded-xl font-bold border ${
                          isAccepted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          isRejected ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' :
                                       'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {isAccepted ? '✓ Accepted' : isRejected ? '✗ Declined' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>

                    {req.message && (
                      <div className="bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-xs text-white/50 mb-4 italic">
                        "{req.message}"
                      </div>
                    )}

                    {isAccepted && req.receiverPhone && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-xs text-emerald-300 mb-4 flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> Receiver Phone:
                          <span className="font-mono ml-1 text-emerald-200">{req.receiverPhone}</span>
                        </span>
                        <span className="text-emerald-400 font-bold">Contact Shared ✓</span>
                      </div>
                    )}

                    {isPending && (
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/8">
                        <button
                          onClick={() => onStatusChange(req.id, 'Rejected')}
                          className="px-5 py-2 bg-white/8 hover:bg-white/15 text-white/70 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onStatusChange(req.id, 'Accepted')}
                          className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-emerald-900/40"
                        >
                          ✓ Accept & Share Phone
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
