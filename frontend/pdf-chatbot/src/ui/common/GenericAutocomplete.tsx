import React, { useState, SyntheticEvent } from "react";
import { Autocomplete, CircularProgress, SxProps, Theme } from "@mui/material";
import GenericTextField, { GenericTextFieldProps } from "./GenericTextField";

export interface GenericAutocompleteOption {
  id: string | number;
  label: string;
  [key: string]: unknown;
}

export interface GenericAutocompleteProps
  extends Omit<GenericTextFieldProps, "value" | "onChange"> {
  options: GenericAutocompleteOption[];
  value: GenericAutocompleteOption | null;
  onChange: (
    event: SyntheticEvent,
    value: GenericAutocompleteOption | string | null
  ) => void; // ✅ allow string if freeSolo is enabled
  loading?: boolean;
  onInputChange?: (value: string) => void;
  freeSolo?: boolean;
  sx?: SxProps<Theme>;
  getOptionLabel?: (option: GenericAutocompleteOption | string) => string;
  isOptionEqualToValue?: (
    option: GenericAutocompleteOption,
    value: GenericAutocompleteOption
  ) => boolean;
}

const GenericAutocomplete: React.FC<GenericAutocompleteProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select...",
  error = false,
  helperText,
  disabled = false,
  required = false,
  size = "medium",
  fullWidth = true,
  loading = false,
  onInputChange,
  freeSolo = false,
  sx,
  getOptionLabel,
  isOptionEqualToValue,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (_: unknown, newInputValue: string) => {
    setInputValue(newInputValue);
    onInputChange?.(newInputValue);
  };

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={onChange as never} // ✅ Type-safe cast for flexible types
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={
        getOptionLabel ||
        ((option) => (typeof option === "string" ? option : option.label || ""))
      }
      isOptionEqualToValue={
        isOptionEqualToValue ||
        ((option, val) =>
          typeof option !== "string" &&
          typeof val !== "string" &&
          option.id === val.id)
      }
      disabled={disabled}
      freeSolo={freeSolo}
      renderInput={(params) => (
        <GenericTextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          disabled={disabled}
          required={required}
          size={size}
          fullWidth={fullWidth}
          inputRef={params.inputProps.ref}
          inputProps={{
            ...params.inputProps,
            ...rest.inputProps,
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={sx}
        />
      )}
    />
  );
};

export default GenericAutocomplete;
