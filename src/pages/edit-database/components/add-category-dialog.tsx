import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input.tsx";
import { CreateCategoryDto } from "@/models/category.model.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { useAddCategoryMutation } from "@/api/queries/categories.ts";

export const AddCategoryDialog = () => {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<CreateCategoryDto>();

  const { mutate, isPending } = useAddCategoryMutation({
    onSuccess: () => {
      setOpen(false);
      reset();
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Add new category to the database.</DialogDescription>
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