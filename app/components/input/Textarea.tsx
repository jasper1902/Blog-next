"use client";
import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  id: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  defaultValue?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  rows?: number;
};

const Textarea = ({
  id,
  disabled,
  required,
  register,
  placeholder,
  rows,
}: Props) => {
  return (
    <textarea
      className="form-control form-control-lg"
      id={id}
      disabled={disabled}
      autoCapitalize="off"
      {...register(id, { required })}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

export default Textarea;
