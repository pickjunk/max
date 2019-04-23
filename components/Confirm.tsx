import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';

export default function Confirm({
  message,
  okText,
  cancelText,
  open,
  onClose,
}: {
  message: string;
  okText?: string;
  cancelText?: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText || 'Cancel'}
        </Button>
        <Button onClick={onClose} color="primary">
          {okText || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
