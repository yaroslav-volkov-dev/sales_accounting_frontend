import { axiosInstance } from '@/api/global-config'
import { productQueryKey } from '@/api/queries/products'
import { SelectInput } from '@/components/select-input/select-input.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { ENDPOINTS } from '@/constants/endpoints.ts'
import { notify } from '@/lib/notify.ts'
import { CategoryModel } from '@/models'
import { EditProductDto, ProductsModel } from '@/models/products.model.ts'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

type EditProductDialogProps = {
  product: ProductsModel
}

export const EditProductDialog = ({ product }: EditProductDialogProps) => {
  const [open, setOpen] = useState(false)

  const { register, handleSubmit, reset, control } = useForm<EditProductDto>({
    defaultValues: {
      name: product.name,
      price: product.price,
      categoryId: product?.Category?.id,
    },
  })

  const client = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: string | number; body: EditProductDto }) =>
      axiosInstance.put(`${ENDPOINTS.PRODUCTS}/${id}`, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [productQueryKey.all] })
      setOpen(false)
      reset()
      notify({ message: 'Product successfully edited!' })
    },
    onError: () => {
      notify({
        type: 'error',
        message: 'Something went wrong. Cannot edit product.',
      })
    },
  })

  const { data: categoriesData } = useQuery<CategoryModel[]>({
    queryKey: [ENDPOINTS.CATEGORIES],
    queryFn: async () =>
      axiosInstance.get(ENDPOINTS.CATEGORIES),
  })

  const categoriesOptions =
    categoriesData?.map(({ name, id }) => ({ value: `${id}`, label: name })) ||
    []

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit((body) => mutate({ id: product.id, body }))}
        >
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>{product.name} editing.</DialogDescription>
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
                    defaultValue={field?.value?.toString()}
                    placeholder="Select category"
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
              <Button variant="secondary" onClick={() => reset()}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
