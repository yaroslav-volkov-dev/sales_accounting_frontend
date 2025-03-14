import { Button } from '@/components/ui/button.tsx'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { ReactElement } from 'react'

type ConfirmationDialogProps = {
  message: string
  onConfirm: () => void
  trigger?: ReactElement
  isLoading?: boolean
  open?: boolean
  setOpen?: (open: boolean) => void
}

export const ConfirmationDialog = ({
  onConfirm,
  message,
  trigger,
  isLoading,
  open,
  setOpen,
}: ConfirmationDialogProps) => (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogTrigger asChild>
      {trigger || <Button variant="outline">Show Dialog</Button>}
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>{message}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Nope</AlertDialogCancel>
        <Button onClick={onConfirm} isLoading={isLoading}>
          Yep
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
