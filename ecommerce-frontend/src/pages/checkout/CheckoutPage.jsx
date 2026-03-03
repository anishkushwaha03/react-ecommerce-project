import axios from 'axios';
import { useState, useEffect } from 'react';
import './checkout-header.css';
import './CheckoutPage.css';
import { OrderSummary } from './orderSummary';
import { PaymentSummary } from './PaymentSummary';
import { Link } from 'react-router';

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const response = await axios.get('/api/delivery-options?expand=estimatedDeliveryTime');
        setDeliveryOptions(response.data);
      } catch (error) {
        console.error("Error fetching delivery options:", error);
      }
    };

    fetchDeliveryOptions();
  }, []);

  useEffect(() => {
    const fetchPaymentSummary = async () => {
      try {
        const response = await axios.get('/api/payment-summary');
        setPaymentSummary(response.data);
      } catch (error) {
        console.error("Error fetching payment summary:", error);
      }
    };

    fetchPaymentSummary();
  }, [cart]);

  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  return (
    <>
      <title>Checkout</title>

      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/" className="header-link">
              <img className="logo" src="images/logo.png" />
              <img className="mobile-logo" src="images/mobile-logo.png" />
            </Link>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (<Link to="/" className="return-to-home-link"
            > {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</Link>)
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <OrderSummary cart={cart} deliveryOptions={deliveryOptions} loadCart={loadCart} />
          <PaymentSummary paymentSummary={paymentSummary} loadCart={loadCart} />
        </div>
      </div>
    </>
  );
}