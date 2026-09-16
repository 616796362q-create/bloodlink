import React, { useState } from 'react';
import DonorCard from './DonorCard';

export default function FindBlood({ donors = [], onSelectDonorProfile, onRequestBlood }) {
  const [bloodType, setBloodType] = useState('All');
  const [region, setRegion] = useState('All');
  const [district, setDistrict] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  const filteredDonors = (donors || []).filter(donor => {
    if (availabilityFilter !== 'All' && donor.availability !== availabilityFilter) return false;
    if (bloodType !== 'All' && donor.bloodType !== bloodType) return false;
    if (region !== 'All' && donor.region && donor.region.toLowerCase() !== region.toLowerCase()) return false;
    if (district.trim() !== '' && donor.district && !donor.district.toLowerCase().includes(district.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-navy-900 tracking-tight">Find a Voluntary Blood Donor</h1>
          <p className="text-slate-500 text-sm mt-1">Search community blood donors near your region and district.</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-2xl text-xs font-bold text-rose-700 flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 pulse-emerald"></span>
          <span>{filteredDonors.length} Registered Donors Listed</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* Blood Type Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Blood Type</label>
          <select 
            value={bloodType} 
            onChange={e => setBloodType(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <option value="All">All Blood Types</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Region</label>
          <select 
            value={region} 
            onChange={e => setRegion(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <option value="All">All Regions</option>
            {['Banaadir', 'Hiran', 'Bari', 'Nugaal', 'Mudug', 'Lower Shabelle', 'Waqooyi Galbeed', 'Hirshabelle', 'Jubaland', 'Puntland', 'Somaliland', 'South West'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">District Search</label>
          <input 
            type="text" 
            placeholder="Search district..." 
            value={district} 
            onChange={e => setDistrict(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Status</label>
          <select 
            value={availabilityFilter} 
            onChange={e => setAvailabilityFilter(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          >
            <option value="All">All Donors</option>
            <option value="Available">🟢 Available Only</option>
            <option value="Not Available">🔴 Away Only</option>
          </select>
        </div>

      </div>

      {/* Donors Cards Grid */}
      {filteredDonors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">🩸</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Blood Donors Found</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm">We couldn't find any donors matching your selected filters. Try resetting the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map(donor => (
            <DonorCard 
              key={donor.id} 
              donor={donor} 
              onViewProfile={onSelectDonorProfile} 
              onRequestBlood={onRequestBlood} 
            />
          ))}
        </div>
      )}
    </section>
  );
}
