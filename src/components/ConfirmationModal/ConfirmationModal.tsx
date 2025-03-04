import { ModalWindow } from '../ModalWindow/ModalWindow.tsx';
import { Paper } from '../Paper/Paper.tsx';
import { Button } from '../Button/Button.tsx';

type ConfirmationModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  isLoading?: boolean
}

export const ConfirmationModal = (
  {
    isOpen,
    onConfirm,
    onCancel,
    message,
    isLoading = false
  }: ConfirmationModalProps) => (
  <ModalWindow isOpen={isOpen}>
    <Paper className="w-[400px] flex flex-col gap-3 items-center">
      <h6>{message}</h6>
      {isLoading ? <div className="font-bold">Loading...</div> : (
        <div className="flex gap-3">
          <Button onClick={onConfirm}>Yep</Button>
          <Button onClick={onCancel} color="error">Nope</Button>
        </div>
      )}
    </Paper>
  </ModalWindow>
);