import { Paper } from '@/components/Paper/Paper.js';
import { Button } from '@/components/Button/Button.js';
import { ModalWindow } from '@/components/ModalWindow/ModalWindow.js';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosConfig.js';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { categoriesQueryKey } from '../queries.ts';
import { Input } from "@/components/ui/input.tsx";

type AddCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCategoryModal = ({ isOpen, onClose }: AddCategoryModalProps) => {
  const { register, handleSubmit, reset } = useForm();
  const client = useQueryClient();

  const { mutate: addProductMutation } = useMutation({
    mutationFn: (newCategory) => axiosInstance.post(ENDPOINTS.CATEGORIES, newCategory),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [categoriesQueryKey.all] });
      onClose();
      reset();
    }
  });

  return (
    <ModalWindow isOpen={isOpen}>
      <Paper className="w-[600px]">
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit(addProductMutation)}
        >
          <h2>Add Category</h2>
          <Input
            placeholder="Name"
            {...register('name', { required: true })}
          />
          <div className="flex justify-center gap-4">
            <Button type="submit">Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Paper>
    </ModalWindow>
  );
};