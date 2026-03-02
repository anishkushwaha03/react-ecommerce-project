import axios from 'axios';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { HomePage } from './pages/home/HomePage.jsx';
import { CheckoutPage } from './pages/checkout/CheckoutPage.jsx';
import { OrdersPage } from './pages/orders/OrdersPage.jsx';
import { TrackingPage } from './pages/tracking/TrackingPage.jsx';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import './App.css'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function App() {
  const [cart, setCart] = useState([]);

  const loadCart = async () => {
    if (!localStorage.getItem('token')) {
      setCart([]);
      return;
    }

    try {
      const response = await axios.get('/api/cart-items?expand=product');
      setCart(response.data);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage cart={cart} loadCart={loadCart} />}></Route>
      <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />}></Route>
      <Route path="orders" element={<OrdersPage cart={cart} />}></Route>
      <Route path="tracking" element={<TrackingPage />}></Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App
