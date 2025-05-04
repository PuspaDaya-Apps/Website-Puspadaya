
import React from "react";
type CountingCardProps = {
  icon: React.ComponentType; // Icon sebagai komponen React
  title: React.ReactNode | string; // Judul kartu
  title_secound: React.ReactNode | string; // Bulan judul
  jumlah: number; // Angka jumlah
  jumlah_keluarga: number;
  isMeningkat: boolean; // Apakah jumlah meningkat
  subtitle: string;
  peningkatan: string;
  color: string;
};
const CountingCardDesa: React.FC<CountingCardProps> = ({
  icon: Icon,
  title,
  jumlah,
  jumlah_keluarga,
  isMeningkat,
  peningkatan,
  subtitle,
  color,
  title_secound
}) => {
  return (
    <div className="flex flex-col justify-between rounded-xl h-full bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div className="max-w-xs break-words">
          <h1 className="text-xl text-black font-bold">{title}</h1>
          <h1 className="text-xl text-green-500 font-bold">{title_secound}</h1>
        </div>

        <div
          className="flex h-12 w-16 items-center justify-center rounded-lg"
          style={{ backgroundColor: color }}
        >
          <Icon />
        </div>
      </div>
      <h1 className="mb-4 text-6xl font-bold text-black">{jumlah}</h1>
      <p className="text-lg text-gray-700">{jumlah_keluarga} Keluarga tidak memiliki MCK</p>
      <p>
        {subtitle + " "}
        <span className={isMeningkat ? "text-green-400" : "text-red-400"}>
          {peningkatan}
        </span>
      </p>
    </div>
  );
};

export default CountingCardDesa;
