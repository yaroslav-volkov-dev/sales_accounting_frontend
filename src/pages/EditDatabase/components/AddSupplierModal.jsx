import { Paper } from '@/components/Paper/Paper.js';
import { Input } from '@/components/Input/Input.jsx';
import { Button } from '@/components/Button/Button.js';
import { ModalWindow } from '@/components/ModalWindow/ModalWindow.js';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosConfig.js';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { suppliersQueryKey } from '../queries.ts';

export const AddSupplierModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const client = useQueryClient();

  const { mutate: addProductMutation } = useMutation({
    mutationFn: (newSupplier) => axiosInstance.post(ENDPOINTS.SUPPLIERS, newSupplier),
    onSuccess: () => {
      client.invalidateQueries([suppliersQueryKey.all]);
      onClose();
      reset();
    }
  });

  return (
    <ModalWindow isOpen={isOpen}>
      <Paper className="w-[600px]">
        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit(addProductMutation)}>
          <h2>Add Supplier</h2>
          <Input placeholder="Name" {...register('name', { required: true })} />
          <div className="flex justify-center gap-4">
            <Button type="submit">Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Paper>
    </ModalWindow>
  );
};