import { IconEyeClosed } from "@tabler/icons-react";
import { IconEye } from "@tabler/icons-react";
import React, { useState } from "react";

interface PasswordInputProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  placeholder = "Masukkan kata sandi",
  error,
  id = "password",
  name = "password",
  className = "",
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-12
          focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
          disabled:cursor-not-allowed disabled:bg-gray-100
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      >
        {showPassword ? (
          <IconEyeClosed className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        ) : (
          <IconEye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        )}
      </button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;
