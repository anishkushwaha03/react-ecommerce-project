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
    <div className="h-fit rounded border border-gray-300 bg-white p-4">
      <div className="mb-4 text-2xl font-bold">Payment Summary</div>

      {paymentSummary && (
        <>
          <div className="mb-2 flex justify-between text-sm">
            <div>Items ({paymentSummary.totalItems}):</div>
            <div>
              ₹{(paymentSummary.productCostCents / 100).toFixed(2)}
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm">
            <div>Shipping & handling:</div>
            <div>
              ₹{(paymentSummary.shippingCostCents / 100).toFixed(2)}
            </div>
          </div>

          <div className="mb-2 flex justify-between border-t border-gray-300 pt-2 text-sm">
            <div>Total before tax:</div>
            <div>
              ₹{(paymentSummary.totalCostBeforeTaxCents / 100).toFixed(2)}
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm">
            <div>Estimated tax (10%):</div>
            <div>
              ₹{(paymentSummary.taxCents / 100).toFixed(2)}
            </div>
          </div>

          <div className="mb-4 flex justify-between border-t border-red-200 pt-2 text-2xl font-bold text-red-700">
            <div>Order total:</div>
            <div>
              ₹{(paymentSummary.totalCostCents / 100).toFixed(2)}
            </div>
          </div>

          <button
            className="w-full rounded bg-emerald-700 px-3 py-2 text-white hover:bg-emerald-600"
            onClick={createOrder}
          >
            Place your order
          </button>
        </>
      )}
    </div>
  );
}
