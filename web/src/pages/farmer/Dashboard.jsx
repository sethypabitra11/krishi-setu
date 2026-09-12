import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Package, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Sprout, 
  Coins, 
  Calendar,
  Sparkles
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Market price widget state
  const [commodity, setCommodity] = useState('Tomato');
  const [marketPriceData, setMarketPriceData] = useState(null);
  const [marketPriceLoading, setMarketPriceLoading] = useState(false);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products/my-products');
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error('Failed to load farmer products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  const handleFetchMarketPrice = async (cropName = commodity) => {
    try {
      setMarketPriceLoading(true);
      const res = await api.get(`/market-price/test?commodity=${encodeURIComponent(cropName)}`);
      setMarketPriceData(res.data);
    } catch (err) {
      console.error('Error fetching market price:', err);
    } finally {
      setMarketPriceLoading(false);
    }
  };

  useEffect(() => {
    handleFetchMarketPrice('Tomato');
  }, []);

  const totalStock = products.reduce((acc, p) => acc + (p.quantity || 0), 0);
  const totalValueEstimate = products.reduce((acc, p) => acc + (p.price || 0) * (p.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-800 via-brand-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Verified Cultivator • Aadhaar Linked
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Namaste, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-sm sm:text-base text-brand-100 max-w-xl font-medium">
            Welcome to your Krishi Setu cultivator portal. List your harvest at fair prices directly to consumers across India.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link
            to="/farmer/predictions"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-900" /> AI Forecaster
          </Link>
          <Link
            to="/farmer/add-product"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-800 font-bold text-sm shadow-md hover:bg-brand-50 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-brand-600" /> List Crop
          </Link>
          <Link
            to="/farmer/my-products"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-900/40 hover:bg-brand-900/60 border border-white/20 text-white font-bold text-sm transition-all"
          >
            <Package className="w-4 h-4" /> Manage
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Listings</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{products.length}</div>
            <p className="text-xs text-brand-700 font-medium mt-1">Live on Marketplace</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Crop Volume</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalStock}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Units available across listings</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Harvest Value</span>
            <div className="text-3xl font-black text-brand-700 mt-1">₹{totalValueEstimate}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">Direct consumer payout potential</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Listings & APMC Mandi Rates Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Crops Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900">Your Recent Crop Listings</h2>
              <p className="text-xs text-slate-500 font-medium">Currently visible to consumers</p>
            </div>
            <Link
              to="/farmer/my-products"
              className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Sprout className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">You haven't listed any crops yet.</p>
              <Link
                to="/farmer/add-product"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Your First Crop
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                    <th className="pb-3">Crop Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {products.slice(0, 5).map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 capitalize flex items-center gap-2">
                        <span>
                          {p.category === 'vegetables' ? '🥦' :
                           p.category === 'fruits' ? '🍎' :
                           p.category === 'grains' ? '🌾' : '🌱'}
                        </span>
                        {p.name}
                      </td>
                      <td className="py-3.5 capitalize text-xs text-slate-500">{p.category}</td>
                      <td className="py-3.5 font-semibold text-slate-800">
                        {p.quantity} {p.unit || 'kg'}
                      </td>
                      <td className="py-3.5 font-bold text-brand-700">₹{p.price}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* APMC Mandi Market Price Benchmark Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-slate-900">Mandi Price Index</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              Govt. Data
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Check real-time APMC Mandi market rates from data.gov.in to ensure your harvest is priced competitively.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              placeholder="e.g. Tomato, Onion, Wheat"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={() => handleFetchMarketPrice()}
              disabled={marketPriceLoading}
              className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm disabled:opacity-60"
            >
              <Search className="w-3.5 h-3.5" /> Check
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className="text-slate-400">Quick:</span>
            {['Tomato', 'Potato', 'Onion', 'Rice', 'Wheat'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCommodity(c);
                  handleFetchMarketPrice(c);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 font-medium"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Results Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            {marketPriceLoading ? (
              <div className="py-6 flex justify-center text-xs text-slate-400">
                Fetching Mandi records...
              </div>
            ) : marketPriceData?.records?.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{marketPriceData.commodity} Mandi Avg:</span>
                  <span className="text-brand-700">
                    ₹{marketPriceData.records[0]?.modal_price || 30} / quintal
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>Market: {marketPriceData.records[0]?.market || 'Local APMC'}</div>
                  <div>State: {marketPriceData.records[0]?.state || 'National Benchmark'}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 text-center py-4">
                Enter a commodity name and click Check to view live mandi pricing.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
