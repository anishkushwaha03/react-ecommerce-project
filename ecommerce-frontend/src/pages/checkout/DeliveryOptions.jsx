import dayjs from "dayjs";
import axios from "axios";
import { useState, useEffect } from "react";

export function DeliveryOptions({ cartItem, deliveryOptions, loadCart }) {
  // Added local state for instantaneous optimistic UI updates
  const [selectedOptionId, setSelectedOptionId] = useState(cartItem.deliveryOptionId);

  // Sync state if cart updates globally
  useEffect(() => {
    setSelectedOptionId(cartItem.deliveryOptionId);
  }, [cartItem.deliveryOptionId]);

  return (
    <div>
      <div className="mb-2 font-semibold text-[#F9FAFB]">Choose a delivery option:</div>

      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";

        if (deliveryOption.priceCents > 0) {
          priceString = `₹${(deliveryOption.priceCents / 100).toFixed(2)} - Shipping`;
        }

        const updateDeliveryOption = async () => {
          // Optimistically update the UI instantly
          setSelectedOptionId(deliveryOption.id);

          try {
            await axios.put(`/api/cart-items/${cartItem.productId}`, {
              deliveryOptionId: deliveryOption.id,
            });
            await loadCart();
          } catch (error) {
            // Revert local state if the API call fails
            setSelectedOptionId(cartItem.deliveryOptionId);
            console.error(error);
          }
        };

        return (
          <div
            key={deliveryOption.id}
            className="mb-2 flex cursor-pointer items-start gap-2"
            onClick={updateDeliveryOption}
          >
            <input
              type="radio"
              checked={deliveryOption.id === selectedOptionId} // Use local state here
              onChange={updateDeliveryOption}
              className="mt-1"
              name={`delivery-option-${cartItem.productId}`}
            />

            <div>
              <div className="font-semibold text-[#F9FAFB]">
                {dayjs(deliveryOption.estimatedDeliveryTimeMs).format(
                  "dddd, MMMM D"
                )}
              </div>
              <div className="text-sm text-[#9CA3AF]">{priceString}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}