import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CheckCircle2 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { 
    items, 
    loading, 
    cartSubtotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const deliveryFee = cartSubtotal > 499 || items.length === 0 ? 0 : 40;
  const platformFee = items.length > 0 ? 5 : 0;
  const grandTotal = cartSubtotal + deliveryFee + platformFee;

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(async () => {
      await clearCart();
      setCheckingOut(false);
      setOrderPlaced(true);
    }, 1200);
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Thank you for supporting our local farmers directly! The crops will be packed and dispatched straight from the farm.
        </p>
        <Link
          to="/"
          onClick={() => setOrderPlaced(false)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-md shadow-brand-600/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Looks like you haven't added any harvest to your cart yet. Discover fresh farm crops straight from certified cultivators.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-md shadow-brand-600/25 transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" /> Explore Farm Produce
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Your Harvest Basket</h1>
          <p className="text-sm text-slate-500 font-medium">Review your selected crops before checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-red-600 transition-colors"
        >
          Clear Basket
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;

            const itemSubtotal = (product.price || 0) * item.quantity;

            return (
              <div
                key={item._id || product._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-brand-50 text-2xl flex items-center justify-center shrink-0 border border-brand-100">
                    {product.category === 'vegetables' ? '🥦' :
                     product.category === 'fruits' ? '🍎' :
                     product.category === 'grains' ? '🌾' :
                     product.category === 'pulses' ? '🫘' : '🌱'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base capitalize">{product.name}</h3>
                    <p className="text-xs text-slate-500 capitalize">
                      {product.category} • ₹{product.price} / {product.unit || 'kg'}
                    </p>
                    <span className="inline-block text-[11px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded font-semibold mt-1">
                      Direct Farm Harvest
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(product._id, Math.max(0, item.quantity - 1))}
                      className="p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      className="p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{itemSubtotal}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800"
            >
              <ArrowLeft className="w-4 h-4" /> Add More Farm Produce
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Crops Subtotal</span>
              <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-slate-400" />
                Delivery Fee
              </span>
              <span className="font-semibold text-slate-900">
                {deliveryFee === 0 ? (
                  <span className="text-brand-600 uppercase text-xs font-bold">FREE</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Farmer Direct Assurance
              </span>
              <span className="font-semibold text-slate-900">₹{platformFee}</span>
            </div>

            {deliveryFee > 0 && (
              <p className="text-xs text-brand-700 bg-brand-50 p-2.5 rounded-xl">
                💡 Add ₹{500 - cartSubtotal} more for <span className="font-bold">FREE Delivery</span>!
              </p>
            )}

            <div className="border-t border-slate-200 pt-4 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-brand-700">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {checkingOut ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Place Farm Order
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Direct farmer bank transfer upon harvest inspection & doorstep delivery.
          </p>
        </div>

      </div>
    </div>
  );
}
