import {
  useActiveShiftQuery,
  useCloseShiftMutation,
  useStartShiftMutation,
} from '@/api/queries'
import { useStoresQuery } from '@/api/queries/stores.ts'
import { ConfirmationDialog } from '@/components/confirmation-modal/confirmation-dialog.tsx'
import { Loader } from '@/components/loader/loader.tsx'
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
import { useUserQuery } from '@/hooks/use-auth.ts'
import { DialogClose } from '@radix-ui/react-dialog'
import dayjs from 'dayjs'
import { ReactElement, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AlertMessage } from '../alert-message/alert-message'

const ShiftControllerWrapper = ({ children }: { children: ReactElement }) => (
  <div className="h-[1px] min-h-[210px] overflow-hidden py-4">{children}</div>
)

const ShiftControllerContent = () => {
  const [openStartShiftDialog, setOpenStartShiftDialog] = useState(false)
  const [openCloseShiftDialog, setCloseStartShiftDialog] = useState(false)

  const { data: userData } = useUserQuery()

  const userId = userData?.user?.id || ''

  const { control, handleSubmit } = useForm<{ storeId: string }>()

  const {
    data: activeShiftData,
    isSuccess: isActiveShiftDataSuccess,
    isPending: isActiveShiftDataPending,
    isError: isActiveShiftDataError,
  } = useActiveShiftQuery()


  const { data: storesData } = useStoresQuery()

  const { mutate: startShift, isPending: isStartShiftPending } =
    useStartShiftMutation({
      onSuccess: () => setOpenStartShiftDialog(false),
    })
  const { mutate: closeShift, isPending: isCloseShiftPending } =
    useCloseShiftMutation({
      onSuccess: () => setCloseStartShiftDialog(false),
    })

  const storesOptions =
    storesData?.map(({ id, name }) => ({ value: `${id}`, label: name })) || []

  if (isActiveShiftDataPending) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader size={50} />
      </div>
    )
  }

  if (isActiveShiftDataError) {
    return <AlertMessage message="Something went wrong. Cant load shift data." />
  }

  if (isActiveShiftDataSuccess && !activeShiftData) {
    return (
      <div className="h-full flex flex-col justify-center items-center gap-3">
        <span className="text-lg font-semibold">
          The shift is not started yet
        </span>
        <Dialog
          open={openStartShiftDialog}
          onOpenChange={setOpenStartShiftDialog}
        >
          <DialogTrigger asChild>
            <Button>Start shift</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form
              onSubmit={handleSubmit(({ storeId }) =>
                startShift({ userId, storeId })
              )}
            >
              <DialogHeader>
                <DialogTitle>Select Store</DialogTitle>
                <DialogDescription>
                  Where do you want to start the shift?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Controller
                  control={control}
                  name="storeId"
                  render={({ field }) => (
                    <SelectInput
                      options={storesOptions}
                      onSelect={field.onChange}
                      triggerClassname="col-span-3"
                      placeholder="Select store"
                    />
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" isLoading={isStartShiftPending}>
                  Start
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
      </div>
    )
  }

  if (activeShiftData) {
    return (
      <div className="h-full flex flex-col">
        <h6 className="font-bold">Current shift:</h6>
        <ul className="flex flex-col gap-1 mt-3">
          <li className="flex justify-between">
            Shift started at:{' '}
            <span>
              {dayjs(activeShiftData?.startedAt).format('DD/MM/YYYY')}
            </span>
          </li>
          <li className="flex justify-between">
            Store: <span>{activeShiftData.Store.name}</span>
          </li>
          <li className="flex justify-between">
            Location: <span>{activeShiftData.Store.location}</span>
          </li>
        </ul>
        <ConfirmationDialog
          onConfirm={() => closeShift({ userId })}
          message="Do you want to close shift?"
          isLoading={isCloseShiftPending}
          trigger={<Button className="mt-5">Close shift</Button>}
          open={openCloseShiftDialog}
          setOpen={setCloseStartShiftDialog}
        />
      </div>
    )
  }

  return null
}

export const ShiftController = () => (
  <ShiftControllerWrapper>
    <ShiftControllerContent />
  </ShiftControllerWrapper>
)
