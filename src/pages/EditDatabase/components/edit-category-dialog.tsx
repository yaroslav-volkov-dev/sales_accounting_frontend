import { useState } from "react";
import { useForm } from "react-hook-form";
import { CategoryModel, EditCategoryDto } from "@/models/category.model.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axiosConfig.ts";
import { ENDPOINTS } from "@/constants/endpoints.ts";
import { categoriesQueryKey } from "@/pages/EditDatabase/queries.ts";
import { notify } from "@/utils/notify.ts";
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

export type EditCategoryDialogProps = {
  category: CategoryModel;
}

export const EditCategoryDialog = ({ category }: EditCategoryDialogProps) => {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<EditCategoryDto>({
    defaultValues: {
      name: category.name
    }
  });

  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ id, body }: {
      id: string | number;
      body: EditCategoryDto
    }) => axiosInstance.put(`${ENDPOINTS.CATEGORIES}/${id}`, body),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [categoriesQueryKey.all] });
      setOpen(false);
      reset();
      notify({ message: 'Category successfully added!' });
    },
    onError: () => {
      notify({ type: 'error', message: 'Something went wrong. Cannot add category.' });
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit((body) => mutate({ id: category.id, body }))}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>{category.name} editing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input placeholder="Name" {...register('name', { required: true })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => reset()}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};