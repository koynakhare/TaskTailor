"use client";

import React from "react";
import InputField from "./inputField";
import CustomSelect from "./select";

type FieldType = "select" | "number" | "text";

interface FieldProps {
  field: {
    key: string;
    label: string;
    type: FieldType;
    options?: string[]; // for select
    min?: number;       // for number
  };
  value: any;
  onChange: (key: string, value: any) => void;
}

export default function FormField({ field, value, onChange }: FieldProps) {
  switch (field.type) {
    case "select":
      return (
        <CustomSelect
          label={field.label}
          value={value}
          options={field.options?.map((opt) => ({ label: opt, value: opt })) || []}
          onChange={(val) => onChange(field.key, val)}
        />
      );

    case "number":
      return (
        <InputField
          label={field.label}
          value={value}
          type="number"
          onChange={(val) => onChange(field.key, Number(val))}
          placeholder={field.label}
        />
      );

    case "text":
    default:
      return (
        <InputField
          label={field.label}
          value={value}
          type="text"
          onChange={(val) => onChange(field.key, val)}
          placeholder={field.label}
        />
      );
  }
}
