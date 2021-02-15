// @flow 
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import * as React from 'react';
interface DeleteDialogProps {
  open: boolean;
  handleClose: (confirmed: boolean) => void;
};
export const DeleteDialog = (props: DeleteDialogProps) => {
  const {open, handleClose} = props;

  return (
    <Dialog
      open={open}
      onClose={()=> handleClose(false)}
    >
      <DialogTitle>
        Exclusão de Registros
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja realmente excluir este(s) registro(s)?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => handleClose(true)} color="primary" autoFocus>
          Excluir
        </Button>
      </DialogActions>

    </Dialog>
  );
};