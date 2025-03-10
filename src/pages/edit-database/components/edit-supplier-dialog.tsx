import { EditSupplierDto, SupplierModel } from "@/models";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useEditSupplierMutation } from "@/api/queries";

type EditSupplierDialogProps = {
  supplier: SupplierModel;
}

export const EditSupplierDialog = ({ supplier }: EditSupplierDialogProps) => {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<EditSupplierDto>({
    defaultValues: { ...supplier }
  });

  const { mutate, isPending } = useEditSupplierMutation({
    onSuccess: () => {
      setOpen(false);
      reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit((body) => mutate({ id: supplier.id, body }))}>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>{supplier.name} editing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input placeholder="Name" {...register('name', { required: true })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Name
              </Label>
              <Input
                placeholder="Phone number"
                {...register('phoneNumber')}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              isLoading={isPending}
            >
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
  );
};