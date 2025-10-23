// GenericButton.tsx
import React from "react";
import { Button, ButtonProps, SxProps, Theme } from "@mui/material";

export interface GenericButtonProps extends Omit<ButtonProps, "color"> {
  variant?: "text" | "outlined" | "contained";
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean; // Optional: show spinner
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  sx?: SxProps<Theme>;
}

const GenericButton: React.FC<GenericButtonProps> = ({
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  children,
  onClick,
  sx,
  ...rest
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        fontWeight: 600,
        textTransform: "none", // More professional (no uppercase)
        borderRadius: 1,
        minWidth: size === "small" ? "auto" : undefined,
        ...sx,
      }}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            display: "inline-block",
            width: "1em",
            height: "1em",
            border: "2px solid currentColor",
            borderRightColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default GenericButton;
