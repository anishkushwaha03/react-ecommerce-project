import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header.jsx';
import { ProductsGrid } from './ProductsGrid.jsx';
import { useSearchParams } from 'react-router';

export function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const getHomeData = async () => {
      setLoading(true);

      try {
        const url = searchQuery
          ? `/api/products?search=${encodeURIComponent(searchQuery)}`
          : '/api/products';

        const response = await axios.get(url);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
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

        {loading ? (
          <div className="mt-10 flex items-center justify-center pb-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#14B8A6] border-t-transparent"></div>
          </div>
        ) : products.length > 0 ? (
          <ProductsGrid products={products} loadCart={loadCart} />
        ) : (
          <p className="mt-10 pb-12 text-center text-lg text-[#9CA3AF]">No products found matching "{searchQuery}"</p>
        )}
      </main>
    </>
  );
}
