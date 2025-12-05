import React, { useState, useEffect } from "react";
import { Databalita } from "@/app/api/dashboatrd-new/databalita";
import BalitaDropdown from "../components-rapor-25/BalitaDropdown";
import IdentitasBalitaSection from "../components-rapor-25/IdentitasBalitaSection";
import DataAyahSection from "../components-rapor-25/DataAyahSection";
import PengukuranBalitaSection from "../components-rapor-25/PengukuranBalitaSection";
import DataIbuSection from "../components-rapor-25/DataIbuSection";
import PengukuranIbuHamilTable from "../components-rapor-25/PengukuranIbuHamilTable";
import { Statistikraportbalita } from "@/app/api/dashboatrd-new/statistikraportbalita";
import { RaporResponse } from "@/types/data-25/RaporResponse";



const ChartRaporBaby: React.FC = () => {
  const [balitaListAPI, setBalitaListAPI] = useState<any[]>([]);
  const [filteredBalita, setFilteredBalita] = useState<any[]>([]);
  const [selectedBalita, setSelectedBalita] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [rapor, setRapor] = useState<RaporResponse | null>(null);
  const [loading, setLoading] = useState(false);



  // ✨ Fetch list balita
  useEffect(() => {
    const fetchData = async () => {
      const { data, successCode } = await Databalita();

      if (successCode === 200 && data) {
        const mapped = data.map((item) => ({
          id: item.id,
          nama_anak: item.nama_anak,
          tanggal_lahir: item.tanggal_lahir,
          jenis_kelamin: item.jenis_kelamin,
        }));


        setBalitaListAPI(mapped);
        setFilteredBalita(mapped);

        if (mapped.length > 0) setSelectedBalita(mapped[0]);
      }
    };

    fetchData();
  }, []);

  // ✨ Ketika selectedBalita berubah → fetch rapor
  useEffect(() => {
    if (!selectedBalita?.id) return;

    const loadRapor = async () => {
      setLoading(true);
      const result = await Statistikraportbalita(selectedBalita.id);

      if (result.successCode === 200 && result.data) {
        setRapor(result.data);
      }

      setLoading(false);
    };

    loadRapor();
  }, [selectedBalita]);

  // ✨ Filter search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredBalita(balitaListAPI);
    } else {
      const filtered = balitaListAPI.filter((balita) =>
        balita.nama_anak?.toLowerCase().includes(searchTerm.toLowerCase())
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
  if (loading) return <div>Memuat rapor balita...</div>;

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

      {rapor ? (
        <>
          <IdentitasBalitaSection identitasBalita={rapor.anak} />

          <DataAyahSection dataAyah={rapor.orang_tua?.ayah ?? {}} />
          <DataIbuSection dataIbu={rapor.orang_tua?.ibu ?? {}} />
          <PengukuranBalitaSection
            pengukuranBalita={
              Array.isArray(rapor.pengukuran_anak)
                ? rapor.pengukuran_anak
                : rapor.pengukuran_anak
                  ? [rapor.pengukuran_anak]
                  : []
            }
          />

          <PengukuranIbuHamilTable
            pengukuranIbuHamil={
              Array.isArray(rapor.pengukuran_ibu_hamil)
                ? rapor.pengukuran_ibu_hamil
                : rapor.pengukuran_ibu_hamil
                  ? [rapor.pengukuran_ibu_hamil]
                  : []
            }
          />

        </>
      ) : (
        <p className="text-gray-500">Tidak ada data rapor.</p>
      )}
    </div>
  );
};

export default ChartRaporBaby;
