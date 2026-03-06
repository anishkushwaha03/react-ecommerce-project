import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header.jsx';
import { ProductsGrid } from './ProductsGrid.jsx';
import { useSearchParams } from 'react-router';

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const url = searchQuery
          ? `/api/products?search=${encodeURIComponent(searchQuery)}`
          : '/api/products';

        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    getHomeData();
  }, [searchQuery]);

  return (
    <>
      <Header cart={cart} />
      <main className="pt-16">
        {!searchQuery && (
          <section className="px-6 py-20 text-center md:py-28">
            <div className="reveal-wrapper py-1">
              <h1 className="animate-reveal-up text-5xl font-bold text-[#F9FAFB] leading-[1.15] md:text-7xl">
                Nexus Shop
              </h1>
            </div>

            <div className="reveal-wrapper py-2">
              <p className="animate-reveal-up-delay text-3xl font-semibold text-[#9CA3AF] leading-[1.15] md:text-6xl">
                Everything you need, delivered smarter
              </p>
            </div>
          </section>
        )}

        {products.length === 0 ? (
          <p className="mt-10 pb-12 text-center text-lg text-[#9CA3AF]">No products found matching "{searchQuery}"</p>
        ) : (
          <ProductsGrid products={products} loadCart={loadCart} />
        )}
      </main>
    </>
  );
}
