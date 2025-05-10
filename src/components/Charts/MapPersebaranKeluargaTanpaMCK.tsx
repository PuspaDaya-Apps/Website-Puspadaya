"use client";

import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dropdown } from "primereact/dropdown";

interface Wilayah {
  name: string;
  code: string;
}

const DEFAULT_VIEWS = {
  Bwi: [-8.2192, 114.3691] as L.LatLngTuple,
  MT: [-3.3746, 128.1228] as L.LatLngTuple,
};

const MapPersebaranKeluargaTanpaMCK: React.FC = () => {
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Bwi" },
    { name: "Maluku Tengah", code: "MT" },
  ];

  // Get data from sessionStorage
  const provinsi = sessionStorage.getItem("nama_provinsi") ?? "";
  const role = sessionStorage.getItem("role") ?? "";

  // Determine default wilayah
  const getDefaultWilayah = (): Wilayah | null => {
    if (provinsi === "Jawa Timur") return wilayah.find(w => w.code === "Bwi") ?? null;
    if (provinsi) return wilayah.find(w => w.code === "MT") ?? null;
    return wilayah.find(w => w.code === "Bwi") ?? null; // Fallback to Banyuwangi
  };

  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null);

  // Initialize map and default wilayah
  useEffect(() => {
    const mapInstance = L.map("map-persebaran-keluarga-tanpa-mck").setView(
      DEFAULT_VIEWS.Bwi, // Default to Banyuwangi view
      10
    );
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    setMap(mapInstance);
    setSelectedWilayah(getDefaultWilayah());

    return () => {
      mapInstance.remove();
    };
  }, []);

  const popupContent = (feature: any) => {
    const count = feature.properties.keluargaTanpaMCK || 0;
    return `
      <div class="p-2">
        <p class="font-semibold">${feature.properties.name}</p>
        <p>Keluarga tanpa MCK: <span class="font-bold">${count}</span></p>
      </div>
    `;
  };

  // Handle wilayah change and GeoJSON loading
  useEffect(() => {
    if (!map || !selectedWilayah) return;

    geoJSONLayer?.remove();

    const view = DEFAULT_VIEWS[selectedWilayah.code as keyof typeof DEFAULT_VIEWS];
    map.setView(view, 10);

    const fetchGeoJSON = async () => {
      const endpoint = `/api/geojson/${selectedWilayah.code === "Bwi" ? "banyuwangi" : "maluku-tengah"}`;

      try {
        const response = await fetch(endpoint);
        const geoJSONData = await response.json();

        const newGeoJSONLayer = L.geoJSON(geoJSONData, {
          style: {
            color: selectedWilayah.code === "Bwi" ? "#3b82f6" : "#10b981",
            weight: 2,
            fillColor: selectedWilayah.code === "Bwi" ? "#93c5fd" : "#a7f3d0",
            fillOpacity: 0.5,
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties?.name) {
              layer.bindPopup(popupContent(feature));
              
              layer.on({
                mouseover: () => {
                  layer.bindTooltip(`Keluarga tanpa MCK: ${feature.properties.keluargaTanpaMCK || 0}`)
                    .openTooltip();
                },
                mouseout: () => layer.closeTooltip()
              });
            }
          },
        }).addTo(map);

        setGeoJSONLayer(newGeoJSONLayer);
        map.fitBounds(newGeoJSONLayer.getBounds());
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    fetchGeoJSON();
  }, [map, selectedWilayah]);

  // Determine if dropdown should be disabled
  const isDropdownDisabled = provinsi === "Jawa Timur" && role !== "Admin";

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
            Peta Persebaran Keluarga Tanpa Fasilitas MCK
          </h1>
          <p className="text-dark">
            Menampilkan peta persebaran keluarga yang tidak memiliki fasilitas MCK
          </p>
        </div>
        
        <div className="w-full md:w-fit">
          <Dropdown
            value={selectedWilayah}
            onChange={(e) => setSelectedWilayah(e.value)}
            options={wilayah}
            optionLabel="name"
            placeholder="Pilih Wilayah"
            className="w-full md:w-56"
            disabled={isDropdownDisabled}
          />
        </div>
      </div>
      
      <div
        id="map-persebaran-keluarga-tanpa-mck"
        className="h-[calc(100vh-180px)] w-full rounded-lg border shadow-sm"
      />
    </div>
  );
};

export default MapPersebaranKeluargaTanpaMCK;