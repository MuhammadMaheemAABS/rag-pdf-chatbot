// GenericTextField.tsx
import React from "react";
import { TextField, TextFieldProps, SxProps, Theme } from "@mui/material";

export interface GenericTextFieldProps extends Omit<TextFieldProps, "variant"> {
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
}

const GenericTextField: React.FC<GenericTextFieldProps> = ({
  label,
  placeholder,
  error = false,
  helperText,
  fullWidth = true,
  disabled = false,
  required = false,
  size = "medium",
  sx,
  ...rest
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      disabled={disabled}
      required={required}
      size={size}
      variant="outlined" // Clean, professional look
      InputLabelProps={{
        shrink: true, // Ensures label doesn't overlap placeholder
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 1,
          backgroundColor: "background.paper",
          "& fieldset": {
            borderColor: error ? "error.main" : "divider",
            transition: "border-color 0.2s",
          },
          "&:hover fieldset": {
            borderColor: error ? "error.main" : "text.primary",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "error.main" : "primary.main",
            borderWidth: "2px",
          },
        },
        "& .MuiFormHelperText-root": {
          ml: 0,
          mt: 0.5,
        },
        ...sx,
      }}
      {...rest}
    />
  );
};

export default GenericTextField;
