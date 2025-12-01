import React, { useState, useEffect } from "react";
import { balitaList } from "../../../types/data-25/dummyDataBaby";
import { dummyBalitaData } from "../../../types/data-25/dummyDataBaby";

import type {
  BalitaData,
} from "../../../types/data-25/dummyDataBaby";

import BalitaDropdown from "../components-rapor-25/BalitaDropdown";
import IdentitasBalitaSection from "../components-rapor-25/IdentitasBalitaSection";
import DataAyahSection from "../components-rapor-25/DataAyahSection";
import PengukuranBalitaSection from "../components-rapor-25/PengukuranBalitaSection";
import DataIbuSection from "../components-rapor-25/DataIbuSection";
import PengukuranIbuHamilTable from "../components-rapor-25/PengukuranIbuHamilTable";


const ChartRaporBaby: React.FC = () => {
  const [selectedBalita, setSelectedBalita] = useState<BalitaData>(dummyBalitaData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredBalita, setFilteredBalita] = useState<BalitaData[]>(dummyBalitaData);
  const data = balitaList;


  // Filter data balita berdasarkan pencarian
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBalita(dummyBalitaData);
    } else {
      const filtered = dummyBalitaData.filter(balita =>
        balita.identitasBalita.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBalita(filtered);
    }
  }, [searchTerm]);

  const handleSelectBalita = (balita: BalitaData) => {
    setSelectedBalita(balita);
    setIsOpen(false);
    setSearchTerm("");
  };

  const { identitasBalita, dataAyah, dataIbu, pengukuranBalita, pengukuranIbuHamil } = selectedBalita;

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Raport Balita</h1>

        <BalitaDropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedBalita={selectedBalita}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredBalita={filteredBalita}
          handleSelectBalita={handleSelectBalita}
        />
      </div>

      {/* A. Identitas Balita */}
      <IdentitasBalitaSection identitasBalita={selectedBalita.identitasBalita} />


      {/* B. Data Ayah */}
      <DataAyahSection dataAyah={selectedBalita.dataAyah} />


      {/* C. Data Ibu */}
      <DataIbuSection dataIbu={dataIbu} />


      {/* D. Pengukuran Balita */}
      <PengukuranBalitaSection pengukuranBalita={selectedBalita.pengukuranBalita} />


      {/* E. Pengukuran Ibu Hamil */}
      <PengukuranIbuHamilTable pengukuranIbuHamil={pengukuranIbuHamil} />
    </div>
  );
};

export default ChartRaporBaby;
