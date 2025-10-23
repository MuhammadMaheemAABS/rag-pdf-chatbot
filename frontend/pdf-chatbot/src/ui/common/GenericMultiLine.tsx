// TextAreaField.tsx
import React from "react";
import GenericTextField, { GenericTextFieldProps } from "./GenericTextField";

export interface TextAreaFieldProps extends GenericTextFieldProps {
  minRows?: number;
  maxRows?: number;
}

const GenericMultiLine: React.FC<TextAreaFieldProps> = ({
  minRows = 3,
  maxRows = 6,
  ...props
}) => {
  return (
    <GenericTextField
      {...props}
      multiline
      minRows={minRows}
      maxRows={maxRows}
      inputProps={{
        ...props.inputProps,
        style: { resize: "vertical" }, // Allow manual resize vertically
      }}
    />
  );
};

export default GenericMultiLine;
