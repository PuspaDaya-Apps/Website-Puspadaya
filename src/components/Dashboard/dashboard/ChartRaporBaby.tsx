import React, { useState, useEffect, useMemo } from "react";
import BalitaDropdown from "../components-rapor-25/BalitaDropdown";
import IdentitasBalitaSection from "../components-rapor-25/IdentitasBalitaSection";
import DataAyahSection from "../components-rapor-25/DataAyahSection";
import PengukuranBalitaSection from "../components-rapor-25/PengukuranBalitaSection";
import DataIbuSection from "../components-rapor-25/DataIbuSection";
import PengukuranIbuHamilTable from "../components-rapor-25/PengukuranIbuHamilTable";
import { useDaftarBalita, useRaporBalita } from "@/hooks/dashboard";



const ChartRaporBaby: React.FC = () => {
  const [selectedBalita, setSelectedBalita] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // ✨ List balita dari cache React Query
  const { data: daftarBalita } = useDaftarBalita();

  const balitaListAPI = useMemo<any[]>(
    () =>
      (daftarBalita ?? []).map((item) => ({
        id: item.id,
        nama_anak: item.nama_anak,
        tanggal_lahir: item.tanggal_lahir,
        jenis_kelamin: item.jenis_kelamin,
      })),
    [daftarBalita]
  );

  // ✨ Pilih balita pertama begitu daftarnya tersedia
  useEffect(() => {
    if (!selectedBalita && balitaListAPI.length > 0) {
      setSelectedBalita(balitaListAPI[0]);
    }
  }, [balitaListAPI, selectedBalita]);

  // ✨ Rapor mengikuti balita yang dipilih; tiap balita punya cache sendiri
  const { data: rapor = null, isFetching: loading } = useRaporBalita(selectedBalita?.id);

  // ✨ Filter search
  const filteredBalita = useMemo(() => {
    if (searchTerm === "") {
      return balitaListAPI;
    }

    return balitaListAPI.filter((balita) =>
      balita.nama_anak?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
