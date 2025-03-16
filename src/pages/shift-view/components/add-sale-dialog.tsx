import { useActiveShiftQuery, useProductsQuery } from '@/api/queries'
import { useCreateSaleMutation } from '@/api/queries/sales'
import { SelectInput } from '@/components/select-input/select-input'
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
import { PaymentMethod } from '@/models/sale.model'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const addSaleSchema = z.object({
  productId: z.string().min(1, 'Product ID is required').transform(Number),
  quantity: z.string()
    .min(1, 'Quantity is required')
    .transform(Number)
    .refine((val) => val > 0, 'Quantity must be greater than 0'),
  sellingPrice: z.string()
    .min(1, 'Price is required')
    .transform(Number)
    .refine((val) => val >= 0, 'Price must be greater than or equal to 0'),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: 'Please select a valid payment type' }),
  }),
})

type AddSaleFormData = z.infer<typeof addSaleSchema>

export const AddSaleDialog = () => {
  const [open, setOpen] = useState(false)
  const { data: activeShift } = useActiveShiftQuery()
  const { data: products } = useProductsQuery()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddSaleFormData>({
    resolver: zodResolver(addSaleSchema),
    defaultValues: {
      paymentMethod: PaymentMethod.CASH,
    },
  })

  const { mutate, isPending } = useCreateSaleMutation({
    onSuccess: () => {
      setOpen(false)
      reset()
    },
  })

  const onSubmit = (data: AddSaleFormData) => {
    if (!activeShift?.id) return

    const sale = {
      productId: data.productId,
      quantity: data.quantity,
      sellingPrice: data.sellingPrice,
      paymentMethod: data.paymentMethod,
      userId: activeShift.userId,
      storeId: activeShift.storeId,
      shiftId: activeShift.id,
    }

    mutate({ sale })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Sale</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Sale</DialogTitle>
            <DialogDescription>
              Add new sale to the current shift.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right">
                Product ID
              </Label>
              <div className="col-span-3">
                <Controller
                  control={control}
                  name="productId"
                  render={({ field }) => (
                    <SelectInput
                      options={products?.map((product) => ({
                        value: product.id.toString(),
                        label: product.name,
                      })) || []}
                      onSelect={field.onChange}
                    />
                  )}
                />
                {errors.productId && (
                  <p className="text-sm text-red-500 mt-1">{errors.productId.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="Quantity"
                  {...register('quantity')}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sellingPrice" className="text-right">
                Price
              </Label>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="Selling Price"
                  {...register('sellingPrice')}
                />
                {errors.sellingPrice && (
                  <p className="text-sm text-red-500 mt-1">{errors.sellingPrice.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentType" className="text-right">
                Payment Type
              </Label>
              <div className="col-span-3">
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <SelectInput
                      options={[
                        { value: PaymentMethod.CASH, label: 'Cash' },
                        { value: PaymentMethod.CARD, label: 'Card' },
                      ]}
                      onSelect={field.onChange}
                    />
                  )}
                />
                {errors.paymentMethod && (
                  <p className="text-sm text-red-500 mt-1">{errors.paymentMethod.message}</p>
                )}
              </div>
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
  )
}
