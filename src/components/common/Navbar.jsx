import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  Package, 
  LayoutDashboard,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout, isFarmer, isConsumer } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Platform Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                Krishi<span className="text-brand-600">Setu</span>
              </span>
              <p className="text-[11px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">Direct Farm Link</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {isFarmer ? (
              <>
                <Link
                  to="/farmer/dashboard"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/farmer/dashboard') 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/farmer/add-product"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/farmer/add-product') 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Crop
                </Link>
                <Link
                  to="/farmer/my-products"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/farmer/my-products') 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  My Listings
                </Link>
                <Link
                  to="/farmer/predictions"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/farmer/predictions') 
                      ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Forecast
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/') 
                      ? 'bg-brand-50 text-brand-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Marketplace
                </Link>
              </>
            )}
          </nav>

          {/* User Controls & Cart */}
          <div className="hidden md:flex items-center gap-3">
            {isConsumer && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-600 transition-all bg-white shadow-sm"
                title="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">{user.name}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded capitalize">
                      {isFarmer && <ShieldCheck className="w-3 h-3 text-brand-600" />}
                      {user.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-600/25 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {isConsumer && (
              <Link
                to="/cart"
                className="relative p-2 text-slate-700 hover:text-brand-600"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <span className="text-xs text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded-full capitalize">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          {isFarmer ? (
            <>
              <Link
                to="/farmer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
              >
                <LayoutDashboard className="w-5 h-5 text-brand-600" />
                Farmer Dashboard
              </Link>
              <Link
                to="/farmer/add-product"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
              >
                <PlusCircle className="w-5 h-5 text-brand-600" />
                Add New Crop
              </Link>
              <Link
                to="/farmer/my-products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
              >
                <Package className="w-5 h-5 text-brand-600" />
                My Crop Listings
              </Link>
              <Link
                to="/farmer/predictions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-800 bg-emerald-50 font-bold"
              >
                <Sparkles className="w-5 h-5 text-emerald-600" />
                AI Crop Forecaster
              </Link>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
            >
              <Sprout className="w-5 h-5 text-brand-600" />
              Marketplace
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-700 font-medium"
              >
                <UserIcon className="w-5 h-5 text-brand-600" />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-600 text-white font-bold shadow-md shadow-brand-600/20"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
