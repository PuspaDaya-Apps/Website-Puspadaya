
import React from "react";
import { SvgIconBayi } from "../ui/Svg";
type CountingCardProps = {
  icon: React.ComponentType; // Icon sebagai komponen React
  title: string; // Judul kartu
  jumlah: number; // Angka jumlah
  isMeningkat: boolean; // Apakah jumlah meningkat
  color: string;
};
const CountingCard: React.FC<CountingCardProps> = ({
  icon: Icon,
  title,
  jumlah,
  isMeningkat,
  color,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <h1 className="text-xl text-black font-bold">{title}</h1>
        <div
          className="flex h-12 w-16 items-center justify-center rounded-lg"
          style={{ backgroundColor: color }}
        >
          <Icon />
        </div>
      </div>
      <h1 className="mb-4 text-6xl font-bold text-black">{jumlah}</h1>
      <p>
        Jumlah {title.toLowerCase()} {isMeningkat ? "meningkat" : "menurun"}{" "}
        <span className={isMeningkat ? "text-green-400" : "text-red-400"}>
          {isMeningkat ? "90%" : "10%"}
        </span>
      </p>
    </div>
  );
};

export default CountingCard;
