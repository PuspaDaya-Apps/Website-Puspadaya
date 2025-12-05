import React, { useState, useEffect } from "react";
import { Databalita } from "@/app/api/dashboatrd-new/databalita";  // pastikan path benar
import BalitaDropdown from "../components-rapor-25/BalitaDropdown";
import IdentitasBalitaSection from "../components-rapor-25/IdentitasBalitaSection";
import DataAyahSection from "../components-rapor-25/DataAyahSection";
import PengukuranBalitaSection from "../components-rapor-25/PengukuranBalitaSection";
import DataIbuSection from "../components-rapor-25/DataIbuSection";
import PengukuranIbuHamilTable from "../components-rapor-25/PengukuranIbuHamilTable";

const ChartRaporBaby: React.FC = () => {
  const [balitaListAPI, setBalitaListAPI] = useState<any[]>([]);
  const [filteredBalita, setFilteredBalita] = useState<any[]>([]);
  const [selectedBalita, setSelectedBalita] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // ⬇️ Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      const { data, successCode } = await Databalita();

      if (successCode === 200 && data) {
        console.log("HASIL DATA API:", data);

        // Mapping data API → struktur komponen
        const mapped = data.map((item) => ({
          id: item.id,
          identitasBalita: {
            nama: item.nama_anak,
            tanggalLahir: item.tanggal_lahir,
            jenisKelamin: item.jenis_kelamin,
          },
          // bagian lain seperti dataIbu, dataAyah, pengukuran dsb masih kosong
          dataAyah: {},
          dataIbu: {},
          pengukuranBalita: [],
          pengukuranIbuHamil: []
        }));

        setBalitaListAPI(mapped);
        setFilteredBalita(mapped);

        // pilih pertama sebagai default
        if (mapped.length > 0) setSelectedBalita(mapped[0]);
      }
    };

    fetchData();
  }, []);

  // ⬇️ Filter pencarian
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBalita(balitaListAPI);
    } else {
      const filtered = balitaListAPI.filter((balita) =>
        balita.identitasBalita.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBalita(filtered);
    }
  }, [searchTerm, balitaListAPI]);



  const handleSelectBalita = (balita: any) => {
    setSelectedBalita(balita);
    setIsOpen(false);
    setSearchTerm("");
  };

  if (!selectedBalita) return <div>Loading...</div>;

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

      <IdentitasBalitaSection identitasBalita={selectedBalita.identitasBalita} />


      <DataAyahSection dataAyah={selectedBalita.dataAyah} />
      <DataIbuSection dataIbu={selectedBalita.dataIbu} />
      <PengukuranBalitaSection pengukuranBalita={selectedBalita.pengukuranBalita} />
      <PengukuranIbuHamilTable pengukuranIbuHamil={selectedBalita.pengukuranIbuHamil} />
    </div>
  );
};

export default ChartRaporBaby;
