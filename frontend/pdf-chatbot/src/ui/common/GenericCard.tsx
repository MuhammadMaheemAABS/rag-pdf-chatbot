// CardContainer.tsx

"use-client";
import React from "react";
import { Card, CardProps } from "@mui/material";

export type GenericCardProps = CardProps;

const GenericCard: React.FC<GenericCardProps> = ({
  children,
  sx,
  elevation = 1,
  variant = "elevation",
  ...rest
}) => {
  return (
    <Card
      elevation={elevation}
      variant={variant}
      sx={{
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        p: 3, // Consistent internal padding
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Card>
  );
};

export default GenericCard;
