import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Calendar, 
  ShoppingBag, 
  LayoutDashboard, 
  Sprout 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout, isFarmer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-8">
        
        {/* Header Avatar & Name */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-brand-600/30">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900">{user?.name || 'User Name'}</h1>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 rounded-full capitalize">
                {isFarmer && <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />}
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Credentials</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-slate-500 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Full Name</span>
                <span className="text-sm font-bold text-slate-800">{user?.name}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-slate-500 flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Email Address</span>
                <span className="text-sm font-bold text-slate-800 truncate block max-w-[200px]">{user?.email}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-slate-500 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Aadhaar Status</span>
                <span className="text-sm font-bold text-emerald-700">
                  {user?.aadhaarVerified || isFarmer ? 'Verified & Linked' : 'Standard Consumer'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-slate-500 flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Account Type</span>
                <span className="text-sm font-bold text-slate-800 capitalize">
                  {user?.role} Tier
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {isFarmer ? (
            <Link
              to="/farmer/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              <LayoutDashboard className="w-4 h-4" /> Open Farmer Dashboard
            </Link>
          ) : (
            <Link
              to="/cart"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> View My Basket
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
