"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dropdown } from "primereact/dropdown";
import { DesaData } from "@/types/dashborad";

// Tipe data untuk GeoJSON
interface Wilayah {
  name: string;
  code: string;
}

const banyuwangiView: L.LatLngTuple = [-8.2192, 114.3691];
const malukuTengahView: L.LatLngTuple = [-3.3746, 128.1228]; 

const MapPersebaranBalitaBerdasarkanWIlayah: React.FC = () => {
  
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Banyuwangi" },
    { name: "Maluku Tengah", code: "MT" },
  ];

  const [dataMap, setDataMap] = useState<DesaData[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  


  // Ambil data provinsi dan role dari sessionStorage
  const provinsi: string = sessionStorage.getItem("nama_provinsi") ?? "";
  const role: string = sessionStorage.getItem("user_role") ?? "";

  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null);



  useEffect(() => {
    const mapInstance = L.map("map-persebaran-balita-berdasarkan-wilayah").setView(banyuwangiView, 10); // Inisialisasi peta dengan koordinat Banyuwangi
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    setMap(mapInstance); // Set map instance ke state

    return () => {
      mapInstance.remove(); // Hapus instance peta saat komponen di-unmount
    };
  }, []);

    useEffect(() => {
      // Default ke Banyuwangi jika provinsi tidak terdeteksi atau provinsi Jawa Timur
      if (!provinsi || provinsi === "Jawa Timur") {
        setSelectedWilayah(wilayah.find((wil) => wil.code === "Banyuwangi") || null);
      } else {
        setSelectedWilayah(wilayah.find((wil) => wil.code === "MT") || null);
      }
    }, [provinsi]);

  const popupContent = (feature: any) => {
    // Using HTML string instead of JSX for Leaflet to understand
    return `
      <div>
        <p><strong>Wilayah:</strong> ${feature.properties.name}</p>
        <p><strong>Jumlah Anak:</strong> 100</p>
        <p><strong>Anak Stunting:</strong> 30</p>
        <p><strong>Anak gizi baik:</strong> 70</p>
      </div>
    `;
  };
  useEffect(() => {
    if (map && selectedWilayah) {
      geoJSONLayer?.remove();

      const view =
        selectedWilayah.code === "Banyuwangi" ? banyuwangiView : malukuTengahView;
      map.setView(view, 10);

      // Load dan tambahkan GeoJSON untuk wilayah yang dipilih
      const fetchGeoJSON = async () => {
        const endpoint =
          selectedWilayah.code === "Banyuwangi"
            ? "/api/geojson/banyuwangi"
            : "/api/geojson/maluku-tengah";

        try {
          const response = await fetch(endpoint);
          const geoJSONData: any = await response.json();

          const newGeoJSONLayer = L.geoJSON(geoJSONData, {
            style: () => ({
              color: selectedWilayah.code === "Banyuwangi" ? "blue" : "green",
              weight: 2,
              fillColor:
                selectedWilayah.code === "Banyuwangi" ? "lightblue" : "lightgreen",
              fillOpacity: 0.5,
            }),
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(popupContent(feature)); 
              }
            },
          }).addTo(map);

          // Update state untuk menyimpan layer GeoJSON
          setGeoJSONLayer(newGeoJSONLayer);
          const bounds = newGeoJSONLayer.getBounds();
          map.fitBounds(bounds);
        } catch (error) {
          console.error("Error loading GeoJSON:", error);
        }
      };

      fetchGeoJSON();
    }
  }, [map, selectedWilayah]);

  return (
    <div className="">
      <div className="mb-10 flex justify-between">
        <div className="">
          <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
            Peta Penyebaran Anak Berdasarkan Wilayah
          </h1>
          <p className="text-dark">
            Menampilkan status penyebaran di setiap wilayah
          </p>
        </div>
        <div className="w-fit">
          <Dropdown
            value={selectedWilayah}
            onChange={(e) => setSelectedWilayah(e.value)}
            options={wilayah}
            optionLabel="name"
            placeholder="Pilih Wilayah"
            className="md:w-14rem h-11 w-full"
             disabled={role !== "Admin"} 
          />
        </div>
      </div>
      <div id="map-persebaran-balita-berdasarkan-wilayah" style={{ height: "100vh", width: "100%", zIndex: 1 }} />
    </div>
  );
};

export default MapPersebaranBalitaBerdasarkanWIlayah;
