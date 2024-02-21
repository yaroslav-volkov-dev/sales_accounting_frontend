import { useState } from 'react';

export const EditDatabasePage = () => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');

  return (
    <div className="w-full flex justify-center">
      <form className="w-[700px] bg-gray-500 flex flex-col p-5 rounded">
        <label className="w-full">
          <p>Product Name</p>
          <input
            value={productName} onChange={(event) => setProductName(event.target.value)}
            className="border rounded w-full"
          />
        </label>
        <label className="mt-4">
          <p>Product category</p>
          <input
            value={productCategory} onChange={(event) => setProductCategory(event.target.value)}
            className="border rounded w-full"
          />
        </label>
      </form>
    </div>
  );
};