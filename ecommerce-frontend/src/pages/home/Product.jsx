import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

export function Product({ product, loadCart }) {
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
        quantity: quantity
      });
      await loadCart();

      setAddedMessageVisible(true);

      setTimeout(() => {
        setAddedMessageVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Could not add item to cart.");
    }
  };

  const selectQuantity = (event) => {
    const quantitySelected = Number(event.target.value);
    setQuantity(quantitySelected);
  };

  return (
    <div className="flex flex-col border-b border-r border-gray-100 p-6">
      <div className="mb-5 flex h-44 items-center justify-center">
        <img className="max-h-full max-w-full rounded" src={product.image} alt={product.name} />
      </div>

      <div className="mb-1 line-clamp-2 min-h-10">{product.name}</div>

      <div className="mb-2 flex items-center">
        <img className="mr-1.5 w-24" src={`images/ratings/rating-${product.rating.stars * 10}.png`} alt="rating" />
        <div className="text-emerald-700">{product.rating.count}</div>
      </div>

      <div className="mb-2 font-bold">₹{(product.priceCents / 100).toFixed(2)}</div>

      <div className="mb-4">
        <select className="rounded border border-gray-300 px-2 py-1" value={quantity} onChange={selectQuantity}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>

      <div className="flex-1" />

      <div className={`mb-2 flex items-center text-emerald-700 transition-opacity ${addedMessageVisible ? 'opacity-100' : 'opacity-0'}`}>
        <img className="mr-1.5 h-5" src="images/icons/checkmark.png" alt="added" />
        Added
      </div>

      <button className="rounded bg-emerald-700 px-3 py-2 text-white shadow hover:bg-emerald-600" onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  );
}