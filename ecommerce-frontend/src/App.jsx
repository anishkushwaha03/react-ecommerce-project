import axios from 'axios';
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router';
import { HomePage } from './pages/home/HomePage.jsx';
import { CheckoutPage } from './pages/checkout/CheckoutPage.jsx';
import { OrdersPage } from './pages/orders/OrdersPage.jsx';
import { TrackingPage } from './pages/tracking/TrackingPage.jsx';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import './App.css'

const pageTitles = {
  '/': 'Home | Nexus Shop',
  '/checkout': 'Checkout | Nexus Shop',
  '/orders': 'Orders | Nexus Shop',
  '/tracking': 'Tracking | Nexus Shop',
  '/login': 'Login | Nexus Shop',
  '/signup': 'Sign Up | Nexus Shop',
};

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
  const location = useLocation();

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

  useEffect(() => {
    document.title = pageTitles[location.pathname] || 'E-Commerce';
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage cart={cart} loadCart={loadCart} />}></Route>
        <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />}></Route>
        <Route path="orders" element={<OrdersPage cart={cart} loadCart={loadCart} />}></Route>
        <Route path="tracking" element={<TrackingPage cart={cart} />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App
