import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  Coins, 
  Award,
  Layers
} from 'lucide-react';
import { 
  ML_LOCATIONS, 
  ML_PRODUCTS, 
  predictPrice, 
  predictDemand, 
  recommendProducts 
} from '../../api/mlClient';

export default function Predictions() {
  const [location, setLocation] = useState('Patia');
  const [product, setProduct] = useState('Tomato');
  const [supply, setSupply] = useState('500');
  const [festival, setFestival] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prediction results
  const [priceData, setPriceData] = useState(null);
  const [demandData, setDemandData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Execute all 3 ML model endpoints in parallel
      const [priceRes, demandRes, recRes] = await Promise.all([
        predictPrice({
          location,
          product,
          market_supply_kg: Number(supply) || 500,
          festival_season: festival ? 1 : 0,
        }),
        predictDemand({
          location,
          product,
          market_supply_kg: Number(supply) || 500,
          festival_season: festival ? 1 : 0,
        }),
        recommendProducts({
          location,
          festival_season: festival ? 1 : 0,
        }),
      ]);

      setPriceData(priceRes);
      setDemandData(demandRes);
      setRecommendations(recRes?.recommendations || []);
    } catch (err) {
      console.error('ML API prediction error:', err);
      setError(
        'Could not get prediction from the Render ML service. Note that Render free-tier instances may take 30-50 seconds to wake up if idle. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on load
  useEffect(() => {
    handlePredict();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Link & Header */}
      <div className="space-y-4">
        <Link
          to="/farmer/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Farmer Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Trained Machine Learning Model Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              AI Crop Price & Demand Forecaster
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Predict harvest market prices, local mandi demand, and recommended profitable crops using Random Forest ML models
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API: <code className="font-bold text-slate-800">sih-2026-lx6e.onrender.com</code></span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div className="flex-1">
            <span className="font-bold block">Model Service Notice:</span>
            <span className="leading-relaxed">{error}</span>
          </div>
          <button
            onClick={() => handlePredict()}
            className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 shrink-0"
          >
            Retry Call
          </button>
        </div>
      )}

      {/* Control Panel: Parameters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-brand-600" />
          Forecasting Parameters
        </div>

        <form onSubmit={handlePredict} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Mandi Location */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Target Mandi / Market
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {ML_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Crop / Product */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" /> Crop / Commodity
            </label>
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {ML_PRODUCTS.map((prod) => (
                <option key={prod} value={prod}>
                  {prod}
                </option>
              ))}
            </select>
          </div>

          {/* Market Supply */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-400" /> Market Supply (kg)
            </label>
            <input
              type="number"
              min="50"
              step="50"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              placeholder="500"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Festival Season & Submit */}
          <div className="flex flex-col justify-between space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Season Modifier
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 flex-1">
                <input
                  type="checkbox"
                  checked={festival}
                  onChange={(e) => setFestival(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>🎉 Festival Season</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 flex items-center justify-center gap-1.5 disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Predict
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>

      {/* Model Predictions Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Expected Price */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Price Forecaster
              </span>
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 pt-2">
              Predicted Fair Price ({product})
            </h3>
            <p className="text-xs text-slate-500">
              Optimal selling rate per kg at {location} mandi
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100/80 flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-brand-800">
                ₹{priceData ? priceData.expected_price_per_kg : '--'}
              </span>
              <span className="text-sm font-semibold text-slate-600 ml-1">/ kg</span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-white/80 px-2.5 py-1 rounded-lg border border-emerald-200">
              AI Optimized
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Computed by Random Forest Regression accounting for location density, seasonal spikes, and supply volume.
          </p>
        </div>

        {/* Card 2: Expected Demand */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Demand Forecaster
              </span>
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 pt-2">
              Estimated Consumer Demand ({product})
            </h3>
            <p className="text-xs text-slate-500">
              Anticipated market absorption capacity at {location}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/80 flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-slate-900">
                {demandData ? demandData.expected_demand_kg : '--'}
              </span>
              <span className="text-sm font-semibold text-slate-600 ml-1">kg</span>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200">
              {demandData?.expected_demand_kg > 500 ? 'High Demand' : 'Steady Demand'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Helps cultivators prevent crop distress sales and avoid over-supplying local mandis.
          </p>
        </div>

      </div>

      {/* Recommendations: Top 3 Most Profitable Crops for this Mandi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-black text-slate-900">
                Top Recommended Profitable Crops for {location}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Ranked by AI expected revenue potential based on market demand and current price curves
            </p>
          </div>
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full self-start sm:self-auto">
            {festival ? 'Festival Multiplier Active' : 'Normal Season'}
          </span>
        </div>

        {loading && !recommendations ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => {
              const rankLabels = ['🥇 Top Choice', '🥈 High Return', '🥉 Strong Yield'];
              return (
                <div
                  key={rec.product}
                  className={`rounded-2xl p-5 border transition-all ${
                    index === 0
                      ? 'bg-gradient-to-b from-brand-50/80 to-white border-brand-300 ring-2 ring-brand-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      index === 0 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {rankLabels[index] || `#${index + 1}`}
                    </span>
                    <span className="text-2xl">
                      {rec.product === 'Tomato' ? '🍅' :
                       rec.product === 'Potato' ? '🥔' :
                       rec.product === 'Onion' ? '🧅' :
                       rec.product === 'Cauliflower' ? '🥦' :
                       rec.product === 'Cabbage' ? '🥬' :
                       rec.product === 'Brinjal' ? '🍆' : '🌱'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mt-4 capitalize">
                    {rec.product}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs font-medium">
                    <div className="flex justify-between text-slate-600">
                      <span>Expected Price:</span>
                      <span className="font-bold text-slate-900">₹{rec.expected_price_per_kg} / kg</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Demand:</span>
                      <span className="font-bold text-slate-900">{rec.expected_demand_kg} kg</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="font-bold text-slate-700">Projected Revenue:</span>
                      <span className="text-base font-black text-brand-700">₹{rec.expected_revenue}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      to="/farmer/add-product"
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors ${
                        index === 0
                          ? 'bg-brand-600 hover:bg-brand-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      List {rec.product} Now <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-slate-500">
            No recommendations generated.
          </div>
        )}
      </div>

    </div>
  );
}
