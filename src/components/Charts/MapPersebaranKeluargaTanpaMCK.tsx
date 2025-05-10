"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dropdown } from "primereact/dropdown";

// Tipe data untuk Wilayah
interface Wilayah {
  name: string;
  code: string;
}

const banyuwangiView: L.LatLngTuple = [-8.2192, 114.3691];
const malukuTengahView: L.LatLngTuple = [-3.3746, 128.1228];

const MapPersebaranKeluargaTanpaMCK: React.FC = () => {
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Banyuwangi" },
    { name: "Maluku Tengah", code: "MT" },
  ];

  // Ambil data provinsi dan role dari sessionStorage
  const provinsi: string = sessionStorage.getItem("nama_provinsi") ?? "";
  const role: string = sessionStorage.getItem("user_role") ?? "";

  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null);

  useEffect(() => {
    const mapInstance = L.map("map-persebaran-keluarga-tanpa-mck").setView(
      banyuwangiView,
      10
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Otomatis pilih wilayah berdasarkan provinsi
  useEffect(() => {
    // Default ke Banyuwangi jika provinsi tidak terdeteksi atau provinsi Jawa Timur
    if (!provinsi || provinsi === "Jawa Timur") {
      setSelectedWilayah(wilayah.find((wil) => wil.code === "Banyuwangi") || null);
    } else {
      setSelectedWilayah(wilayah.find((wil) => wil.code === "MT") || null);
    }
  }, [provinsi]);

  const popupContent = (feature: any) => {
    return `
      <div>
        <p><strong>Wilayah:</strong> ${feature.properties.name}</p>
        <p><strong>Keluarga Tanpa MCK:</strong> ${feature.properties.keluargaTanpaMCK || 0}</p>
      </div>
    `;
  };

  useEffect(() => {
    if (map && selectedWilayah) {
      geoJSONLayer?.remove();

      const view =
        selectedWilayah.code === "Banyuwangi" ? banyuwangiView : malukuTengahView;
      map.setView(view, 10);

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
                
                layer.on("mouseover", () => {
                  const info = `Keluarga tidak memiliki MCK: ${feature.properties.keluargaTanpaMCK || 0}`;
                  layer.bindTooltip(info).openTooltip();
                });

                layer.on("mouseout", () => {
                  layer.closeTooltip();
                });
              }
            },
          }).addTo(map);

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
            Peta Persebaran Keluarga Tanpa Fasilitas MCK
          </h1>
          <p className="text-dark">
            Menampilkan peta persebaran keluarga yang tidak memiliki fasilitas MCK
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
      <div
        id="map-persebaran-keluarga-tanpa-mck"
        style={{ height: "100vh", width: "100%", zIndex: 1 }}
      />

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <p className="text-dark">Wilayah Banyuwangi</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <p className="text-dark">Wilayah Maluku Tengah</p>
        </div>
      </div>
    </div>
  );
};

export default MapPersebaranKeluargaTanpaMCK;