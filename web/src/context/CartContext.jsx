import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart when authenticated as consumer
  const fetchCart = useCallback(async () => {
    if (!token || user?.role === 'farmer') {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/cart');
      setItems(res.data?.items || []);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      throw new Error('Please log in to add items to your cart.');
    }
    try {
      const res = await api.post('/cart', { productId, quantity });
      setItems(res.data?.items || []);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      throw new Error(msg);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put('/cart', { productId, quantity });
      setItems(res.data?.items || []);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update cart';
      throw new Error(msg);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      setItems(res.data?.items || []);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      throw new Error(msg);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  // Derived totals
  const totalItemsCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const cartSubtotal = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        totalItemsCount,
        cartSubtotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
