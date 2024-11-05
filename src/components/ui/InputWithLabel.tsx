import { InputText } from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import React from "react";

type InputWithLabelProps = {
  id: string;
  name?: string;
  label: string;
  placeholder: string;
  value?: string;
  type?: string;
  keyfilter?: KeyFilterType;
  className?: string;
  satuan: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputWithLabel = ({
  label,
  placeholder,
  type = "text",
  onChange,
  id,
  value,
  keyfilter,
  className,
  satuan,
}: InputWithLabelProps) => {
  return (
    <>
      <div className="flex flex-col">
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="p-inputgroup h-[2.6rem]">
          <InputText
            id={id}
            value={value}
            className={`flex-1 ${className}`}
            keyfilter={keyfilter}
            placeholder={placeholder}
            onChange={onChange}
            type={type}
          />
          <span className="p-inputgroup-addon bg-gray-100 text-gray-600">
            {satuan}
          </span>
        </div>
      </div>
    </>
  );
};

export default InputWithLabel;
