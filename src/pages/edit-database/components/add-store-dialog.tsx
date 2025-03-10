import {
  Dialog,
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
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axiosConfig.ts";
import { ENDPOINTS } from "@/constants/endpoints.ts";
import { storesQueryKey } from "@/pages/edit-database/queries.ts";
import { notify } from "@/utils/notify.ts";
import { CreateStoreDto } from "@/models/store.model.ts";

export const AddStoreDialog = () => {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<CreateStoreDto>();
  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (newStore: CreateStoreDto) => axiosInstance.post(ENDPOINTS.STORES, newStore),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [storesQueryKey.all] });
      setOpen(false);
      reset();
      notify({ message: 'Store successfully added!' });
    },
    onError: () => {
      notify({ message: 'Something went wrong. Cannot add store.' });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add store</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <DialogHeader>
            <DialogTitle>Add Store</DialogTitle>
            <DialogDescription>Add new store to the database.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input placeholder="Name" {...register('name', { required: true })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                placeholder="Location" {...register('location')}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone
              </Label>
              <Input
                placeholder="Phone number" {...register('phoneNumber')}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              isLoading={isPending}>
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