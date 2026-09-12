import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Info 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [role, setRole] = useState('consumer'); // 'consumer' | 'farmer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Farmer Aadhaar verification state
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarMessage, setAadhaarMessage] = useState(null);

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { signup, verifyAadhaar } = useAuth();
  const navigate = useNavigate();

  const handleVerifyAadhaar = async () => {
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      setAadhaarMessage({ type: 'error', text: 'Please enter a valid 12-digit Aadhaar number.' });
      return;
    }

    setVerifyingAadhaar(true);
    setAadhaarMessage(null);

    try {
      const res = await verifyAadhaar(aadhaarNumber);
      if (res.verified) {
        setAadhaarVerified(true);
        setAadhaarMessage({ type: 'success', text: 'Aadhaar verified successfully! You are certified to list farm produce.' });
      } else {
        setAadhaarVerified(false);
        setAadhaarMessage({ type: 'error', text: res.message || 'Verification failed.' });
      }
    } catch (err) {
      setAadhaarVerified(false);
      setAadhaarMessage({
        type: 'error',
        text: err.response?.data?.message || 'Aadhaar verification failed. Try using demo ID: 123456789012',
      });
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (role === 'farmer' && !aadhaarVerified) {
      setError('Farmer accounts require Aadhaar verification prior to registration.');
      return;
    }

    setSubmitting(true);

    try {
      const newUser = await signup({
        name,
        email,
        password,
        role,
        aadhaarVerified: role === 'farmer' ? aadhaarVerified : false,
      });

      if (newUser.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Failed to create account. Please check your information.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md shadow-brand-600/30">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-sm text-slate-500 font-medium">
            Join Krishi Setu to connect directly with cultivators
          </p>
        </div>

        {/* Role Switcher */}
        <div className="p-1 bg-slate-100 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setRole('consumer')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              role === 'consumer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🛒 Consumer (Buyer)
          </button>
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              role === 'farmer'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🌾 Farmer (Cultivator)
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'farmer' ? "Ramesh Kumar" : "Anita Sharma"}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Farmer-Specific Aadhaar Verification Box */}
          {role === 'farmer' && (
            <div className="p-4 bg-brand-50/70 border border-brand-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  Govt. Aadhaar Verification
                </div>
                {aadhaarVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600">
                Farmers must verify their 12-digit Aadhaar to list crops and receive direct payouts.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={12}
                  value={aadhaarNumber}
                  disabled={aadhaarVerified}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 12-digit Aadhaar"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyAadhaar}
                  disabled={verifyingAadhaar || aadhaarVerified}
                  className="px-4 py-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  {verifyingAadhaar ? 'Checking...' : aadhaarVerified ? 'Verified' : 'Verify'}
                </button>
              </div>

              {/* Demo Hint */}
              {!aadhaarVerified && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Demo test Aadhaar: <code className="font-bold text-brand-800">123456789012</code></span>
                  <button
                    type="button"
                    onClick={() => setAadhaarNumber('123456789012')}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    Fill Demo
                  </button>
                </div>
              )}

              {/* Status Message */}
              {aadhaarMessage && (
                <div className={`p-2 rounded-lg text-xs font-medium flex items-start gap-1.5 ${
                  aadhaarMessage.type === 'success' ? 'bg-emerald-100/70 text-emerald-800' : 'bg-red-100/70 text-red-800'
                }`}>
                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{aadhaarMessage.text}</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              `Register as ${role === 'farmer' ? 'Verified Farmer' : 'Consumer'}`
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-bold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
