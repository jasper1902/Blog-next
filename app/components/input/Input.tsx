"use client";
import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  id?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register?: UseFormRegister<FieldValues>;
  defaultValue?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const Input = ({
  id,
  type,
  disabled,
  required,
  register,
  onChange,
  placeholder,
}: Props) => {
  if (register && id)
    return (
      <input
        className="form-control form-control-lg"
        id={id}
        disabled={disabled}
        autoCapitalize="off"
        {...register(id, { required })}
        type={type}
        placeholder={placeholder}
      />
    );

  return (
    <input
      className="form-control form-control-lg"
      id={id}
      disabled={disabled}
      autoCapitalize="off"
      type={type}
      placeholder={placeholder}
      onSubmit={onChange}
    />
  );
};

export default Input;
