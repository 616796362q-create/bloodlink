import React from 'react';
import { X } from 'lucide-react';

export default function DonorProfileModal({ donor, onClose, onRequestBlood }) {
  if (!donor) return null;

  const isAvailable = donor.availability === 'Available';
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
    <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-4 border-slate-100 shadow-md bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center">
            {avatarSrc ? (
              <img 
                src={avatarSrc} 
                alt={donor.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xl font-black">{initials}</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-navy-900">{donor.fullName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">📍 {donor.region} — {donor.district}</p>
          
          <div className="my-4 inline-block bg-rose-600 text-white font-black text-base px-4 py-1.5 rounded-xl shadow-sm">
            <span>{donor.bloodType}</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs text-left mb-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Availability:</span>
              <span className={`font-bold px-2 py-0.5 rounded-md ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {isAvailable ? '🟢 Available' : '🔴 Away'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Donation History:</span>
              <span className="font-bold text-slate-900">{donor.donationsCount || 0} Donations</span>
            </div>
            {isAvailable && donor.phone && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono text-emerald-600 font-bold">💬 {donor.phone}</span>
              </div>
            )}
          </div>

          {isAvailable ? (
            <button 
              onClick={() => {
                onClose();
                onRequestBlood(donor);
              }} 
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
            >
              Request Blood
            </button>
          ) : (
            <button 
              onClick={onClose} 
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
