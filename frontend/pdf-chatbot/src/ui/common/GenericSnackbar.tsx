// GenericSnackbar.tsx
import React from "react";
import {
  Snackbar,
  Alert,
  AlertColor,
  SnackbarOrigin,
  SxProps,
  Theme,
} from "@mui/material";

export interface GenericSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'success' | 'error' | 'warning' | 'info'
  onClose: () => void;
  autoHideDuration?: number; // e.g., 3000 ms
  anchorOrigin?: SnackbarOrigin;
  sx?: SxProps<Theme>;
}

const GenericSnackbar: React.FC<GenericSnackbarProps> = ({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 4000,
  anchorOrigin = { vertical: "bottom", horizontal: "right" },
  sx,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      sx={sx}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 1,
          fontWeight: 500,
          boxShadow: 3,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GenericSnackbar;
