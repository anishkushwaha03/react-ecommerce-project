import axios from "axios";
import dayjs from "dayjs";
import { DeliveryOptions } from "./DeliveryOptions";

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
  return (
    <div>
      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => {
          const selectedDeliveryOption = deliveryOptions.find(
            (deliveryOption) =>
              deliveryOption.id === cartItem.deliveryOptionId
          );

          const deleteCartItem = async () => {
            await axios.delete(`/api/cart-items/${cartItem.productId}`);
            await loadCart();
          };

          const updateQuantity = async (quantity) => {
            await axios.put(`/api/cart-items/${cartItem.productId}`, { quantity });
            await loadCart();
          };

          const decreaseQuantity = () => {
            if (cartItem.quantity > 1) {
              updateQuantity(cartItem.quantity - 1);
            }
          };

          const increaseQuantity = () => {
            updateQuantity(cartItem.quantity + 1);
          };

          return (
            <div
              key={cartItem.productId}
              className="mb-4 rounded border border-gray-300 bg-white p-5"
            >
              {/* Delivery date */}
              <div className="mb-3 text-3xl font-bold text-gray-900">
                Delivery date:{" "}
                {dayjs(
                  selectedDeliveryOption.estimatedDeliveryTimeMs
                ).format("dddd, MMMM D")}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[110px_1fr_280px]">
                
                {/* Product Image */}
                <img
                  className="mx-auto h-24 w-24 object-cover"
                  src={cartItem.product.image}
                  alt={cartItem.product.name}
                />

                {/* Product Details */}
                <div>
                  <div className="font-bold text-gray-900">{cartItem.product.name}</div>

                  <div className="my-1 font-medium text-red-700">
                    ₹{(cartItem.product.priceCents / 100).toFixed(2)}
                  </div>

                  <div className="text-sm">
                    Quantity:{" "}
                    <span className="font-semibold">
                      {cartItem.quantity}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <button
                      onClick={decreaseQuantity}
                      className="h-8 w-8 rounded border border-gray-300 bg-gray-100 text-base"
                    >
                      -
                    </button>

                    <span className="inline-flex h-8 min-w-10 items-center justify-center rounded border border-gray-300 px-2">
                      {cartItem.quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      className="h-8 w-8 rounded border border-gray-300 bg-gray-100 text-base"
                    >
                      +
                    </button>

                    <button
                      className="ml-1 cursor-pointer text-gray-500 hover:text-red-700"
                      onClick={deleteCartItem}
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Delivery Options */}
                <DeliveryOptions
                  cartItem={cartItem}
                  deliveryOptions={deliveryOptions}
                  loadCart={loadCart}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
