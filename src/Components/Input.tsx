import React from "react";

type InputProps = {
  name: string;
  value?: string;
  type?: string;
  onChange?: (e: any) => void;
  className?: string;
  onKeyDown?: (e: any) => void;
  disabled?: boolean;
};

const Input = ({
  name,
  value,
  type = "text",
  onChange,
  className,
  onKeyDown,
  disabled,
}: InputProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={`Enter ${name}`}
      disabled={disabled}
      className={`flex-1 bg-transparent placeholder-gray-300 border-2 border-gray-300 rounded-full px-3 py-1 ${className}`}
    />
  );
};

export default Input;
