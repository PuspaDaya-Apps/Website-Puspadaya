
import React from "react";
type CountingCardProps = {
  icon: React.ComponentType; // Icon sebagai komponen React
  title: React.ReactNode | string; // Judul kartu
  title_secound: React.ReactNode | string; // Bulan judul
  jumlah: number; // Angka jumlah
  isMeningkat: boolean; // Apakah jumlah meningkat
  subtitle: string;
  peningkatan: string;
  color: string;
};
const CountingCard: React.FC<CountingCardProps> = ({
  icon: Icon,
  title,
  jumlah,
  isMeningkat,
  peningkatan,
  subtitle,
  color,
  title_secound
}) => {
  return (
    <div className="flex flex-col rounded-xl h-full bg-white p-6 shadow-lg">
      <div className="flex items-start">
        <div className="max-w-xs break-words">
          <h1 className="text-xl text-black font-bold">{title}</h1>
          <h1 className="text-xl text-green-500 font-bold">{title_secound}</h1>
        </div>

        <div
          className="relative"
        >
          <div
            className="absolute top-0 right-0 flex h-12 w-16 items-center justify-center rounded-lg"
            style={{ backgroundColor: color }}
          >
            <Icon />
          </div>
        </div>

      </div>
      <h1 className="mb-4 text-6xl font-bold text-black">{jumlah}</h1>

      <p>
        {subtitle + " "}
        <span className={isMeningkat ? "text-green-400" : "text-red-400"}>
          {peningkatan}
        </span>
      </p>
    </div>
  );
};

export default CountingCard;
