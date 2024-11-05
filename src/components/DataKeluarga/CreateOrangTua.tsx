"use client";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { useState } from "react";
import CreateAyah from "./CreateAyah";
import CreateIbu from "./CreateIbu";

const CreateOrangTua = () => {
  const [activeTab, setActiveTab] = useState("ayah");

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Tambah Data Orang Tua
          </h1>
          <div className="flex gap-1">
            <Button
              label="Data Ayah"
              onClick={() => setActiveTab("ayah")}
              className={`w-[186px] border-none py-2 focus:outline-none focus:ring-2 focus:ring-[#347dde]
                ${activeTab === "ayah" ? "bg-[#1854a2] text-white" : "bg-[#9bc0ef] text-black"}`}
            />
            <Button
              label="Data Ibu"
              onClick={() => setActiveTab("ibu")}
              className={`w-[186px] border-none py-2 font-normal focus:outline-none focus:ring-2 focus:ring-[#347dde]
                ${activeTab === "ibu" ? "bg-[#1854a2] text-white" : "bg-[#9bc0ef] text-black"}`}
            />
          </div>
        </div>
        <h5 className="text-lg text-gray-600">Menambahkan Data Orang Tua</h5>
      </Card>

      <Card className="mt-8 px-2">
        <div>
          <form>
            {activeTab === "ayah" && <CreateAyah setActiveTab={setActiveTab} />}
            {activeTab === "ibu" && <CreateIbu />}
          </form>
        </div>
      </Card>
    </>
  );
};

export default CreateOrangTua;
