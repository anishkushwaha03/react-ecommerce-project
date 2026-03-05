import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

export function Product({ product, loadCart, imageLoading = 'lazy', animationDelayMs = 0 }) {
  const [quantity, setQuantity] = useState(1);
  const [addedMessageVisible, setAddedMessageVisible] = useState(false);
  const navigate = useNavigate();

  const addToCart = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/cart-items', {
        productId: product.id,
        quantity
      });
      await loadCart();

      setAddedMessageVisible(true);

      setTimeout(() => {
        setAddedMessageVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Could not add item to cart.');
    }
  };

  const selectQuantity = (event) => {
    const quantitySelected = Number(event.target.value);
    setQuantity(quantitySelected);
  };

  return (
    <div
      className="animate-card-fade-up group mx-auto w-full max-w-67.5 rounded-xl bg-[#1F2937] p-0 text-[#F9FAFB] shadow-lg transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-2xl"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <div className="h-[5.5rem] rounded-t-xl bg-[#111827]" />

      <div className="relative -mt-[4.25rem] px-5 pb-4">
        <div className="mb-1.5 flex justify-center">
          <img
            className="h-36 w-36 rounded-2xl object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            src={product.image}
            alt={product.name}
            loading={imageLoading}
          />
        </div>

        <div className="mb-2 line-clamp-2 min-h-12 text-lg/7 font-bold text-[#F9FAFB]">{product.name}</div>

        <div className="mb-2 flex items-center gap-2">
          <img className="w-24" src={`images/ratings/rating-${product.rating.stars * 10}.png`} alt="rating" />
          <div className="text-xl text-[#14B8A6]">{product.rating.count}</div>
        </div>

        <div className="mb-1 flex items-end justify-between gap-3">
          <div className="text-2xl font-bold text-[#14B8A6]">₹{(product.priceCents / 100).toFixed(2)}</div>

          <select className="h-8 rounded border border-[#374151] bg-[#111827] px-3 text-[#F9FAFB]" value={quantity} onChange={selectQuantity}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <button className="w-full rounded-full bg-[#F97316] px-3 py-2 text-lg font-semibold text-white transition-all duration-100 ease-out hover:bg-[#EA580C] active:scale-95" onClick={addToCart}>
          {addedMessageVisible ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
