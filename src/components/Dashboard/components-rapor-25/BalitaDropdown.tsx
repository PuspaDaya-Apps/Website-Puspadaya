import React from "react";
import { AnakItem } from "@/types/data-25/AnakResponse";

interface BalitaDropdownProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedBalita: AnakItem | null;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filteredBalita: AnakItem[];
    handleSelectBalita: (balita: AnakItem) => void;
}

const BalitaDropdown: React.FC<BalitaDropdownProps> = ({
    isOpen,
    setIsOpen,
    selectedBalita,
    searchTerm,
    setSearchTerm,
    filteredBalita,
    handleSelectBalita,
}) => {
    return (
        <div className="relative w-full md:w-64">
            {/* Trigger Dropdown */}
            <div
                className="flex items-center justify-between p-2 border border-gray-300 rounded-lg cursor-pointer bg-white"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate">
                    {selectedBalita?.nama_anak ?? "Pilih Balita"}
                </span>

                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {/* Input Search */}
                    <div className="p-2 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Cari nama balita..."
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* List Data */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredBalita.length > 0 ? (
                            filteredBalita.map((balita) => (
                                <div
                                    key={balita.id}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => handleSelectBalita(balita)}
                                >
                                    <div className="font-medium">
                                        {balita.nama_anak}
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {balita.tanggal_lahir} • {balita.jenis_kelamin}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-center text-gray-500">
                                Tidak ada data balita yang ditemukan
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BalitaDropdown;
