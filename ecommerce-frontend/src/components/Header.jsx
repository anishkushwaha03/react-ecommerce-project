import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
//import './header.css';

export function Header({ cart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const totalQuantity = cart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/'); // Go back to all products if search is empty
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Force redirect to login
  };

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-emerald-900 px-4 text-white shadow-md">
      <div className="w-auto md:w-52">
        <Link to="/" className="inline-block rounded border border-transparent p-2 hover:border-white">
          <img className="hidden h-7 sm:block" src="images/logo-white.png" alt="Amazon" />
          <img className="h-8 sm:hidden" src="images/mobile-logo-white.png" alt="Amazon" />
        </Link>
      </div>

      <div className="mx-2 flex max-w-2xl flex-1">
        <input
          className="h-10 w-full rounded-l-md border-none px-3 text-black outline-none bg-olive-100"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} />

        <button className="h-10 rounded-r-md bg-emerald-600 px-4 hover:bg-emerald-700" onClick={handleSearch}>
          <img className="h-5 w-5" src="images/icons/search-icon.png" alt="Search" />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link className="hidden rounded border border-transparent p-2 hover:border-white sm:block" to="/orders">
          <span>Orders</span>
        </Link>

        <Link className="relative rounded border border-transparent p-2 hover:border-white" to="/checkout">
          <img className="h-7" src="images/icons/cart-icon.png" alt="Cart" />
          <span className="absolute -right-1 -top-2 rounded-full bg-yellow-300 px-1.5 text-xs font-bold text-black">{totalQuantity}</span>
        </Link>

        {token ? (
          <button onClick={handleLogout} className="rounded bg-white px-3 py-1 text-sm font-medium text-emerald-900 hover:bg-emerald-100">
            Logout
          </button>
        ) : (
          <Link to="/login" className="rounded bg-white px-3 py-1 text-sm font-medium text-emerald-900 hover:bg-emerald-100">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}