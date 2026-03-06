import { useEffect, useMemo, useRef, useState } from 'react';
import { Product } from './Product';

const INITIAL_BATCH_SIZE = 4;
const LOAD_MORE_BATCH_SIZE = 8;

export function ProductsGrid({ products, loadCart }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [products]);

  useEffect(() => {
    const sentinelElement = sentinelRef.current;

    if (!sentinelElement || visibleCount >= products.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + LOAD_MORE_BATCH_SIZE, products.length));
        }
      },
      {
        rootMargin: '300px 0px'
      }
    );

    observer.observe(sentinelElement);

    return () => observer.disconnect();
  }, [products.length, visibleCount]);

  const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);

  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 px-6 pb-10 sm:grid-cols-2 md:px-10 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product, index) => (
          <Product
            key={product.id}
            product={product}
            loadCart={loadCart}
            imageLoading={index < 4 ? 'eager' : 'lazy'}
            animationDelayMs={index * 70}
          />
        ))}
      </div>

      {visibleCount < products.length && <div ref={sentinelRef} className="h-8" aria-hidden="true" />}
    </>
  );
}
