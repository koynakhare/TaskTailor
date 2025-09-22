"use client";

import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface Option {
  label: string;
  value: string | number;
}

interface MUISelectProps {
  label: string;
  value: string | number;
  options: Option[];
  onChange: (value: string | number) => void;
  size?: "small" | "medium";
  fullWidth?: boolean;
}

export default function CustomSelect({
  label,
  value,
  options,
  onChange,
  size = "small",
  fullWidth = true,
}: MUISelectProps) {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size={size}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
