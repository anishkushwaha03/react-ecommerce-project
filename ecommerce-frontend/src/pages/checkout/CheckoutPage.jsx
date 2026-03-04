import axios from 'axios';
import { useState, useEffect } from 'react';
import { OrderSummary } from './OrderSummary';
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

  const totalQuantity = cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <title>Checkout</title>

      <header className="sticky inset-x-0 top-0 z-20 border-b border-gray-200 bg-white px-4">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">

          <div className="w-auto md:w-52">
            <Link
              to="/"
              className="inline-block rounded border border-transparent p-2 hover:border-gray-300"
            >
              <img
                className="hidden h-7 sm:block"
                src="images/logo.png"
                alt="logo"
              />
              <img
                className="h-8 sm:hidden"
                src="images/mobile-logo.png"
                alt="logo"
              />
            </Link>
          </div>

          <div className="text-base font-semibold sm:text-3xl">
            Checkout (
            <Link to="/" className="text-emerald-700 underline">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </Link>
            )
          </div>

          <div className="flex items-center justify-end md:w-52">
            <img
              src="images/icons/checkout-lock-icon.png"
              alt="secure"
              className="h-7"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <OrderSummary
            cart={cart}
            deliveryOptions={deliveryOptions}
            loadCart={loadCart}
          />

          <PaymentSummary
            paymentSummary={paymentSummary}
            loadCart={loadCart}
          />
        </div>
      </main>
    </div>
  );
}
