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

          return (
            <div
              key={cartItem.productId}
              className="mb-4 rounded border border-gray-200 bg-white p-4 shadow-sm"
            >
              {/* Delivery date */}
              <div className="mb-3 text-lg font-bold text-emerald-700">
                Delivery date:{" "}
                {dayjs(
                  selectedDeliveryOption.estimatedDeliveryTimeMs
                ).format("dddd, MMMM D")}
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[120px_1fr_260px]">
                
                {/* Product Image */}
                <img
                  className="mx-auto max-h-28 max-w-28"
                  src={cartItem.product.image}
                  alt={cartItem.product.name}
                />

                {/* Product Details */}
                <div>
                  <div className="font-bold">{cartItem.product.name}</div>

                  <div className="my-1 text-red-700">
                    ₹{(cartItem.product.priceCents / 100).toFixed(2)}
                  </div>

                  <div className="text-sm">
                    Quantity:{" "}
                    <span className="font-semibold">
                      {cartItem.quantity}
                    </span>
                  </div>

                  <div className="mt-1 text-sm">
                    <span className="mr-3 cursor-pointer text-emerald-700">
                      Update
                    </span>

                    <span
                      className="cursor-pointer text-emerald-700"
                      onClick={deleteCartItem}
                    >
                      Delete
                    </span>
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