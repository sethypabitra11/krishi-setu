import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Trash2, 
  PlusCircle, 
  ArrowLeft, 
  AlertCircle, 
  Calendar, 
  Tag, 
  Check 
} from 'lucide-react';
import api from '../../api/client';

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/my-products');
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error('Failed to load farmer products:', err);
      setMessage({ type: 'error', text: 'Failed to load your crop listings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the marketplace?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setMessage({ type: 'success', text: `"${name}" removed successfully.` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting product:', err);
      setMessage({ type: 'error', text: 'Failed to delete listing.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Link to="/farmer/dashboard" className="hover:text-brand-600 transition-colors">
              Farmer Dashboard
            </Link>
            <span>/</span>
            <span className="text-brand-700">My Listings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Active Crop Listings</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Manage your harvest listings, stock volumes, and market pricing
          </p>
        </div>

        <Link
          to="/farmer/add-product"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-600/20 hover:bg-brand-700 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Add New Crop
        </Link>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Crop Listings Found</h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            You currently do not have any active harvest listings on the marketplace.
          </p>
          <Link
            to="/farmer/add-product"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-md shadow-brand-600/20"
          >
            <PlusCircle className="w-4 h-4" /> List Your First Crop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const isDeleting = deletingId === p._id;
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 text-2xl flex items-center justify-center border border-brand-100">
                        {p.category === 'vegetables' ? '🥦' :
                         p.category === 'fruits' ? '🍎' :
                         p.category === 'grains' ? '🌾' : '🌱'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg capitalize">{p.name}</h3>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {p.category}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs font-medium">
                    <div>
                      <span className="text-slate-400 block">Current Price</span>
                      <span className="text-base font-black text-slate-900">
                        ₹{p.price} <span className="text-xs font-normal text-slate-500">/ {p.unit || 'kg'}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Available Stock</span>
                      <span className="text-base font-black text-brand-700">
                        {p.quantity} {p.unit || 'kg'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleDelete(p._id, p.name)}
                    disabled={isDeleting}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg font-bold transition-colors disabled:opacity-50"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
