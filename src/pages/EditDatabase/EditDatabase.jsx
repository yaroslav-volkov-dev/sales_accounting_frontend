import { useState } from 'react';
import { Paper } from '../../components/Paper/Paper.jsx';

export const EditDatabase = () => {
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');

  return (
    <div className="flex flex-col items-center">
      <h1>Edit database</h1>
      <Paper className="w-[700px] flex justify-center">
        <form className="w-full flex flex-col">
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
      </Paper>
    </div>
  );
};