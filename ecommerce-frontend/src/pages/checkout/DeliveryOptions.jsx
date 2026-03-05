import dayjs from "dayjs";
import axios from "axios";

export function DeliveryOptions({ cartItem, deliveryOptions, loadCart }) {
  return (
    <div>
      <div className="mb-2 font-semibold text-[#F9FAFB]">Choose a delivery option:</div>

      {deliveryOptions.map((deliveryOption) => {
        let priceString = "FREE Shipping";

        if (deliveryOption.priceCents > 0) {
          priceString = `₹${(deliveryOption.priceCents / 100).toFixed(2)} - Shipping`;
        }

        const updateDeliveryOption = async () => {
          await axios.put(`/api/cart-items/${cartItem.productId}`, {
            deliveryOptionId: deliveryOption.id,
          });

          await loadCart();
        };

        return (
          <div
            key={deliveryOption.id}
            className="mb-2 flex cursor-pointer items-start gap-2"
            onClick={updateDeliveryOption}
          >
            <input
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              onChange={() => {}}
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
