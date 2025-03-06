import { Button } from "@/components/ui/button.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import { ReactElement } from "react";

type ConfirmationModalProps = {
  onConfirm: () => void;
  message: string;
  onCancel?: () => void;
  trigger?: ReactElement
}

export const ConfirmationModal = (
  {
    onConfirm,
    onCancel,
    message,
    trigger
  }: ConfirmationModalProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      {trigger || <Button variant="outline">Show Dialog</Button>}
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          {message}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Nope</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);