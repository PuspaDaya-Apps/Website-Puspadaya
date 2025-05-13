"use client";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dropdown } from "primereact/dropdown";
import { Desa, PersebaranAnakResponse } from "@/types/dashborad";
import { mapPersebaranAnak } from "@/app/api/statistik-maps/mapPersebaranAnak";

interface Wilayah {
  name: string;
  code: string;
}

interface GeoJSONFeature extends GeoJSON.Feature<GeoJSON.Geometry, { 
  NAMOBJ?: string; 
  WADMKD?: string; 
  name?: string;
}> {}

const banyuwangiView: L.LatLngTuple = [-8.2192, 114.3691];
const malukuTengahView: L.LatLngTuple = [-3.3746, 128.1228]; 

const MapPersebaranBalitaBerdasarkanWIlayah: React.FC = () => {
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Banyuwangi" },
    { name: "Maluku Tengah", code: "MT" },
  ];

  const [dataMap, setDataMap] = useState<Desa[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null);

  useEffect(() => {
    const fetchStuntingData = async () => {
      setLoading(true);
      const result = await mapPersebaranAnak();

      if (result.data) {
        const response = result.data as PersebaranAnakResponse;
        setDataMap(response.data);
        setMessage(response.message);
      } else {
        console.warn("Gagal mengambil data, kode:", result.successCode);
      }

      setLoading(false);
    };

    fetchStuntingData();
  }, []);

  const provinsi: string = sessionStorage.getItem("nama_provinsi") ?? "";
  const role: string = sessionStorage.getItem("user_role") ?? "";

  useEffect(() => {
    const mapInstance = L.map("map-persebaran-balita-berdasarkan-wilayah").setView(banyuwangiView, 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    if (!provinsi || provinsi === "Jawa Timur") {
      setSelectedWilayah(wilayah.find((wil) => wil.code === "Banyuwangi") || null);
    } else {
      setSelectedWilayah(wilayah.find((wil) => wil.code === "MT") || null);
    }
  }, [provinsi]);

  const normalizeName = (name: string): string => {
    return name.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const getDesaData = (feature: GeoJSONFeature): Desa | undefined => {
    if (!dataMap || !feature.properties) return undefined;
    
    return dataMap.find(desa => {
      const normalizedDesaName = normalizeName(desa.nama_desa);
      const normalizedFeatureName1 = normalizeName(feature.properties.NAMOBJ || "");
      const normalizedFeatureName2 = normalizeName(feature.properties.WADMKD || "");
      
      return normalizedDesaName === normalizedFeatureName1 || 
             normalizedDesaName === normalizedFeatureName2;
    });
  };

  const popupContent = (feature: GeoJSONFeature, desaData?: Desa) => {
    if (desaData) {
      return `
        <div>
          <p><strong>Wilayah:</strong> ${feature.properties.NAMOBJ || feature.properties.WADMKD || feature.properties.name || 'Unknown'}</p>
          <p><strong>Jumlah Anak:</strong> ${desaData.count}</p>
        </div>
      `;
    }
    return `
      <div>
        <p><strong>Wilayah:</strong> ${feature.properties.NAMOBJ || feature.properties.WADMKD || feature.properties.name || 'Unknown'}</p>
        <p>Data tidak tersedia</p>
      </div>
    `;
  };

  const getFeatureCenter = (feature: GeoJSONFeature): L.LatLng | null => {
    if (!feature.geometry) return null;
    
    try {
      const tempLayer = L.geoJSON(feature);
      const bounds = tempLayer.getBounds();
      return bounds.getCenter();
    } catch (error) {
      console.error("Error calculating feature center:", error);
      return null;
    }
  };

  const addCountLabel = (feature: GeoJSONFeature, desaData: Desa) => {
    if (!map) return;
    
    const center = getFeatureCenter(feature);
    if (!center) return;

    const color = selectedWilayah?.code === "Banyuwangi" ? 'blue' : 'green';
    
    L.marker(center, {
      icon: L.divIcon({
        className: 'map-label',
        html: `<div style="
          background: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid ${color};
          font-weight: bold;
          color: ${color};
        ">${desaData.count}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
    }).addTo(map);
  };

  const getStyle = (feature: GeoJSONFeature | undefined): L.PathOptions => {
    const desaData = feature ? getDesaData(feature) : undefined;
    const baseColor = selectedWilayah?.code === "Banyuwangi" ? "blue" : "green";
    
    return {
      color: "#333",
      weight: 1,
      fillColor: desaData ? (baseColor === "blue" ? "lightblue" : "lightgreen") : "#CCCCCC",
      fillOpacity: 0.5
    };
  };

  useEffect(() => {
    if (!map || !selectedWilayah) return;

    geoJSONLayer?.remove();

    const view = selectedWilayah.code === "Banyuwangi" ? banyuwangiView : malukuTengahView;
    map.setView(view, 10);

    const fetchGeoJSON = async () => {
      const endpoint = selectedWilayah.code === "Banyuwangi"
        ? "/api/geojson/banyuwangi"
        : "/api/geojson/maluku-tengah";
      try {
        const response = await fetch(endpoint);
        const geoJSONData = await response.json();

        const newGeoJSONLayer = L.geoJSON(geoJSONData, {
          style: (feature) => getStyle(feature),
          onEachFeature: (feature: GeoJSONFeature, layer: L.Layer) => {
            const desaData = getDesaData(feature);
            layer.bindPopup(popupContent(feature, desaData));
            
            if (desaData) {
              addCountLabel(feature, desaData);
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
  }, [map, selectedWilayah, dataMap]);

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
      <div 
        id="map-persebaran-balita-berdasarkan-wilayah" 
        style={{ height: "100vh", width: "100%", zIndex: 1 }} 
      />
      <div className="flex gap-4 mt-4">
        {/* <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
          <p className="text-dark">Wilayah dengan data</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-500"></div>
          <p className="text-dark">Wilayah tanpa data</p>
        </div> */}
      </div>
    </div>
  );
};

export default MapPersebaranBalitaBerdasarkanWIlayah;