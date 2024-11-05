import { IconX } from "@tabler/icons-react";
import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  size?: "small" | "medium" | "large"; // Ukuran modal
  height?: string; // Tinggi modal kustom
  className?: string; // Kelas tambahan untuk styling
}

const sizeClasses = {
  small: "max-w-xs",
  medium: "max-w-lg",
  large: "max-w-3xl",
};

const Modal = ({ 
  children, 
  onClose, 
  size = "medium", 
  height = "auto", // Tinggi default adalah auto
  className = "" 
}: ModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div 
      className={`relative w-full ${sizeClasses[size]} overflow-y-auto rounded-lg bg-white p-6 shadow-lg ${className}`} 
      style={{ height }} // Mengatur tinggi modal
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
      >
        <IconX />
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
