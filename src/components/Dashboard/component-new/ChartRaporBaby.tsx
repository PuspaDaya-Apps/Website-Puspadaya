import React, { useState, useEffect } from "react";

// Dummy data untuk beberapa balita
const dummyBalitaData = [
  {
    id: 1,
    identitasBalita: {
      noKK: "3510123456789001",
      nik: "3510123456789002",
      nama: "Aisyah Putri",
      tanggalLahir: "2021-06-15",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Perempuan",
      anakKe: 2,
      caraLahir: "Normal",
    },
    dataAyah: {
      nik: "3510123456789003",
      nama: "Budi Santoso",
      tanggalLahir: "1990-04-12",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Laki-laki",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    dataIbu: {
      nik: "3510123456789004",
      nama: "Siti Aminah",
      tanggalLahir: "1993-08-22",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Perempuan",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    pengukuranBalita: [
      {
        tanggal: "2025-08-10",
        tempat: "Posyandu Melati",
        posisi: "Berdiri",
        tinggi: 95,
        berat: 14,
        lila: 15,
        lingkarKepala: 47,
        asiEksklusif: "Ya",
        mpasi: "Ya",
        stunting: "Tidak",
        underweight: "Tidak",
        wasting: "Tidak",
      },
    ],
    pengukuranIbuHamil: [
      {
        tanggal: "2025-08-10",
        tempat: "Posyandu Melati",
        usiaKehamilan: 32,
        tinggi: 155,
        berat: 55,
        lila: 23,
        tinggiFundus: 28,
        hemoglobin: 12.5,
        tglHaid: "2025-01-05",
        asapRokok: "Tidak",
        tabletFe: "Ya",
      },
    ],
  },
  {
    id: 2,
    identitasBalita: {
      noKK: "3510123456789011",
      nik: "3510123456789012",
      nama: "Muhammad Rizky",
      tanggalLahir: "2020-03-22",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Laki-laki",
      anakKe: 1,
      caraLahir: "Normal",
    },
    dataAyah: {
      nik: "3510123456789013",
      nama: "Ahmad Fauzi",
      tanggalLahir: "1988-07-15",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Laki-laki",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    dataIbu: {
      nik: "3510123456789014",
      nama: "Dewi Lestari",
      tanggalLahir: "1991-11-30",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Perempuan",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    pengukuranBalita: [
      {
        tanggal: "2025-08-15",
        tempat: "Posyandu Mawar",
        posisi: "Berbaring",
        tinggi: 92,
        berat: 13.5,
        lila: 14.5,
        lingkarKepala: 46,
        asiEksklusif: "Ya",
        mpasi: "Ya",
        stunting: "Tidak",
        underweight: "Tidak",
        wasting: "Tidak",
      },
    ],
    pengukuranIbuHamil: [],
  },
  {
    id: 3,
    identitasBalita: {
      noKK: "3510123456789021",
      nik: "3510123456789022",
      nama: "Salsabila Nur",
      tanggalLahir: "2022-01-10",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Perempuan",
      anakKe: 3,
      caraLahir: "Caesar",
    },
    dataAyah: {
      nik: "3510123456789023",
      nama: "Joko Susilo",
      tanggalLahir: "1985-02-18",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Laki-laki",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    dataIbu: {
      nik: "3510123456789024",
      nama: "Rina Wati",
      tanggalLahir: "1989-05-25",
      tempatLahir: "Banyuwangi",
      jenisKelamin: "Perempuan",
      alamat: "Dusun Krajan, Rogojampi, Banyuwangi",
    },
    pengukuranBalita: [
      {
        tanggal: "2025-08-20",
        tempat: "Posyandu Kenanga",
        posisi: "Berdiri",
        tinggi: 85,
        berat: 11.5,
        lila: 13.5,
        lingkarKepala: 44,
        asiEksklusif: "Ya",
        mpasi: "Ya",
        stunting: "Tidak",
        underweight: "Tidak",
        wasting: "Tidak",
      },
    ],
    pengukuranIbuHamil: [],
  },
];

interface IdentitasBalita {
  noKK: string;
  nik: string;
  nama: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: string;
  anakKe: number;
  caraLahir: string;
}

interface DataOrangTua {
  nik: string;
  nama: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: string;
  alamat: string;
}

interface PengukuranBalita {
  tanggal: string;
  tempat: string;
  posisi: string;
  tinggi: number;
  berat: number;
  lila: number;
  lingkarKepala: number;
  asiEksklusif: string;
  mpasi: string;
  stunting: string;
  underweight: string;
  wasting: string;
}

interface PengukuranIbuHamil {
  tanggal: string;
  tempat: string;
  usiaKehamilan: number;
  tinggi: number;
  berat: number;
  lila: number;
  tinggiFundus: number;
  hemoglobin: number;
  tglHaid: string;
  asapRokok: string;
  tabletFe: string;
}

interface BalitaData {
  id: number;
  identitasBalita: IdentitasBalita;
  dataAyah: DataOrangTua;
  dataIbu: DataOrangTua;
  pengukuranBalita: PengukuranBalita[];
  pengukuranIbuHamil: PengukuranIbuHamil[];
}

