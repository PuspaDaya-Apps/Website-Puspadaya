"use client";

import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";

// Tipe data untuk GeoJSON
interface GeoJSONFeature {
  type: string;
  properties: {
    name?: string;
    [key: string]: any;
  };
  geometry: any;
}


const BanyuwangiMap: React.FC = () => {
  useEffect(() => {
    // Inisialisasi peta
    const map = L.map("map").setView([-8.2192, 114.3691], 10); // Koordinat Banyuwangi

    // Tambahkan tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Load dan tambahkan GeoJSON
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch("/api/geojson/banyuwangi"); // Buat endpoint API untuk serve file GeoJSON
        const geoJSONData: any = await response.json();

        const geoJSONLayer = L.geoJSON(geoJSONData, {
          style: () => ({
            color: "blue",
            weight: 2,
            fillColor: "lightblue",
            fillOpacity: 0.5,
          }),
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(`Wilayah: ${feature.properties.name}`);
            }
          },
        }).addTo(map);

        // Zoom ke batas GeoJSON
        const bounds = geoJSONLayer.getBounds();
        map.fitBounds(bounds);

      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    fetchGeoJSON();

    return () => {
      map.remove(); // Hapus instance peta saat komponen di-unmount
    };
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%", zIndex: 1 }} />;
};

export default BanyuwangiMap;
