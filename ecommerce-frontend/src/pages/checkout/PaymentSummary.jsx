import { useNavigate } from "react-router";
import axios from "axios";

export function PaymentSummary({ paymentSummary, loadCart }) {
  const navigate = useNavigate();

  const createOrder = async () => {
    await axios.post("/api/orders");
    await loadCart();
    navigate("/orders");
  };

  return (
    <div className="theme-surface h-fit border border-[#374151] p-4">
      <div className="mb-4 text-2xl font-bold text-[#F9FAFB]">Payment Summary</div>

      {paymentSummary && (
        <>
          <div className="mb-2 flex justify-between text-sm text-[#9CA3AF]">
            <div>Items ({paymentSummary.totalItems}):</div>
            <div>
              ₹{(paymentSummary.productCostCents / 100).toFixed(2)}
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm text-[#9CA3AF]">
            <div>Shipping & handling:</div>
            <div>
              ₹{(paymentSummary.shippingCostCents / 100).toFixed(2)}
            </div>
          </div>

          <div className="mb-2 flex justify-between border-t border-[#374151] pt-2 text-sm text-[#9CA3AF]">
            <div>Total before tax:</div>
            <div>
              ₹{(paymentSummary.totalCostBeforeTaxCents / 100).toFixed(2)}
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm text-[#9CA3AF]">
            <div>Estimated tax (10%):</div>
            <div>
              ₹{(paymentSummary.taxCents / 100).toFixed(2)}
            </div>
          </div>

          <div className="mb-4 flex justify-between border-t border-[#374151] pt-2 text-2xl font-bold text-[#14B8A6]">
            <div>Order total:</div>
            <div>
              ₹{(paymentSummary.totalCostCents / 100).toFixed(2)}
            </div>
          </div>

          <button className="theme-primary-btn w-full" onClick={createOrder}>
            Place your order
          </button>
        </>
      )}
    </div>
  );
}
