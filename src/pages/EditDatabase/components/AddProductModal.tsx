import { ModalWindow } from '@/components/ModalWindow/ModalWindow.js';
import { Paper } from '@/components/Paper/Paper.js';
import { Controller, useForm } from 'react-hook-form';
import { SelectInput } from '@/components/SelectInput/SelectInput.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosConfig.js';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { productsQueryKey, suppliersQueryKey } from '../queries.ts';
import { Input } from "@/components/ui/input.tsx";
import { CategoryModel } from "@/models/category.model.ts";
import { SupplierModel } from "@/models/supplier.model.ts";

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const { register, handleSubmit, reset: resetCreatingForm, control } = useForm();
  const client = useQueryClient();

  const { mutate: addProductMutation } = useMutation({
    mutationFn: (newProduct) => axiosInstance.post(ENDPOINTS.PRODUCTS, newProduct),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [productsQueryKey.all] });
      onClose();
      resetCreatingForm();
    },
  });

  const { data: categoriesData } = useQuery<CategoryModel[]>({
    queryKey: [ENDPOINTS.CATEGORIES],
    queryFn: async () => axiosInstance.get(ENDPOINTS.CATEGORIES)
  });

  const { data: suppliersData } = useQuery<SupplierModel[]>({
    queryKey: [suppliersQueryKey.all],
    queryFn: async () => axiosInstance.get(ENDPOINTS.SUPPLIERS),
  });

  const categoriesOptions = categoriesData?.map(({ name, id }) => ({ value: id, label: name })) || [];
  const suppliersOptions = suppliersData?.map(({ name, id }) => ({ value: id, label: name })) || [];

  return (
    <ModalWindow isOpen={isOpen}>
      <Paper className="w-[600px]">
        <form
          className="w-full flex flex-col gap-3"
          onSubmit={handleSubmit(addProductMutation)}
        >
          <h2>Add product</h2>
          <Input
            placeholder="Name"
            {...register('name', { required: true })}
          />
          <Input
            type="number"
            placeholder="Price"
            {...register('price', { required: true })}
          />
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SelectInput
                options={categoriesOptions}
                onChange={({ value }) => field.onChange(value)}
              />
            )}
          />
          <Controller
            control={control}
            name="supplierId"
            render={({ field }) => (
              <SelectInput
                options={suppliersOptions}
                onChange={({ value }) => field.onChange(value)}
              />
            )}
          />
          <div className="flex justify-center gap-4">
            <Button type="submit">Add product</Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Paper>
    </ModalWindow>
  );
};