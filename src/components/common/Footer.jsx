import React from 'react';
import { Sprout, ShieldCheck, TrendingUp, Truck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-900/50 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">100% Verified Farmers</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Authentic Aadhaar-verified agricultural producers with zero middlemen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-900/50 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Fair Mandi Benchmark</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Prices anchored to real-time market data to ensure fair income for cultivators.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-900/50 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Harvest Fresh</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Direct procurement straight from the field to your doorstep.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Krishi<span className="text-brand-500">Setu</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering Indian agriculture by creating a direct bridge between farmers and consumers, eliminating exploitation and delivering nature's best.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Platform</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Browse Crops</Link></li>
              <li><Link to="/signup" className="hover:text-brand-400 transition-colors">Farmer Registration</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Categories</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Vegetables & Greens</li>
              <li>Fresh Farm Fruits</li>
              <li>Grains & Cereals</li>
              <li>Organic Pulses</li>
            </ul>
          </div>
        </div>

        <div className="pt-12 mt-8 border-t border-slate-800/80 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Krishi Setu. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Indian Agriculture
          </p>
        </div>

      </div>
    </footer>
  );
}
