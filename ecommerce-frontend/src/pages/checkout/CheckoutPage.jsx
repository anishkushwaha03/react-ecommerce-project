import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { OrderSummary } from './OrderSummary';
import { PaymentSummary } from './PaymentSummary';
import { Link } from 'react-router';

export function CheckoutPage({ cart, loadCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);

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

  // Calculate payment summary instantly on the frontend instead of fetching from the API
  const paymentSummary = useMemo(() => {
    if (!cart.length || !deliveryOptions.length) return null;

    let totalItems = 0;
    let productCostCents = 0;
    let shippingCostCents = 0;

    cart.forEach((cartItem) => {
      const product = cartItem.product;
      const deliveryOption = deliveryOptions.find((d) => d.id === cartItem.deliveryOptionId);

      if (product && deliveryOption) {
        totalItems += cartItem.quantity;
        productCostCents += product.priceCents * cartItem.quantity;
        shippingCostCents += deliveryOption.priceCents;
      }
    });

    const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
    const totalCostCents = totalCostBeforeTaxCents + taxCents;

    return {
      totalItems,
      productCostCents,
      shippingCostCents,
      totalCostBeforeTaxCents,
      taxCents,
      totalCostCents
    };
  }, [cart, deliveryOptions]);

  const totalQuantity = cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);

  return (
    <div className="min-h-screen text-[#F9FAFB]">
      <title>Checkout</title>

      <header className="sticky inset-x-0 top-0 z-20 border-b border-[#374151] bg-[rgba(15,23,42,0.85)] px-4 shadow-lg backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">

          <div className="w-auto md:w-52">
            <Link
              to="/"
              className="inline-block rounded border border-transparent p-2 transition-colors hover:border-[#9CA3AF]"
            >
              <img
                className="hidden h-7 sm:block"
                src="/images/logo-white.png"
                alt="logo"
              />
              <img
                className="h-8 sm:hidden"
                src="/images/mobile-logo-white.png"
                alt="logo"
              />
            </Link>
          </div>

          <div className="text-base font-semibold text-[#F9FAFB] sm:text-3xl">
            Checkout (
            <Link to="/" className="text-[#14B8A6] underline hover:text-[#2dd4bf]">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </Link>
            )
          </div>

          <div className="flex items-center justify-end md:w-52">
            <img
              src="/images/icons/checkout-lock-icon.png"
              alt="secure"
              className="h-7"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          
          {/* If data is missing, show spinner across both columns */}
          {!paymentSummary || deliveryOptions.length === 0 ? (
            <div className="col-span-1 flex items-center justify-center py-32 lg:col-span-2">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#14B8A6] border-t-transparent"></div>
            </div>
          ) : (
            /* Once data arrives, show the components */
            <>
              <OrderSummary
                cart={cart}
                deliveryOptions={deliveryOptions}
                loadCart={loadCart}
              />

              <PaymentSummary
                paymentSummary={paymentSummary}
                loadCart={loadCart}
              />
            </>
          )}

        </div>
      </main>
    </div>
  );
}
