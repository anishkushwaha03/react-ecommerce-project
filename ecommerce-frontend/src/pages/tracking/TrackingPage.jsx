import { Header } from '../../components/Header.jsx';
import { Link } from 'react-router';
//import './TrackingPage.css';

export function TrackingPage({ cart }) {
  return (
    <>
      <Header cart={cart} />
      <main className="mx-auto mt-24 max-w-4xl px-6 pb-24">
        <div>
          <Link className="inline-block pb-7 text-[#14B8A6] hover:text-[#2dd4bf]" to="/orders">
            View all orders
          </Link>

          <div className="mb-2 text-3xl font-bold text-[#F9FAFB]">Arriving on Monday, June 13</div>
          <div className="mb-1 text-[#9CA3AF]">Black and Gray Athletic Cotton Socks - 6 Pairs</div>
          <div className="mb-1 text-[#9CA3AF]">Quantity: 1</div>

          <img className="my-8 max-h-37.5 max-w-37.5" src="images/products/athletic-cotton-socks-6-pairs.jpg" alt="tracked product" />

          <div className="mb-4 flex flex-col justify-between gap-2 text-lg font-medium sm:flex-row sm:text-xl">
            <div>Preparing</div>
            <div className="text-[#14B8A6]">Shipped</div>
            <div>Delivered</div>
          </div>

          <div className="h-6 w-full overflow-hidden rounded-full border border-[#374151] bg-[#111827]">
            <div className="h-full w-1/2 rounded-full bg-[#14B8A6]" />
          </div>
        </div>
      </main>
    </>
  );
}
