import React from 'react';
import { Droplet, ShieldCheck, HeartHandshake, Users, MapPin, Activity, Heart } from 'lucide-react';

export default function Hero({ onFindBlood, onBecomeDonor, donorsCount = 0, livesSaved = 0 }) {
  return (
    <section className="hero-gradient py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full border border-rose-200/60 text-xs font-bold shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 pulse-emerald"></span>
              <span>Community Voluntary Blood Donation</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-navy-900 tracking-tight leading-[1.1]">
              Find Blood. <br /><span className="text-rose-600">Save Lives.</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Connect with blood donors or help someone by donating blood. Simple, transparent and community-driven with Madahiye.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button onClick={onFindBlood} className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-600/30 transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer">
                <Droplet className="w-5 h-5 fill-current" />
                <span>Find Blood</span>
              </button>
              <button onClick={onBecomeDonor} className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-navy-900 font-extrabold text-base rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer">
                <HeartHandshake className="w-5 h-5 text-rose-600" />
                <span>Become a Donor</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="block text-2xl font-black text-navy-900">{donorsCount}</span>
                <span className="text-xs text-slate-500 font-medium">Voluntary Donors</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-rose-600">{livesSaved}</span>
                <span className="text-xs text-slate-500 font-medium">Lives Saved</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-600">24/7</span>
                <span className="text-xs text-slate-500 font-medium">Emergency Access</span>
              </div>
            </div>
          </div>

          {/* Right Card Graphic: Official Madahiye Platform Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl glow-card">
              
              {/* Official Madahiye Logo Box */}
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-md border border-slate-100 p-3">
                <img src="/logo.png" alt="Madahiye Platform" className="w-full h-full object-contain" />
              </div>

              <h3 className="text-xl font-extrabold text-center text-slate-900 mb-1">Madahiye Platform</h3>
              <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">
                Isku xiraha dhiig bixiyeyaasha mutadawiciinta ah iyo dadka dhiigga u baahan ee dalka oo dhan.
              </p>
              
              {/* Platform Highlights List */}
              <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified Donors
                  </span>
                  <span className="font-bold text-slate-900">Active Members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    Coverage
                  </span>
                  <span className="font-bold text-slate-900">All Somali Regions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    Blood Groups
                  </span>
                  <span className="font-bold text-slate-900">All 8 Blood Types</span>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
                  <span className="text-slate-700 font-bold flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                    Community Goal
                  </span>
                  <span className="font-extrabold text-rose-600">Saving Lives Together</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
