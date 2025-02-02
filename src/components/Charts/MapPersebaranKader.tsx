"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dropdown } from "primereact/dropdown";

// Tipe data untuk GeoJSON
interface Wilayah {
  name: string;
  code: string;
}

const banyuwangiView: L.LatLngTuple = [-8.2192, 114.3691]; // Koordinat Banyuwangi
const malukuTengahView: L.LatLngTuple = [-3.3746, 128.1228]; // Koordinat Maluku Tengah

const MapPersebaranKader: React.FC = () => {
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Bwi" },
    { name: "Maluku Tengah", code: "MT" },
  ];
  // Set nilai default ke Banyuwangi (Bwi)
  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(
    wilayah.find((wilayah) => wilayah.code === "Bwi") || null,
  );

  const [map, setMap] = useState<L.Map | null>(null); // Menyimpan instance peta
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null); // Menyimpan layer GeoJSON

  useEffect(() => {
    const mapInstance = L.map("map-persebaran-desa").setView(
      banyuwangiView,
      10,
    ); // Inisialisasi peta dengan koordinat Banyuwangi
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    setMap(mapInstance); // Set map instance ke state

    return () => {
      mapInstance.remove(); // Hapus instance peta saat komponen di-unmount
    };
  }, []);

  const popupContent = (feature: any) => {
    return `
      <div>
        <p><strong>Wilayah:</strong> ${feature.properties.name}</p>
        <p><strong>Jumlah Kader:</strong> 174</p>
        <p><strong>Kader Aktif:</strong> 124</p>
        <p><strong>Kader Tidak Aktif:</strong> 50</p>
      </div>
    `;
  };

  useEffect(() => {
    if (map && selectedWilayah) {
      // Hapus layer GeoJSON yang sudah ada
      geoJSONLayer?.remove();

      // Sesuaikan setView berdasarkan wilayah yang dipilih
      const view =
        selectedWilayah.code === "Bwi" ? banyuwangiView : malukuTengahView;
      map.setView(view, 10);

      // Load dan tambahkan GeoJSON untuk wilayah yang dipilih
      const fetchGeoJSON = async () => {
        const endpoint =
          selectedWilayah.code === "Bwi"
            ? "/api/geojson/banyuwangi"
            : "/api/geojson/maluku-tengah";

        try {
          const response = await fetch(endpoint);
          const geoJSONData: any = await response.json();

          // Tambahkan GeoJSON ke peta
          const newGeoJSONLayer = L.geoJSON(geoJSONData, {
            style: () => ({
              color: selectedWilayah.code === "Bwi" ? "blue" : "green",
              weight: 2,
              fillColor:
                selectedWilayah.code === "Bwi" ? "lightblue" : "lightgreen",
              fillOpacity: 0.5,
            }),
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(popupContent(feature));
              }
            },
          }).addTo(map);

          // Menambahkan marker untuk kader aktif dan tidak aktif
          const kaderData = [
            { lat: -8.2192, lng: 114.3691, status: "aktif", name: "Kader A" }, // Kader aktif
            { lat: -8.22, lng: 114.37, status: "tidak aktif", name: "Kader B" }, // Kader tidak aktif

            {
              lat: -8.2292,
              lng: 114.3791,

              status: "tidak aktif",
            },
            {
              lat: -8.2392,
              lng: 114.3891,

              status: "aktif",
            },

            {
              lat: -3.2255,
              lng: 128.9754,

              status: "aktif",
            },
            {
              lat: -3.2997,
              lng: 128.9565,

              status: "tidak aktif",
            },
            {
              lat: -3.3333,
              lng: 129.0,

              status: "tidak aktif",
            },
          ];

          kaderData.forEach((kader) => {
            const markerColor = kader.status === "aktif" ? "green" : "red";
            const marker = L.marker([kader.lat, kader.lng], {
              icon: L.divIcon({
                className: "leaflet-div-icon",
                html: `<div style="background-color: ${markerColor}; border-radius: 50%; width: 20px; height: 20px;"></div>`,
              }),
            })
              .addTo(map)
              .bindPopup(
                `<strong>${kader.name}</strong><br>Status: ${kader.status}`,
              );
          });

          // Update state untuk menyimpan layer GeoJSON
          setGeoJSONLayer(newGeoJSONLayer);

          // Zoom ke batas GeoJSON
          const bounds = newGeoJSONLayer.getBounds();
          map.fitBounds(bounds);
        } catch (error) {
          console.error("Error loading GeoJSON:", error);
        }
      };

      fetchGeoJSON();
    }
  }, [map, selectedWilayah]); // Menjalankan setiap kali peta atau wilayah dipilih berubah

  return (
    <div className="">
      <div className="mb-10 flex justify-between">
        <div className="">
          <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
            Peta Penyebaran Kader Aktif dan Tidak Aktif
          </h1>
          <p className="">
            Menampilkan penyebaran kader aktif dan tidak aktif di wilayah
            tertentu
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
          />
        </div>
      </div>
      <div
        id="map-persebaran-desa"
        style={{ height: "100vh", width: "100%", zIndex: 1 }}
      />

      <div className="mb-1 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500"></div>
        <p className="">Kader Tidak Aktif</p>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
        <p className="">Kader Aktif</p>
      </div>
    </div>
  );
};

export default MapPersebaranKader;
