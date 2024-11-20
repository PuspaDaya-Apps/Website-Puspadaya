"use client";

import React, { useEffect, useRef } from "react";
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

const MalukuTengahMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    // Inisialisasi peta
    mapRef.current = L.map(mapContainerRef.current).setView(
      [-3.3700, 129.4200],
      10
    ); // Koordinat Maluku Tengah

    // Fix untuk icon Leaflet di Next.js
    if (typeof window !== "undefined") {
      const DefaultIcon = L.icon({
        iconUrl: "/images/marker-icon.png",
        shadowUrl: "/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;
    }

    // Tambahkan tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    // Load dan tambahkan GeoJSON
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch("/api/geojson/maluku-tengah");
        const geoJSONData: any = await response.json();

        if (mapRef.current) {
          const geoJSONLayer = L.geoJSON(geoJSONData, {
            style: () => ({
              color: "green",
              weight: 2,
              fillColor: "lightgreen",
              fillOpacity: 0.5,
            }),
            onEachFeature: (feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(`Wilayah: ${feature.properties.name}`);
              }
            },
          }).addTo(mapRef.current);

          // Zoom ke batas GeoJSON
          const bounds = geoJSONLayer.getBounds();
          mapRef.current.fitBounds(bounds);
        }
      } catch (error) {
        console.error("Error loading GeoJSON:", error);
      }
    };

    fetchGeoJSON();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array

  return (
    <div
      ref={mapContainerRef}
      id="map"
      className="w-full h-screen"
      style={{ zIndex: 1 }}
    />
  );
};

export default MalukuTengahMap;