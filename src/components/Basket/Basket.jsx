import { ModalWindow } from '../ModalWindow/ModalWindow.jsx';
import { useProductsStore } from '../../store/useProductsStore.js';
import { ProductCard } from '../ProductCard/ProductCard.jsx';
import { useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside.js';

export const Basket = ({ isModalOpen, closeModal }) => {
  const selectedProducts = useProductsStore(state => state.selectedProducts);
  const toggleProduct = useProductsStore(state => state.toggleProduct);
  const ref = useRef(null);

  useClickOutside(ref, closeModal);

  return (
    <ModalWindow isOpen={isModalOpen}>
      <div className="w-[1000px] min-h-[300px] flex flex-col items-center bg-white px-10 py-5 rounded-md" ref={ref}>
        <div className="flex w-full justify-between">
          <h4>Products</h4>
          <button onClick={closeModal} className="text-[30px]">X</button>
        </div>
        <div className="grid grid-cols-5">
          {selectedProducts.map((product) => (
            <ProductCard
              toggleProduct={() => toggleProduct(product)}
              key={product.id}
              name={product.name}
              img={product.img}
              isSelected={selectedProducts.find(({ id }) => id === product.id)}
            />
          ))}
        </div>
      </div>
    </ModalWindow>
  );
};