const ChartRaporBaby: React.FC = () => {
  const [selectedBalita, setSelectedBalita] = useState<BalitaData>(dummyBalitaData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredBalita, setFilteredBalita] = useState<BalitaData[]>(dummyBalitaData);

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Raport Balita</h1>
        
        {/* Dropdown dengan Pencarian */}
        <div className="relative w-64">
          <div 
            className="flex items-center justify-between p-2 border border-gray-300 rounded-lg cursor-pointer bg-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="truncate">{selectedBalita.identitasBalita.nama}</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {/* Input Pencarian */}
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
              
              {/* Daftar Balita */}
              <div className="max-h-60 overflow-y-auto">
                {filteredBalita.length > 0 ? (
                  filteredBalita.map((balita) => (
                    <div
                      key={balita.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelectBalita(balita)}
                    >
                      <div className="font-medium">{balita.identitasBalita.nama}</div>
                      <div className="text-sm text-gray-500">
                        {balita.identitasBalita.tanggalLahir} • {balita.identitasBalita.jenisKelamin}
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
      </div>

      {/* A. Identitas Balita */}
      <section>
        <h2 className="font-semibold text-lg mb-2">A. Identitas Balita</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>No KK: {identitasBalita.noKK}</li>
          <li>NIK Balita: {identitasBalita.nik}</li>
          <li>Nama Balita: {identitasBalita.nama}</li>
          <li>Tanggal Lahir: {identitasBalita.tanggalLahir}</li>
          <li>Tempat Lahir: {identitasBalita.tempatLahir}</li>
          <li>Jenis Kelamin: {identitasBalita.jenisKelamin}</li>
          <li>Anak Ke: {identitasBalita.anakKe}</li>
          <li>Cara Lahir: {identitasBalita.caraLahir}</li>
        </ul>
      </section>

      {/* B. Data Ayah */}
      <section>
        <h2 className="font-semibold text-lg mb-2">B. Data Ayah</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>NIK Ayah: {dataAyah.nik}</li>
          <li>Nama Ayah: {dataAyah.nama}</li>
          <li>Tanggal Lahir: {dataAyah.tanggalLahir}</li>
          <li>Tempat Lahir: {dataAyah.tempatLahir}</li>
          <li>Jenis Kelamin: {dataAyah.jenisKelamin}</li>
          <li>Alamat: {dataAyah.alamat}</li>
        </ul>
      </section>

      {/* C. Data Ibu */}
      <section>
        <h2 className="font-semibold text-lg mb-2">C. Data Ibu</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>NIK Ibu: {dataIbu.nik}</li>
          <li>Nama Ibu: {dataIbu.nama}</li>
          <li>Tanggal Lahir: {dataIbu.tanggalLahir}</li>
          <li>Tempat Lahir: {dataIbu.tempatLahir}</li>
          <li>Jenis Kelamin: {dataIbu.jenisKelamin}</li>
          <li>Alamat: {dataIbu.alamat}</li>
        </ul>
      </section>

      {/* D. Pengukuran Balita */}
      <section>
        <h2 className="font-semibold text-lg mb-2">D. Pengukuran Balita</h2>
        {pengukuranBalita.map((p, i) => (
          <div key={i} className="border rounded-lg p-3 mb-3 text-sm text-gray-700">
            <p>Tanggal: {p.tanggal}</p>
            <p>Tempat: {p.tempat}</p>
            <p>Posisi: {p.posisi}</p>
            <p>Tinggi Badan: {p.tinggi} cm</p>
            <p>Berat Badan: {p.berat} kg</p>
            <p>LILA: {p.lila} cm</p>
            <p>Lingkar Kepala: {p.lingkarKepala} cm</p>
            <p>ASI Eksklusif: {p.asiEksklusif}</p>
            <p>MPASI: {p.mpasi}</p>
            <p>Status Stunting: {p.stunting}</p>
            <p>Status Underweight: {p.underweight}</p>
            <p>Status Wasting: {p.wasting}</p>
          </div>
        ))}
      </section>

      {/* E. Pengukuran Ibu Hamil */}
      {pengukuranIbuHamil.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-2">E. Pengukuran Ibu Hamil</h2>
          {pengukuranIbuHamil.map((p, i) => (
            <div key={i} className="border rounded-lg p-3 mb-3 text-sm text-gray-700">
              <p>Tanggal: {p.tanggal}</p>
              <p>Tempat: {p.tempat}</p>
              <p>Usia Kehamilan: {p.usiaKehamilan} minggu</p>
              <p>Tinggi Badan Ibu: {p.tinggi} cm</p>
              <p>Berat Badan Ibu: {p.berat} kg</p>
              <p>LILA Ibu: {p.lila} cm</p>
              <p>Tinggi Fundus: {p.tinggiFundus} cm</p>
              <p>Hemoglobin: {p.hemoglobin} g/dl</p>
              <p>Tanggal Pertama Haid: {p.tglHaid}</p>
              <p>Terpapar Asap Rokok: {p.asapRokok}</p>
              <p>Tablet Fe: {p.tabletFe}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ChartRaporBaby;
