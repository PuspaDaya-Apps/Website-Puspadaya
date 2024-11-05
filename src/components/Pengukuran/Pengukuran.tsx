"use client";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useState } from "react";
import PengukuranBalita from "./PengukuranBalita";
import PengukuranIbuHamil from "./PengukuranIbuHamil";

const Pengukuran = () => {
  const [activeTab, setActiveTab] = useState("balita");

  return (
    <>
      <div className="mt-0 py-2">
        <Card>
          <div className="flex items-center justify-between">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              {activeTab === "balita" ? "Pengukuran Balita" : "Pengukuran Ibu Hamil"}
            </h1>
            <div className="flex gap-1">
              <Button
                label="Balita"
                onClick={() => setActiveTab("balita")}
                className={`w-[186px] border-none py-2 focus:outline-none focus:ring-2 focus:ring-[#347dde]
                ${activeTab === "balita" ? "bg-[#1854a2] text-white" : "bg-[#9bc0ef] text-black"}`}
              />
              <Button
                label="Ibu Hamil"
                onClick={() => setActiveTab("ibu")}
                className={`w-[186px] border-none py-2 font-normal focus:outline-none focus:ring-2 focus:ring-[#347dde]
                ${activeTab === "ibu" ? "bg-[#1854a2] text-white" : "bg-[#9bc0ef] text-black"}`}
              />
            </div>
          </div>
          <h5 className="text-lg text-gray-600">
            {activeTab === "balita" 
              ? "Ukur data balita sesuai dengan informasi yang tepat" 
              : "Ukur data ibu hamil sesuai dengan kondisi kehamilan yang tepat"}
          </h5>
          <div className="mt-8">
            {activeTab === "balita" && <PengukuranBalita />}
            {activeTab === "ibu" && <PengukuranIbuHamil />}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Pengukuran;
