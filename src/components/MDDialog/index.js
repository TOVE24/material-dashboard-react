// components/ConfirmationDialog.js
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

export default function ConfirmationDialog({ open, title, message, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
