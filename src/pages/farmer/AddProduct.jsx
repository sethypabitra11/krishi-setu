import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sprout, 
  ArrowLeft, 
  PlusCircle, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import api from '../../api/client';

const BENCHMARK_RATES = {
  vegetables: { tomato: 28, onion: 32, potato: 24, cabbage: 26, cauliflower: 35 },
  fruits: { apple: 120, banana: 45, mango: 80, orange: 70 },
  grains: { rice: 42, wheat: 30, maize: 25 },
  pulses: { lentil: 95, chickpea: 75, pigeonpea: 110 },
};

export default function AddProduct() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('vegetables');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Estimate price per unit from benchmark table
  const estimatedPrice = 
    BENCHMARK_RATES[category]?.[name.trim().toLowerCase()] || 30;

  const estimatedTotal = quantity ? Number(quantity) * estimatedPrice : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a crop name.');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError('Please enter a valid harvest quantity.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/products', {
        name: name.trim(),
        category,
        quantity: Number(quantity),
        unit,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/farmer/my-products');
      }, 1200);
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Failed to list crop. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back link */}
      <div className="mb-6">
        <Link
          to="/farmer/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Farmer Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 px-2.5 py-1 rounded-md">
              Harvest Listing Form
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">List New Harvest Crop</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Add crops directly to the Krishi Setu marketplace for consumers
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Sprout className="w-7 h-7" />
          </div>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Crop listed successfully! Redirecting to your listings...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Crop Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Crop / Commodity Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tomato, Onion, Potato, Basmati Rice, Apple"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            />
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Common:</span>
              {['Tomato', 'Potato', 'Onion', 'Rice', 'Wheat', 'Mango', 'Apple'].map((crop) => (
                <button
                  type="button"
                  key={crop}
                  onClick={() => setName(crop)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 text-[11px] font-medium"
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Crop Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'vegetables', label: 'Vegetables', icon: '🥦' },
                { id: 'fruits', label: 'Fruits', icon: '🍎' },
                { id: 'grains', label: 'Grains & Cereals', icon: '🌾' },
                { id: 'pulses', label: 'Pulses & Dal', icon: '🫘' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-3 rounded-xl border text-sm font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    category === c.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-xs">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Available Harvest Quantity
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 100"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Unit of Measurement
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white transition-all"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="quintal">Quintal (100 kg)</option>
                <option value="ton">Metric Ton (1000 kg)</option>
              </select>
            </div>
          </div>

          {/* Transparent Mandi Pricing Preview Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-50/70 to-emerald-50/40 border border-brand-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-700" />
                <h3 className="text-sm font-bold text-brand-900">Benchmark APMC Mandi Pricing</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Zero Middlemen Cut
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Krishi Setu's smart pricing engine automatically calculates fair market rates based on state APMC data.
            </p>

            <div className="pt-2 border-t border-brand-200/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Estimated Rate:</span>
                <div className="text-lg font-black text-brand-800">
                  ₹{estimatedPrice} <span className="text-xs font-normal text-slate-600">/ {unit}</span>
                </div>
              </div>

              {estimatedTotal > 0 && (
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium">Est. Total Revenue:</span>
                  <div className="text-lg font-black text-slate-900">
                    ₹{estimatedTotal}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-brand-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <Link
                to="/farmer/predictions"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 px-3 py-1.5 rounded-lg transition-colors w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Want Mandi-Specific Prediction? Use AI Forecaster →
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || success}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99]"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" /> Publish Crop to Marketplace
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
