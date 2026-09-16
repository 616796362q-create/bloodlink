import React from 'react';
import { MapPin, CheckCircle, Droplet } from 'lucide-react';

export default function DonorCard({ donor, onViewProfile, onRequestBlood }) {
  const isAvailable = donor.availability === 'Available';

  // Load profile pic uploaded by this donor from localStorage
  const savedPic = localStorage.getItem(`profile_pic_${donor.userId || donor.id}`);
  const avatarSrc = savedPic || donor.avatar || null;

  const initials = (donor.fullName || 'D')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm glow-card flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-rose-500/5 rounded-full pointer-events-none"></div>
      
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Avatar: uploaded photo or initials fallback */}
            <div className="w-12 h-12 rounded-full border-2 border-slate-100 shadow-sm overflow-hidden flex-shrink-0 bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={donor.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-black">{initials}</span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight flex items-center">
                {donor.fullName}
                {donor.verified && (
                  <span className="ml-1.5 inline-flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                    ✓ Verified
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 flex items-center mt-0.5">
                📍 {donor.region} — {donor.district}
              </p>
            </div>
          </div>
          
          <span className="blood-badge text-white font-extrabold text-sm px-3 py-1 rounded-xl shadow-sm tracking-wide">
            {donor.bloodType}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100 mb-5">
          <span className="flex items-center font-medium">
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${isAvailable ? 'bg-emerald-500 pulse-emerald' : 'bg-slate-400'}`}></span>
            {isAvailable ? '🟢 Available' : '🔴 Away'}
          </span>
          <span className="text-slate-500 font-medium">{donor.donationsCount || 0} Donations</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
        <button 
          onClick={() => onViewProfile(donor)} 
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors text-center cursor-pointer"
        >
          View Profile
        </button>
        {isAvailable && (
          <button 
            onClick={() => onRequestBlood(donor)} 
            className="flex-1 font-extrabold text-xs py-2.5 px-3 rounded-xl transition-all text-center bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 cursor-pointer"
          >
            Request Blood
          </button>
        )}
      </div>
    </div>
  );
}
