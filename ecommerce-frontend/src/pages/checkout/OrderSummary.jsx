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
              className="theme-surface mb-4 border border-[#374151] p-5"
            >
              {/* Delivery date */}
              <div className="mb-3 text-3xl font-bold text-[#F9FAFB]">
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
                  <div className="font-bold text-[#F9FAFB]">{cartItem.product.name}</div>

                  <div className="theme-price my-1 font-medium">
                    ₹{(cartItem.product.priceCents / 100).toFixed(2)}
                  </div>

                  <div className="theme-secondary-text text-sm">
                    Quantity:{" "}
                    <span className="font-semibold">
                      {cartItem.quantity}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <button
                      onClick={decreaseQuantity}
                      className="h-8 w-8 rounded border border-[#374151] bg-[#111827] text-base text-[#F9FAFB]"
                    >
                      -
                    </button>

                    <span className="inline-flex h-8 min-w-10 items-center justify-center rounded border border-[#374151] px-2 text-[#F9FAFB]">
                      {cartItem.quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      className="h-8 w-8 rounded border border-[#374151] bg-[#111827] text-base text-[#F9FAFB]"
                    >
                      +
                    </button>

                    <button
                      className="ml-1 cursor-pointer text-[#9CA3AF] hover:text-[#F9FAFB]"
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
