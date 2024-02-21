import { useProductsStore } from '../../store/useProductsStore.js';

export const BasketButton = ({ openBasket }) => {
  const selectedProducts = useProductsStore(state => state.selectedProducts);

  return (
    <button onClick={openBasket}>{`OPEN MODAL ${selectedProducts.length}`}</button>
  );
};