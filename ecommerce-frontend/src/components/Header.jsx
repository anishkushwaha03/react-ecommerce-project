import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

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
    navigate('/login'); // Force redirect to login
  };

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between bg-[rgba(15,23,42,0.85)] px-4 text-[#F9FAFB] shadow-lg backdrop-blur">
      <div className="w-auto md:w-52">
        <Link to="/" className="inline-block rounded border border-transparent p-2 transition-colors hover:border-[#F9FAFB]">
          <img className="hidden h-7 sm:block" src="/images/logo-white.png" alt="Nexus Shop logo" />
          <img className="h-8 sm:hidden" src="/images/mobile-logo-white.png" alt="Nexus Shop logo" />
        </Link>
      </div>

      <div className="mx-2 flex max-w-2xl flex-1">
        <input
          className="h-10 w-full rounded-l-md border border-[#374151] border-r-0 bg-[#111827] px-3 text-[#F9FAFB] outline-none placeholder:text-[#9CA3AF] focus:border-[#3B82F6]"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} />

        <button className="h-10 rounded-r-md bg-[#F97316] px-4 transition-all duration-100 hover:bg-[#EA580C] active:scale-95" onClick={handleSearch}>
          <img className="h-5 w-5" src="/images/icons/search-icon.png" alt="Search" />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link className="hidden rounded border border-transparent p-2 transition-colors hover:border-[#F9FAFB] hover:text-white sm:block" to="/orders">
          <span>Orders</span>
        </Link>

        <Link className="relative rounded border border-transparent p-2 transition-colors hover:border-[#F9FAFB] hover:text-white" to="/checkout">
          <img className="h-7" src="/images/icons/cart-icon.png" alt="Cart" />
          <span className="absolute -right-1 -top-2 rounded-full bg-[#14B8A6] px-1.5 text-xs font-bold text-[#020617]">{totalQuantity}</span>
        </Link>

        {token ? (
          <button onClick={handleLogout} className="theme-primary-btn px-3 py-1 text-sm font-medium">
            Logout
          </button>
        ) : (
          <Link to="/login" className="theme-primary-btn px-3 py-1 text-sm font-medium">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
