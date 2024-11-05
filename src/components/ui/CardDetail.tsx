import React from "react";

const CardDetail = ({
  children,
  label,
  satuan,
  className,
}: Readonly<{
  children: React.ReactNode;
  label: string;
  satuan?: string;
  className?: string;
}>) => {
  return (
    <>
      <label className="mb-1 block text-sm text-gray-600">{label}</label>
      <div className="p-inputgroup h-[2.6rem]">
        <div
          className={`flex w-full items-center rounded ${satuan && "rounded-r-none"} border border-gray-300 bg-gray-100 p-3 px-4 ${className}`}
        >
          {children}
        </div>
        {satuan && (
          <span className="p-inputgroup-addon rounded rounded-l-none border border-gray-300 bg-gray-200 p-2 text-gray-500">
            {satuan}
          </span>
        )}
      </div>
    </>
  );
};

export default CardDetail;
