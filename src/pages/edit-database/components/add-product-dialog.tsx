import { axiosInstance } from '@/api/global-config.ts'
import { SelectInput } from '@/components/select-input/select-input.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ENDPOINTS } from '@/constants/endpoints.js'
import { CategoryModel } from '@/models/category.model.ts'
import { CreateProductDto } from '@/models/products.model.ts'
import { SupplierModel } from '@/models/supplier.model.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { productsQueryKey, suppliersQueryKey } from '../queries.ts'

export const AddProductDialog = () => {
  const [open, setOpen] = useState(false)

  const { register, handleSubmit, reset, control } = useForm<CreateProductDto>()
  const client = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (newProduct: CreateProductDto) =>
      axiosInstance.post(ENDPOINTS.PRODUCTS, newProduct),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [productsQueryKey.all] })
      setOpen(false)
      reset()
    },
  })

  const { data: categoriesData } = useQuery({
    queryKey: [ENDPOINTS.CATEGORIES],
    queryFn: async () =>
      axiosInstance.get<CategoryModel[]>(ENDPOINTS.CATEGORIES),
    select: (response) => response.data,
  })

  const { data: suppliersData } = useQuery({
    queryKey: [suppliersQueryKey.all],
    queryFn: async () =>
      axiosInstance.get<SupplierModel[]>(ENDPOINTS.SUPPLIERS),
    select: (response) => response.data,
  })

  const categoriesOptions =
    categoriesData?.map(({ name, id }) => ({ value: `${id}`, label: name })) ||
    []
  const suppliersOptions =
    suppliersData?.map(({ name, id }) => ({ value: `${id}`, label: name })) ||
    []

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add product</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Add new product to the database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  placeholder="Name"
                  {...register('name', { required: true })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  type="number"
                  placeholder="Price"
                  {...register('price', { required: true })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoryId" className="text-right">
                  Category
                </Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <SelectInput
                      options={categoriesOptions}
                      onSelect={field.onChange}
                      triggerClassname="col-span-3"
                      placeholder="Select category"
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplierId" className="text-right">
                  Supplier
                </Label>
                <Controller
                  control={control}
                  name="supplierId"
                  render={({ field }) => (
                    <SelectInput
                      options={suppliersOptions}
                      onSelect={field.onChange}
                      triggerClassname="col-span-3"
                      placeholder="Select supplier"
                    />
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" isLoading={isPending}>
                Save
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
