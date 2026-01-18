//import { useState } from 'react'
import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { OrdersPage } from './pages/OrdersPage.jsx';
import { TrackingPage } from './pages/TrackingPage.jsx';
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}></Route>
      <Route path="checkout" element={<CheckoutPage />}></Route>
      <Route path="orders" element={<OrdersPage />}></Route>
      <Route path="tracking" element={<TrackingPage />}></Route>
    </Routes>
  );
}

export default App
