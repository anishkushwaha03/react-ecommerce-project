import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header.jsx';
import { ProductsGrid } from './ProductsGrid.jsx';
//import './HomePage.css';
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
        console.error("Failed to fetch products:", error);
      }
    };

    getHomeData();
  }, [searchQuery]);

  return (
    <>
      <Header cart={cart} />
      <main className="pt-16">
        {products.length === 0 ? (
          <p className="mt-10 text-center text-lg">No products found matching "{searchQuery}"</p>
        ) : (
          <ProductsGrid products={products} loadCart={loadCart} />
        )}
      </main>
    </>
  );
}