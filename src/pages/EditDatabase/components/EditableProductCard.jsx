import { Button } from '../../../components/Button/Button.jsx';
import { useMutation } from 'react-query';
import { axiosInstance } from '../../../api/axiosConfig.js';
import { useState } from 'react';
import { Input } from '../../../components/Input/Input.jsx';
import { ENDPOINTS } from '../../../constants/endpoints.js';
import { useForm } from 'react-hook-form';

export const EditableProductRow = ({ productData, openDeleteModalWindow }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const { register, getValues, reset } = useForm({
    defaultValues: {
      ...productData
    }
  });

  const { mutate: editProductMutation } = useMutation({
    mutationFn: (updatedProduct) => axiosInstance.put(ENDPOINTS.PRODUCTS, updatedProduct)
  });

  const enableEditMode = () => setIsEditMode(true);

  const saveUpdateProduct = () => {
    const editableData = getValues();

    if (!editableData._id) return;

    editProductMutation(editableData);
    setIsEditMode(false);
  };

  const cancelEditing = () => {
    reset(undefined, { keepDefaultValues: true });
    setIsEditMode(false);
  };


  return (
    <li className="flex justify-between items-center gap-3 p-2 border border-white rounded overflow-hidden">
      {isEditMode ? <Input  {...register('name', { required: true })} /> : <p>{productData.name}</p>}
      <div className="flex gap-2">
        {isEditMode && (<Button color="error" onClick={cancelEditing}>Cancel Editing</Button>)}
        <Button onClick={isEditMode ? saveUpdateProduct : enableEditMode}>{isEditMode ? 'Save' : 'Edit'}</Button>
        <Button onClick={openDeleteModalWindow} className="bg-red-600">X</Button>
      </div>
    </li>
  );
};