import React from 'react';
import { UserPlus, Search, PhoneCall, ShieldCheck } from 'lucide-react';

export default function HowItWorks({ onSearchClick }) {
  return (
    <section className="bg-white py-20 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-navy-900 tracking-tight">How It Works</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Simple 3-step community process to request or donate blood.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 text-center relative">
            <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-rose-600/20 font-black text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Search Donors (FREE)</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Find nearby voluntary donors by Blood Type (O+, A+, B+, etc.) and Region directly without needing to login first.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 text-center relative">
            <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-rose-600/20 font-black text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Select Donor</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Check availability, location, and donation history of verified voluntary community donors.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 text-center relative">
            <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-rose-600/20 font-black text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant WhatsApp Connect</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Click 'Request Blood' to connect directly on WhatsApp with Madahiye (+252 61 679 6362) 100% FREE.</p>
          </div>

        </div>

        {/* Ethical Pledge */}
        <div className="mt-16 bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-md">
              🛡️
            </div>
            <div>
              <h4 className="text-base font-bold text-rose-950">100% Voluntary & Free Platform</h4>
              <p className="text-xs text-rose-800 mt-1 max-w-2xl">Madahiye connects blood donors and patients directly. No fees, no payments, and no mandatory login required to request blood.</p>
            </div>
          </div>
          <button onClick={onSearchClick} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all flex-shrink-0">
            Find Blood Donors
          </button>
        </div>

      </div>
    </section>
  );
}
