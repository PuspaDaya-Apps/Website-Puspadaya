import { useState } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";
import Modal from "./Modal";

const factors = [
  {
    title: "Senin, 15 April 2024",
    waktu: "Senin, 15 April 2024",
    petugas: "Tanaya Suma",
    status: "Balita sudah diberi PMT",
  },
  {
    title: "Selasa, 16 April 2024",
    waktu: "Selasa, 16 April 2024",
    petugas: "Tanaya Suma",
    status: "Balita sudah diberi PMT",
  },
  {
    title: "Rabu, 17 April 2024",
    waktu: "Rabu, 17 April 2024",
    petugas: "Tanaya Suma",
    status: "Balita sudah diberi PMT",
  },
  {
    title: "Kamis, 18 April 2024",
    waktu: "Kamis, 18 April 2024",
    petugas: "Tanaya Suma",
    status: "Balita sudah diberi PMT",
  },
];

const DropdownIntervensi = () => {
  const [selectedFactor, setSelectedFactor] = useState<number | null>(null);
  const [status, setStatus] = useState<{ [key: number]: string }>({});

  const handleOpenModal = (index: number) => {
    setSelectedFactor(index);
  };

  const handleCloseModal = () => {
    setSelectedFactor(null);
  };

  const handleStatusChange = (index: number, value: string) => {
    setStatus((prev) => ({ ...prev, [index]: value }));
    handleCloseModal(); // Tutup modal setelah tombol dipilih
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {factors.map((factor, index) => (
        <div key={index} className="relative mt-2 p-2">
          <div className="flex flex-col rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-start">
              <div className="flex flex-grow items-center justify-between">
                <button
                  onClick={() => handleOpenModal(index)}
                  className="text-gray-600 focus:outline-none"
                >
                  <h3 className="text-base font-semibold text-gray-800">
                    {factor.title}
                  </h3>
                </button>
              </div>
            </div>
          </div>

          {/* Modal */}
          {selectedFactor === index && (
            <Modal onClose={handleCloseModal} size="medium" height="360px" className="custom-modal">
              <div className="p-4">
                <div className="mb-4 flex items-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {factor.title}
                  </h2>
                </div>
                <div className="mb-4">
                  <label className="text-m text-gray-900">Waktu Pemberian</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md bg-gray-100 p-2 border border-gray-400 focus:outline-none focus:border-gray-500"
                    value={factor.waktu}
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label className="text-m text-gray-900">Nama Petugas</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-md bg-gray-100 p-2 border border-gray-400 focus:outline-none focus:border-gray-500"
                    value={factor.petugas}
                    readOnly
                  />
                  <input
                    type="text"
                    className="mt-5 w-full inline-block rounded-lg bg-green-100 px-3 py-2 text-green-700 border-2 border-green-500 shadow-lg focus:outline-none text-center"
                    value={factor.status}
                    readOnly
                  />
                </div>
              </div>
            </Modal>
          )}
        </div>
      ))}
    </div>
  );
};

export default DropdownIntervensi;
