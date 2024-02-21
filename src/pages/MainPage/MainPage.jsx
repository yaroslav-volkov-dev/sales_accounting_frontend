import { useEffect } from 'react';
import { ProductCard } from '../../components/ProductCard/ProductCard.jsx';
import { useProductsStore } from '../../store/useProductsStore.js';

export const MainPage = () => {
  const products = useProductsStore(state => state.products);
  const selectedProducts = useProductsStore(state => state.selectedProducts);
  const fetchProducts = useProductsStore(state => state.fetchProducts);
  const toggleProduct = useProductsStore(state => state.toggleProduct);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="grid 2xl:grid-cols-10 xl:grid-cols-8 lg:grid-cols-5 sm:grid-cols-3 gap-3">
      {products.map((product) => (
        <ProductCard
          toggleProduct={() => toggleProduct(product)}
          key={product._id}
          name={product.name}
          img={product.img}
          isSelected={selectedProducts.find(({ _id }) => _id === product._id)}
        />
      ))}
    </div>
  );
};