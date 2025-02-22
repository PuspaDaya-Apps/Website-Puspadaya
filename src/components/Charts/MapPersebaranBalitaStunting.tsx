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

const banyuwangiView: L.LatLngTuple = [-8.2192, 114.3691]; // Koordinat Banyuwangi
const malukuTengahView: L.LatLngTuple = [-3.3746, 128.1228]; // Koordinat Maluku Tengah

const MapPersebaranBalitaStunting: React.FC = () => {
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Bwi" },
    { name: "Maluku Tengah", code: "MT" },
  ];

  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(
    wilayah.find((wilayah) => wilayah.code === "Bwi") || null,
  );

  const [map, setMap] = useState<L.Map | null>(null);
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null);

  useEffect(() => {
    const mapInstance = L.map("map-balita-stunting").setView(
      banyuwangiView,
      10,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  const popupContent = (feature: any) => {
    return `
      <div>
        <p><strong>Wilayah:</strong> ${feature.properties.name}</p>
        <p><strong>Memiliki balita stunting:</strong> 80</p>
        <p><strong>Memiliki balita Wasting:</strong> 10</p>
        <p><strong>Balita gizi baik:</strong> 238</p>
      </div>
    `;
  };

  useEffect(() => {
    if (map && selectedWilayah) {
      geoJSONLayer?.remove();

      const view =
        selectedWilayah.code === "Bwi" ? banyuwangiView : malukuTengahView;
      map.setView(view, 10);

      const fetchGeoJSON = async () => {
        const endpoint =
          selectedWilayah.code === "Bwi"
            ? "/api/geojson/banyuwangi"
            : "/api/geojson/maluku-tengah";

        try {
          const response = await fetch(endpoint);
          const geoJSONData: any = await response.json();

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

  // Tambahkan titik merah, kuning, hijau berdasarkan tingkat stunting
  useEffect(() => {
    if (map) {
      const titikPenyebaran = [
        {
          lat: -8.2192,
          lng: 114.3691,
          color: "red",
          info: "Tingkat stunting tinggi",
        },
        {
          lat: -8.2292,
          lng: 114.3791,
          color: "yellow",
          info: "Tingkat stunting sedang",
        },
        {
          lat: -8.2392,
          lng: 114.3891,
          color: "green",
          info: "Tingkat stunting rendah",
        },

        {
          lat: -3.2255,
          lng: 128.9754,
          color: "red",
          info: "Tingkat stunting tinggi (Amahai)",
        },
        {
          lat: -3.2997,
          lng: 128.9565,
          color: "yellow",
          info: "Tingkat stunting sedang (Masohi)",
        },
        {
          lat: -3.3333,
          lng: 129.0,
          color: "green",
          info: "Tingkat stunting rendah (Tehoru)",
        },
      ];

      titikPenyebaran.forEach(({ lat, lng, color, info }) => {
        const marker = L.circleMarker([lat, lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.8,
          radius: 8,
        }).addTo(map);
        marker.bindPopup(`<b>${info}</b>`);
      });
    }
  }, [map]);

  return (
    <div className="">
      <div className="mb-10 flex justify-between">
        <div className="">
          <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
            Peta Penyebaran Balita Stunting
          </h1>
          <p className="text-dark">
            Peta penyebaran stunting dan gizi baik pada balita
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
        id="map-balita-stunting"
        style={{ height: "100vh", width: "100%", zIndex: 1 }}
      />


      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <p className="text-dark">Balita Stunting</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <p className="text-dark">Balita Wasting</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <p className="text-dark">Balita Gizi Baik</p>
        </div>
      </div>

      
    </div>
  );
};

export default MapPersebaranBalitaStunting;
