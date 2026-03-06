import dayjs from 'dayjs';
import axios from 'axios';
import { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link } from 'react-router';
import { Header } from '../../components/Header.jsx';

export function OrdersPage({ cart }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Wrap in an async function to use try/catch
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders?expand=products');
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    // Only fetch if logged in
    if (localStorage.getItem('token')) {
      fetchOrders();
    }
  }, []);

  return (
    <>
      <title>Orders</title>

      <Header cart={cart} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24">
        <h1 className="mb-6 text-3xl font-bold text-[#F9FAFB]">Your Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="animate-card-fade-up theme-surface border border-[#374151]"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-t-xl bg-[#111827] p-4 text-sm text-[#9CA3AF]">
                <div className="flex gap-8">
                  <div>
                    <div className="font-semibold">Order Placed:</div>
                    <div>{dayjs(order.orderTimeMs).format('MMMM D')}</div>
                  </div>

                  <div>
                    <div className="font-semibold">Total:</div>
                    <div>₹{(order.totalCostCents / 100).toFixed(2)}</div>
                  </div>
                </div>

                <div>
                  <div className="font-semibold">Order ID:</div>
                  <div>{order.id}</div>
                </div>
              </div>

              {/* Products */}
              <div className="grid gap-6 p-4 md:grid-cols-[110px_1fr_220px]">
                {order.products.map((orderProduct) => (
                  <Fragment key={orderProduct.product.id}>
                    {/* Product Image */}
                    <div className="text-center">
                      <img
                        className="mx-auto max-h-27.5 max-w-27.5"
                        src={orderProduct.product.image}
                        alt={orderProduct.product.name}
                      />
                    </div>

                    {/* Product Details */}
                    <div>
                      <div className="mb-1 font-bold">
                        {orderProduct.product.name}
                      </div>

                      <div className="mb-1">
                        Arriving on:{' '}
                        {dayjs(
                          orderProduct.estimatedDeliveryTimeMs
                        ).format('MMMM D')}
                      </div>

                      <div className="mb-2">
                        Quantity: {orderProduct.quantity}
                      </div>

                      <button className="theme-primary-btn flex h-9 w-36 items-center justify-center text-sm">
                        <img
                          className="mr-2 w-5"
                          src="images/icons/buy-again.png"
                          alt="buy again"
                        />
                        <span>Add to Cart</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div>
                      <Link to="/tracking">
                        <button className="w-full rounded border border-[#374151] bg-[#111827] px-3 py-2 text-sm text-[#F9FAFB] transition-colors hover:bg-[#1f2937]">
                          Track package
                        </button>
                      </Link>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
