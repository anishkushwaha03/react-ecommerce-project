import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

export function Product({ product, loadCart, imageLoading = 'lazy' }) {
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
    <div className="mx-auto w-full max-w-67.5 rounded-2xl border border-neutral-700 bg-neutral-50 p-0 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.14)]">
      <div className="h-[5.5rem] rounded-t-2xl bg-[#7b4738]" />

      <div className="relative -mt-[4.25rem] px-5 pb-4">
        <div className="mb-1.5 flex justify-center">
          <img
            className="h-36 w-36 rounded-2xl object-cover"
            src={product.image}
            alt={product.name}
            loading={imageLoading}
          />
        </div>

        <div className="mb-2 line-clamp-2 min-h-12 text-lg/7 font-bold text-neutral-900">{product.name}</div>

        <div className="mb-2 flex items-center gap-2">
          <img className="w-24" src={`images/ratings/rating-${product.rating.stars * 10}.png`} alt="rating" />
          <div className="text-xl text-emerald-700">{product.rating.count}</div>
        </div>

        <div className="mb-1 flex items-end justify-between gap-3">
          <div className="text-2xl font-bold text-neutral-900">₹{(product.priceCents / 100).toFixed(2)}</div>

          <select className="h-8 rounded border border-neutral-400 bg-white px-3" value={quantity} onChange={selectQuantity}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <button className="w-full rounded-full bg-[#7b4738] px-3 py-2 text-lg font-semibold text-white shadow hover:bg-[#6b3e31]" onClick={addToCart}>
          {addedMessageVisible ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
