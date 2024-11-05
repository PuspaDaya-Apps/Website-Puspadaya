"use client";
import TableRiwayatIbuHamil from "@/components/Tables/TableRiwayatIbuHamil";
// import StatusStuntingBalita from "./StatusStantingBalita";
import DataDiriKeluarga from "./DataDiriKeluarga";


const DetailRiwayatIbuHamil = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      {/* Data Diri Keluarga */}
      <DataDiriKeluarga />

      {/* Grafik */}
      <div className="mt-8">
        <h2 className="pb-1 text-2xl font-bold text-black">Riwayat Pengukuran Ibu Hamil</h2>
      </div>

      {/* Tabel Riwayat Balita */}
      <TableRiwayatIbuHamil />
      <div className="mt-8">
        <h4><b>Keterangan :</b></h4>
        <p className="text-sm font-light text-gray-500">
          BB : Berat Badan <br />
          TB : Tinggi Badan <br />
          Lila : Lingkar Lengan Atas <br />
          TFU : Tinggi Fundus Uteri <br />
          HB : Hemoglobin <br />
          KAR : Keterpaparan Asap Rokok
        </p>
      </div>
    </div>
  );
};

export default DetailRiwayatIbuHamil;
