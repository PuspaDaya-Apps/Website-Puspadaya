"use client";
import React from "react";
import { DonutChart } from "../Charts/DougnutChart";

type DataItem = {
  name: string;
  value: number;
};

type CountingCardProps = {
  title: string; // Judul kartu
  jumlah: number; // Angka jumlah
  color: string[];
  data: DataItem[];
  label: string[];
};
//

const PercentageCard: React.FC<CountingCardProps> = ({
  title,
  jumlah,
  data,
  color,
  label,
}) => {
  return (
    <div className="flex h-[331px] flex-col justify-between rounded-xl bg-white p-6 shadow-lg">
      <h1 className="text-xl font-bold text-black">{title}</h1>
      <h1 className="relative flex items-center justify-center">
        <h1 className="absolute text-slate-700 font-bold">{jumlah}%</h1>
        <DonutChart color={color} data={data} width={400} height={215} />
      </h1>
      <div className="flex flex-col items-start justify-start gap-1">
        <div className="flex items-center justify-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color[0] }}
          ></div>
          <p>{label[0]}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: color[1] }}
          ></div>
          <p>{label[1]}</p>
        </div>
      </div>
    </div>
  );
};

export default PercentageCard;