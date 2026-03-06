import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { DeliveryOptions } from "./DeliveryOptions";

const MAX_QUANTITY = 10;

export function OrderSummary({ cart, deliveryOptions, loadCart }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isUpdatingProductId, setIsUpdatingProductId] = useState(null);

  return (
    <div>
      {errorMessage && (
        <div className="mb-4 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {deliveryOptions.length > 0 &&
        cart.map((cartItem) => {
          const selectedDeliveryOption = deliveryOptions.find(
            (deliveryOption) =>
              deliveryOption.id === cartItem.deliveryOptionId
          );

          const isUpdating = isUpdatingProductId === cartItem.productId;

          const deleteCartItem = async () => {
            if (isUpdating) return;

            setErrorMessage("");
            setIsUpdatingProductId(cartItem.productId);

            try {
              await axios.delete(`/api/cart-items/${cartItem.productId}`);
              await loadCart();
            } catch (error) {
              console.error("Failed to delete cart item:", error);
              setErrorMessage("Unable to remove item from cart. Please try again.");
            } finally {
              setIsUpdatingProductId(null);
            }
          };

          const updateQuantity = async (quantity) => {
            if (isUpdating) return;

            setErrorMessage("");
            setIsUpdatingProductId(cartItem.productId);

            try {
              await axios.put(`/api/cart-items/${cartItem.productId}`, { quantity });
              await loadCart();
            } catch (error) {
              console.error("Failed to update cart item quantity:", error);
              setErrorMessage("Unable to update quantity. Please try again.");
            } finally {
              setIsUpdatingProductId(null);
            }
          };

          const decreaseQuantity = () => {
            if (cartItem.quantity > 1) {
              updateQuantity(cartItem.quantity - 1);
            }
          };

          const increaseQuantity = () => {
            if (cartItem.quantity >= MAX_QUANTITY) {
              setErrorMessage(`You can only add up to ${MAX_QUANTITY} units of this item.`);
              return;
            }

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
                {selectedDeliveryOption?.estimatedDeliveryTimeMs
                  ? dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format("dddd, MMMM D")
                  : "TBD"}
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
                      className="h-8 w-8 rounded border border-[#374151] bg-[#111827] text-base text-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isUpdating}
                    >
                      -
                    </button>

                    <span className="inline-flex h-8 min-w-10 items-center justify-center rounded border border-[#374151] px-2 text-[#F9FAFB]">
                      {cartItem.quantity}
                    </span>

                    <button
                      onClick={increaseQuantity}
                      className="h-8 w-8 rounded border border-[#374151] bg-[#111827] text-base text-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isUpdating}
                    >
                      +
                    </button>

                    <button
                      className="ml-1 cursor-pointer text-[#9CA3AF] hover:text-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={deleteCartItem}
                      disabled={isUpdating}
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
