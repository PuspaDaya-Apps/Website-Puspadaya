"use client";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { useState } from "react";
import CreateFormAnggota from "./CreateFormAnggota";
import ImportCsv from "./ImportCsv";

const CreateAnggota = () => {
  const [activeTab, setActiveTab] = useState("individu");

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Tambah Akun Anggota
          </h1>
          <div className="flex gap-1">
            <Button
              label="Individu"
              onClick={() => setActiveTab("individu")}
              className={`w-[186px] border-none py-2 focus:outline-none focus:ring-2 focus:ring-[#347dde]
                ${activeTab === "individu" ? "bg-[#1854a2] text-white" : "bg-[#9bc0ef] text-black"}`}
            />
            <Button
              label="Import CSV"
              onClick={() => setActiveTab("csv")}
              className={`w-[186px] border-none py-2 font-normal focus:outline-none focus:ring-2 focus:ring-[#347dde]
                ${activeTab === "csv" ? "bg-[#1854a2] text-white" : "bg-[#9bc0ef] text-black"}`}
            />
          </div>
        </div>
        <h5 className="text-lg text-gray-600">
          Menampilkan formulir untuk menambah data anggota
        </h5>
      </Card>

      <Card className="mt-8 px-2">
        <div>
          {activeTab === "individu" && <CreateFormAnggota />}
          {activeTab === "csv" && <ImportCsv />}
        </div>
      </Card>
    </>
  );
};

export default CreateAnggota;
