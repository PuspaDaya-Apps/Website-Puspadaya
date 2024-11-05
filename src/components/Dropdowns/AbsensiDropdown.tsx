import React from "react";

interface AbsensiDropdownProps {
  onSelect: (code: string|null) => void;
  currentCode: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

const AbsensiDropdown: React.FC<AbsensiDropdownProps> = ({ onSelect, currentCode, isOpen, onToggle }) => {
  const options = [
    { name: "Hadir", code: "H", color: "bg-green-500" },
    { name: "Kunjungan Hadir", code: "KH", color: "bg-blue-500" },
    { name: "Kunjungan Tidak Hadir", code: "KT", color: "bg-red-500" },
    { name: "Izin", code: "I", color: "bg-yellow-500" },
    { name: "Batalkan", code: "-", color: "bg-gray-200" },
  ];

  const handleOptionClick = (code: string) => {
    if (code === "-") {
      onSelect(null);
    } else {
      onSelect(code);
    }
    onToggle();
  };

  return (
    <div className="relative inline-block text-center">
      <button
        type="button"
        className={`flex justify-center items-center w-10 h-10 rounded-md border text-sm font-medium text-white ${currentCode ? options.find(opt => opt.code === currentCode)?.color : "bg-gray-200"}`}
        onClick={onToggle}
      >
        {currentCode ? options.find(opt => opt.code === currentCode)?.code : ""}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-99 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option) => (
              <button
                key={option.code}
                onClick={() => handleOptionClick(option.code)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsensiDropdown;