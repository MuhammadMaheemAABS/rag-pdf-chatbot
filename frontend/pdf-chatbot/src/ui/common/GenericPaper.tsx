import React from "react";
import { Paper, PaperProps } from "@mui/material";

export type GenericPaperProps = PaperProps;

const GenericPaper: React.FC<GenericPaperProps> = ({
  children,
  sx,
  elevation = 1,
  ...rest
}) => {
  return (
    <Paper
      elevation={elevation}
      sx={{
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        m: 0,
        p: 3,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default GenericPaper;
