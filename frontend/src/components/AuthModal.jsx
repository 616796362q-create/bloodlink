import React, { useState } from 'react';
import { X, Droplet, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';

export default function AuthModal({ onClose, onRegisterSuccess, onLogin, initialView = 'login', initialRole = 'donor' }) {
  const [isRegisterMode, setIsRegisterMode] = useState(initialView.includes('register'));
  const [selectedRole, setSelectedRole] = useState(initialRole === 'receiver' ? 'requester' : 'donor'); // 'donor' | 'requester'
  
  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Extra registration fields (if in register mode)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [region, setRegion] = useState('Banaadir');
  const [district, setDistrict] = useState('');

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userEmail = email.trim();
    if (!userEmail) {
      setError('Fadlan geli email-kaaga ama Gmail.');
      return;
    }
    if (!password) {
      setError('Fadlan geli password-kaaga.');
      return;
    }

    setSaving(true);
    const backendRole = selectedRole === 'requester' ? 'receiver' : 'donor';

    try {
      if (!isRegisterMode) {
        // Sign In
        await onLogin({ email: userEmail, password });
      } else {
        // Register
        if (!fullName.trim()) {
          throw new Error('Fadlan qor magacaaga oo buuxa.');
        }
        if (!phone.trim()) {
          throw new Error('Fadlan geli lambarka telefoonkaaga.');
        }
        await onRegisterSuccess({
          fullName: fullName.trim(),
          email: userEmail,
          phone: phone.trim(),
          password,
          role: backendRole,
          bloodType,
          region,
          district: district.trim()
        });
      }
    } catch (err) {
      setError(err.message || 'Galitaanku ma guuleysan. Fadlan mar kale isku day.');
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-[#0c1427]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#f8fafc] rounded-[36px] max-w-[420px] w-full p-7 sm:p-9 shadow-2xl relative border border-slate-100 max-h-[95vh] overflow-y-auto font-sans">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Floating Badge with Official Madahiye Logo */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white shadow-xl shadow-slate-200/70 border-4 border-white flex items-center justify-center p-2 overflow-hidden">
              <img src="/logo.png" alt="Madahiye" className="w-full h-full object-contain" />
            </div>
            {/* Red Heart Mini Badge */}
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#a30b2c] border-2 border-white flex items-center justify-center shadow-md">
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Title Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </h2>
        </div>

        {/* Segmented Pill Selector: Only show when registering */}
        {isRegisterMode && (
          <div className="bg-[#e2e8f0]/60 p-1.5 rounded-2xl flex items-center mb-5">
            <button
              type="button"
              onClick={() => setSelectedRole('donor')}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                selectedRole === 'donor'
                  ? 'bg-white text-[#a30b2c] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donor
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('requester')}
              className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                selectedRole === 'requester'
                  ? 'bg-white text-[#a30b2c] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Requester
            </button>
          </div>
        )}



        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 flex items-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 flex-shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Main Form */}
        {/* Hidden honeypot inputs to trick browser password manager */}
        <input type="text" style={{display:'none'}} aria-hidden="true" />
        <input type="password" style={{display:'none'}} aria-hidden="true" />

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          
          {/* Register Mode Extra: Full Name */}
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-4" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  name="fullname-x"
                  className="w-full bg-white border border-slate-200/90 rounded-full pl-11 pr-4 py-3.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#a30b2c]/20 focus:border-[#a30b2c] shadow-sm transition-all"
                />
              </div>
            </div>
          )}

          {/* Register Mode Extra: Phone Number */}
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-4" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  name="phone-x"
                  placeholder="+252 61 000 0000"
                  className="w-full bg-white border border-slate-200/90 rounded-full pl-11 pr-4 py-3.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#a30b2c]/20 focus:border-[#a30b2c] shadow-sm transition-all"
                />
              </div>
            </div>
          )}


          {/* Email Address Field */}
          <div>
            <label className="block text-xs font-bold text-[#0f172a] mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4" />
              <input
                type="text"
                inputMode="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                name="email-x"
                className="w-full bg-white border border-slate-200/90 rounded-full pl-11 pr-4 py-3.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#a30b2c]/20 focus:border-[#a30b2c] shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#0f172a]">
                Password
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => setError('Fadlan la xariir Madahiye WhatsApp si dib looguugu dejiyo password-ka.')}
                  className="text-xs font-bold text-[#a30b2c] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                data-lpignore="true"
                data-form-type="other"
                name="pass-x"
                className="w-full bg-white border border-slate-200/90 rounded-full pl-11 pr-11 py-3.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#a30b2c]/20 focus:border-[#a30b2c] shadow-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Register Mode Extra: Blood Type, Region, District */}
          {isRegisterMode && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Blood</label>
                <select
                  value={bloodType}
                  onChange={e => setBloodType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-2 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#a30b2c]/20 shadow-sm"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Region</label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-1.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#a30b2c]/20 shadow-sm"
                >
                  {['Banaadir', 'Hiran', 'Bari', 'Nugaal', 'Mudug', 'Lower Shabelle', 'Waqooyi Galbeed'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-2.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#a30b2c]/20 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Remember this device checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={e => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded text-[#a30b2c] focus:ring-[#a30b2c] accent-[#a30b2c] cursor-pointer"
              />
              <span className="text-xs font-semibold text-[#0f172a]">
                Remember this device
              </span>
            </label>
          </div>

          {/* Large Crimson Action Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-[#a30b2c] hover:bg-[#8b0925] active:scale-[0.99] disabled:bg-rose-300 text-white font-extrabold text-sm rounded-full shadow-lg shadow-[#a30b2c]/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {saving
                ? 'Please wait...'
                : isRegisterMode
                  ? `Register as ${selectedRole === 'donor' ? 'Donor' : 'Requester'}`
                  : 'Sign In'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Bottom Footer Switch */}
          <div className="pt-2 text-center text-xs text-slate-600">
            {!isRegisterMode ? (
              <span>
                New to Madahiye?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(true); setError(''); }}
                  className="text-[#a30b2c] font-bold hover:underline"
                >
                  Register as Lifesaver
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(false); setError(''); }}
                  className="text-[#a30b2c] font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
