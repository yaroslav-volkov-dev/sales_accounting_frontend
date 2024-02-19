import { useEffect, useState } from 'react';
import { getProducts } from '../../api/api.js';
import { ProductCard } from '../../components/ProductCard/ProductCard.jsx';
import { ModalWindow } from '../../components/ModalWindow/ModalWindow.jsx';

export const MainPage = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const toggleProduct = (product) => {
    const isProductsExists = selectedProducts.find(({ _id }) => _id === product._id);
    if (isProductsExists) {
      setSelectedProducts((prevState) => prevState.filter(({ _id }) => _id !== product._id));
    } else {
      setSelectedProducts((prevState) => [...prevState, product]);
    }
  };
  
  useEffect(() => {
    getProducts({
      onSuccess: (response) => {
        setProducts(response.data);
      }
    });
  }, []);


  return (
    <div className="grid grid-cols-10 gap-3">
      <button onClick={() => setIsModalOpen(true)}>OPEN MODAL</button>
      {products.map((product) => (
        <ProductCard
          toggleProduct={() => toggleProduct(product)}
          key={product._id}
          name={product.name}
          img={product.img}
          isSelected={selectedProducts.find(({ _id }) => _id === product._id)}
        />
      ))}
      <ModalWindow isOpen={isModalOpen}>
        <div className="w-[1000px] min-h-[300px] flex flex-col items-center">
          <div className="flex w-full justify-between">
            <h4>Products</h4>
            <button onClick={() => setIsModalOpen(false)} className="text-[30px]">X</button>
          </div>
          <div className="grid grid-cols-5">
            {selectedProducts.map((product) => (
              <ProductCard
                toggleProduct={() => toggleProduct(product)}
                key={product._id}
                name={product.name}
                img={product.img}
                isSelected={selectedProducts.find(({ _id }) => _id === product._id)}
              />
            ))}
          </div>
        </div>
      </ModalWindow>
    </div>
  );
};