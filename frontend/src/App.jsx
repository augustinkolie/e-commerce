import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Deals from './pages/Deals';
import NewArrivals from './pages/NewArrivals';
import BestSellers from './pages/BestSellers';
import Seller from './pages/Seller';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import About from './pages/About';
import Contact from './pages/Contact';

import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import UserListScreen from './pages/admin/UserListScreen';
import ProductListScreen from './pages/admin/ProductListScreen';
import ProductEditScreen from './pages/admin/ProductEditScreen';
import DashboardScreen from './pages/admin/DashboardScreen';
import OrderListScreen from './pages/admin/OrderListScreen';
import ReviewListScreen from './pages/admin/ReviewListScreen';
import StatisticsScreen from './pages/admin/StatisticsScreen';
import StockScreen from './pages/admin/StockScreen';
import SettingsScreen from './pages/admin/SettingsScreen';


import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/category" element={<Category />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/new-arrivals" element={<NewArrivals />} />
                  <Route path="/best-sellers" element={<BestSellers />} />
                  <Route path="/seller" element={<Seller />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/new-password" element={<NewPassword />} />

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<DashboardScreen />} />
                    <Route path="userlist" element={<UserListScreen />} />
                    <Route path="productlist" element={<ProductListScreen />} />
                    <Route path="product/:id/edit" element={<ProductEditScreen />} />
                    <Route path="orderlist" element={<OrderListScreen />} />
                    <Route path="reviewlist" element={<ReviewListScreen />} />
                    <Route path="statistics" element={<StatisticsScreen />} />
                    <Route path="stock" element={<StockScreen />} />
                    <Route path="settings" element={<SettingsScreen />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
