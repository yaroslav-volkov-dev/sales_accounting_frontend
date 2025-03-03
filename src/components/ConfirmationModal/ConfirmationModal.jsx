import { ModalWindow } from '../ModalWindow/ModalWindow.jsx';
import { Paper } from '../Paper/Paper.jsx';
import { Button } from '../Button/Button.jsx';

export const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message, isLoading = false }) => (
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