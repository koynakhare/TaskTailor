"use client";

import React from "react";
import { TextField } from "@mui/material";

interface MUITextFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  size = "small",
  fullWidth = true,
  multiline = false,
  rows = 1,
}: MUITextFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      variant="outlined"
    />
  );
}
