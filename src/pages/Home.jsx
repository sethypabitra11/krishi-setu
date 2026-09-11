import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Plus, Check, Sparkles, Filter, Leaf, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { id: 'all', label: 'All Produce', icon: '🌾' },
  { id: 'vegetables', label: 'Vegetables', icon: '🥦' },
  { id: 'fruits', label: 'Fruits', icon: '🍎' },
  { id: 'grains', label: 'Grains & Cereals', icon: '🌾' },
  { id: 'pulses', label: 'Pulses & Dal', icon: '🫘' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedProductId, setAddedProductId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const { addToCart } = useCart();
  const { user, isFarmer } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/products');
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load marketplace crops. Ensure the backend is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    setActionError(null);
    if (!user) {
      setActionError('Please sign in or create an account to add items to your cart.');
      return;
    }
    if (isFarmer) {
      setActionError('Farmer accounts cannot purchase items. Switch or register as a consumer.');
      return;
    }

    try {
      await addToCart(product._id, 1);
      setAddedProductId(product._id);
      setTimeout(() => setAddedProductId(null), 1800);
    } catch (err) {
      setActionError(err.message || 'Failed to add item to cart');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.farmer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-slate-50 border-b border-brand-100/60 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Direct Farm-to-Table Marketplace
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Pure Harvest, Fresh from <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-500">Local Farmers</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              Eliminate middlemen and buy certified farm crops directly from verified cultivators at authentic APMC mandi benchmark prices.
            </p>

            {/* Quick Search in Hero */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/80 p-1.5 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search for tomatoes, wheat, rice, apples, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-sm sm:text-base font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mr-2 text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* If user is a farmer, show shortcut to dashboard */}
            {isFarmer && (
              <div className="pt-2">
                <Link
                  to="/farmer/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800 bg-brand-100/70 hover:bg-brand-100 px-4 py-2 rounded-xl transition-all"
                >
                  Go to Farmer Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Marketplace Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Error Notification Banner */}
        {actionError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center justify-between shadow-sm">
            <span>{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              className="font-bold text-amber-900 ml-3 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Category Pills & Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20 scale-[1.02]'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-2 ml-auto">
            <span>Showing:</span>
            <span className="font-bold text-slate-800">{filteredProducts.length} crop items</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-4">
                  <div className="h-40 bg-slate-100 rounded-xl"></div>
                  <div className="h-5 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-100 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-red-100 p-8">
              <p className="text-red-600 font-semibold mb-3">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700"
              >
                Retry Loading
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No crops match your filter</h3>
              <p className="text-sm text-slate-500 mb-6">
                Try searching for a different crop name or reset your category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const isRecentlyAdded = addedProductId === product._id;
                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl border border-slate-200/90 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 transition-all overflow-hidden flex flex-col group"
                  >
                    {/* Visual Card Header */}
                    <div className="h-44 bg-gradient-to-br from-brand-50 to-emerald-50/50 p-5 flex flex-col justify-between relative border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white/90 text-brand-800 border border-brand-200/60 shadow-sm backdrop-blur">
                          {product.category}
                        </span>
                        <span className="text-2xl">
                          {product.category === 'vegetables' ? '🥦' :
                           product.category === 'fruits' ? '🍎' :
                           product.category === 'grains' ? '🌾' :
                           product.category === 'pulses' ? '🫘' : '🌱'}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 font-medium">Cultivated by</div>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                          👨‍🌾 {product.farmer?.name || 'Local Verified Farmer'}
                        </p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 capitalize group-hover:text-brand-700 transition-colors">
                          {product.name}
                        </h3>

                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-2xl font-extrabold text-slate-900">
                            ₹{product.price}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            / {product.unit || 'kg'}
                          </span>
                        </div>

                        <div className="mt-2 text-xs font-medium text-slate-500 flex items-center justify-between">
                          <span>Stock Available:</span>
                          <span className="font-bold text-slate-700">
                            {product.quantity} {product.unit || 'kg'}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Action */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.quantity <= 0 || isRecentlyAdded}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                          isRecentlyAdded
                            ? 'bg-emerald-600 text-white'
                            : product.quantity <= 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-600/20 active:scale-[0.98]'
                        }`}
                      >
                        {isRecentlyAdded ? (
                          <>
                            <Check className="w-4 h-4" /> Added to Cart
                          </>
                        ) : product.quantity <= 0 ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
