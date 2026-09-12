import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

import FarmerDashboard from './pages/farmer/Dashboard';
import MyProducts from './pages/farmer/MyProducts';
import AddProduct from './pages/farmer/AddProduct';
import Predictions from './pages/farmer/Predictions';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* Public Marketplace Route */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Consumer Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRole="consumer">
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                {/* Common Authenticated Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Farmer Protected Routes */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <ProtectedRoute allowedRole="farmer">
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/my-products"
                  element={
                    <ProtectedRoute allowedRole="farmer">
                      <MyProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/add-product"
                  element={
                    <ProtectedRoute allowedRole="farmer">
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/predictions"
                  element={
                    <ProtectedRoute allowedRole="farmer">
                      <Predictions />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
