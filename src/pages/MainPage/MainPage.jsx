import { useProductsStore } from '../../store/useProductsStore.js';
import { ProductCard } from '../../components/ProductCard/ProductCard.jsx';
import { useProductsQuery } from '../../hooks/useProductsQuery.js';


export const MainPage = () => {
  const { products } = useProductsQuery('/products');

  const selectedProducts = useProductsStore(state => state.selectedProducts);
  const toggleProduct = useProductsStore(state => state.toggleProduct);

  return (
    <div className="grid 2xl:grid-cols-10 xl:grid-cols-8 lg:grid-cols-5 sm:grid-cols-3 gap-3">
      {products?.map((product) => (
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