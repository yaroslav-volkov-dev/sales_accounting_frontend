import { useAuth } from '@/hooks/use-auth.ts';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button.js';
import { cn } from "@/lib/utils.ts";
import { Container } from "@/components/container/container";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axiosConfig.ts";
import { ENDPOINTS } from "@/constants/endpoints.ts";
import { getQueryStringParams } from "@/utils/get-query-string-params.ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SelectInput } from "@/components/select-input/select-input.tsx";

const authorizedLinks = [
  {
    label: 'Edit database',
    to: '/edit-database/products',
  }
];

const unauthorizedLinks = [
  {
    label: 'Registration',
    to: '/registration',
  },
  {
    label: 'Login',
    to: '/login',
  },
];


const renderLinks = (links: { label: string; to: string }[]) => links.map(({ to, label }) => (
  <NavLink
    to={to}
    key={to}
    className={({ isActive }) => isActive ? 'text-button-primary' : undefined}
  >
    {label}
  </NavLink>
));

export const Header = () => {
  const [open, setOpen] = useState(false);

  const { control, handleSubmit } = useForm<{ storeId: string }>();
  const { logout, isAuth, userData } = useAuth();

  const userId = userData?.user?.id;
  const client = useQueryClient();

  const { data } = useQuery({
    queryKey: ['all', userId],
    queryFn: async () => axiosInstance.get(getQueryStringParams(ENDPOINTS.SHIFTS, { userId })),
    enabled: !!userId
  });

  const { mutate: startShift, isPending: isStartShiftPending } = useMutation({
    mutationFn: async () => axiosInstance.post(ENDPOINTS.SHIFTS, { userId, storeId: 2 }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['all', userId] });
    }
  });

  console.log(data);

  return (
    <header className="w-full h-16 bg-blue-200">
      <Container>
        <div className="h-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Start shift</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit(() => startShift())}>
                  <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                    <DialogDescription>Add new category to the database.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Controller
                      control={control}
                      name="storeId"
                      render={({ field }) => (
                        <SelectInput
                          options={[]}
                          onSelect={field.onChange}
                          triggerClassname="col-span-3"
                          defaultValue={'2'}
                          placeholder="Select category"
                        />
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      isLoading={isStartShiftPending}
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
            <NavLink
              to="/"
              className={({ isActive }) => cn(isActive && 'text-blue-500')}
            >
              <h2 className="font-[600] text-center text-[24px] flex flex-col">
                Sales accounting
              </h2>
            </NavLink>
          </div>
          <div
            className="flex items-center gap-3">{isAuth ? (
            <>
              {renderLinks(authorizedLinks)}
              <Button onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : renderLinks(unauthorizedLinks)}
          </div>
        </div>
      </Container>
    </header>
  );
};