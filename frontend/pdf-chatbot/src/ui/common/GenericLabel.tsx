// CustomTypography.tsx
import React from "react";
import { Typography, TypographyProps } from "@mui/material";

// Define allowed color variants based on a professional MUI theme
export type ProfessionalColor =
  | "primary"
  | "secondary"
  | "textPrimary"
  | "textSecondary"
  | "error"
  | "info"
  | "success"
  | "warning";

export interface GenericLabelProps extends Omit<TypographyProps, "color"> {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline";
  color?: ProfessionalColor | string; // Keep string for edge cases (e.g., hex in sx)
  align?: "inherit" | "left" | "center" | "right" | "justify";
  fontWeight?: "light" | "regular" | "medium" | "bold" | number;
  gutterBottom?: boolean;
  noWrap?: boolean;
  children: React.ReactNode;
}

const GenericLabel: React.FC<GenericLabelProps> = ({
  variant = "body1",
  color = "textPrimary", // This maps to theme.palette.text.primary
  align = "inherit",
  fontWeight,
  gutterBottom = false,
  noWrap = false,
  children,
  ...rest
}) => {
  return (
    <Typography
      variant={variant}
      color={color}
      align={align}
      fontWeight={fontWeight}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      {...rest}
    >
      {children}
    </Typography>
  );
};

export default GenericLabel;
