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
      <main className="bg-[#ececec] pt-16">
        {!searchQuery && (
          <section className="px-6 py-20 text-center md:py-28">
            <h1 className="mb-2 text-5xl font-bold text-black md:text-7xl">Nexus Shop</h1>
            <p className="text-3xl font-semibold text-black md:text-6xl">Everything you need, delivered smarter</p>
          </section>
        )}

        {products.length === 0 ? (
          <p className="mt-10 pb-12 text-center text-lg">No products found matching "{searchQuery}"</p>
        ) : (
          <ProductsGrid products={products} loadCart={loadCart} />
        )}
      </main>
    </>
  );
}
