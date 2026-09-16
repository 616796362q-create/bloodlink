import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessModal({ onClose, onViewReceiverDashboard }) {
  return (
    <div className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center relative border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-navy-900 mb-2">Request Sent via WhatsApp!</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Waa la diray request-gaaga dhiigga! Xogta waxaa toos loogu reebay WhatsApp-ka iyo Receiver Dashboard-kaaga.
        </p>
        <button 
          onClick={() => {
            onClose();
            onViewReceiverDashboard();
          }} 
          className="w-full py-3.5 bg-navy-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
        >
          Go to Receiver Dashboard
        </button>
      </div>
    </div>
  );
}
