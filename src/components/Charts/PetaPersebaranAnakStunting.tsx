"use client";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dropdown } from "primereact/dropdown";
import { DesaData, MapPersebaranResponse } from "@/types/dashborad";
import { mapStunting } from "@/app/api/statistik-maps/mapStunting";

interface Wilayah {
  name: string;
  code: string;
}

const banyuwangiView: L.LatLngTuple = [-8.2192, 114.3691];
const malukuTengahView: L.LatLngTuple = [-3.3746, 128.1228];

const PetaPersebaranAnakStunting: React.FC = () => {
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Banyuwangi" },
    { name: "Maluku Tengah", code: "MT" },
  ];

  const [dataMap, setDataMap] = useState<DesaData[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStuntingData = async () => {
      setLoading(true);
      const result = await mapStunting();
      if (result.data) {
        const response = result.data as MapPersebaranResponse;
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

  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null);

  useEffect(() => {
    const mapInstance = L.map("map-balita-stunting").setView(banyuwangiView, 10);
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

  const getDesaData = (feature: any): DesaData | undefined => {
    if (!dataMap || !feature.properties) return undefined;

    return dataMap.find(desa => {
      const normalizedDesaName = normalizeName(desa.nama_desa);
      const normalizedFeatureName1 = normalizeName(feature.properties.NAMOBJ || "");
      const normalizedFeatureName2 = normalizeName(feature.properties.WADMKD || "");

      return normalizedDesaName === normalizedFeatureName1 ||
        normalizedDesaName === normalizedFeatureName2;
    });
  };

  const getColorForPercentage = (percentage: number): string => {
    if (percentage <= 25) return '#00FF00';//  Green
    if (percentage <= 50) return '#FFFF00'; // Yellow
    if (percentage <= 75) return '#FFA500'; // Orange
    return '#FF0000'; // Red
  };

  const popupContent = (feature: any, desaData?: DesaData) => {
    if (desaData) {
      const totalChildren = desaData.count_stunting + desaData.count_wasting + desaData.count_gizi_baik;
      const stuntingPercentage = totalChildren > 0 ? Math.round((desaData.count_stunting / totalChildren) * 100) : 0;
      const wastingPercentage = totalChildren > 0 ? Math.round((desaData.count_wasting / totalChildren) * 100) : 0;
      const giziBaikPercentage = totalChildren > 0 ? Math.round((desaData.count_gizi_baik / totalChildren) * 100) : 0;

      return `
        <div>
          <p><strong>Wilayah:</strong> ${feature.properties.NAMOBJ || feature.properties.WADMKD || feature.properties.name}</p>
          <p><strong>Total Anak:</strong> ${totalChildren}</p>
          <p><strong>Anak Stunting:</strong> ${desaData.count_stunting} (${stuntingPercentage}%)</p>
          <p><strong>Anak Wasting:</strong> ${desaData.count_wasting} (${wastingPercentage}%)</p>
          <p><strong>Anak Gizi Baik:</strong> ${desaData.count_gizi_baik} (${giziBaikPercentage}%)</p>
        </div>
      `;
    }
    return `
      <div>
        <p><strong>Wilayah:</strong> ${feature.properties.NAMOBJ || feature.properties.WADMKD || feature.properties.name}</p>
        <p>Data stunting tidak tersedia</p>
      </div>
    `;
  };

  useEffect(() => {
    if (map && selectedWilayah) {
      geoJSONLayer?.remove();

      const view = selectedWilayah.code === "Banyuwangi" ? banyuwangiView : malukuTengahView;
      map.setView(view, 10);

      const fetchGeoJSON = async () => {
        const endpoint = selectedWilayah.code === "Banyuwangi"
          ? "/api/geojson/banyuwangi"
          : "/api/geojson/maluku-tengah";
        try {
          const response = await fetch(endpoint);
          const geoJSONData: any = await response.json();

          const newGeoJSONLayer = L.geoJSON(geoJSONData, {
            style: (feature) => {
              const desaData = getDesaData(feature);
              
              if (desaData) {
                const totalChildren = desaData.count_stunting + desaData.count_wasting + desaData.count_gizi_baik;
                const stuntingWastingPercentage = totalChildren > 0
                  ? Math.round(((desaData.count_stunting + desaData.count_wasting) / totalChildren) * 100)
                  : 0;

                const fillColor = getColorForPercentage(stuntingWastingPercentage);

                return {
                  color: "#333",
                  weight: 1,
                  fillColor: fillColor,
                  fillOpacity: 0.7
                };
              }
              
              return {
                color: "#999", 
                weight: 1,
                fillColor: "#CCCCCC",
                fillOpacity: 0.5
              };
            },
            onEachFeature: (feature, layer) => {
              const desaData = getDesaData(feature);
              layer.bindPopup(popupContent(feature, desaData));
              
              layer.on({
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 2,
                    fillOpacity: 0.9
                  });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  const desaData = getDesaData(feature);
                  if (desaData) {
                    const totalChildren = desaData.count_stunting + desaData.count_wasting + desaData.count_gizi_baik;
                    const stuntingWastingPercentage = totalChildren > 0
                      ? Math.round(((desaData.count_stunting + desaData.count_wasting) / totalChildren) * 100)
                      : 0;
                    const fillColor = getColorForPercentage(stuntingWastingPercentage);
                    layer.setStyle({
                      weight: 1,
                      fillColor: fillColor,
                      fillOpacity: 0.7
                    });
                  } else {
                    layer.setStyle({
                      weight: 1,
                      fillColor: "#CCCCCC",
                      fillOpacity: 0.5
                    });
                  }
                }
              });
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
  }, [map, selectedWilayah, dataMap]);

  return (
    <div className="">
      <div className="mb-10 flex justify-between">
        <div className="">
          <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
            Peta Penyebaran Anak Stunting
          </h1>
          <p className="text-dark">
            Peta penyebaran stunting dan gizi baik pada Anak
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
        id="map-balita-stunting"
        style={{ height: "100vh", width: "100%", zIndex: 1 }}
      />

      <div className="flex gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <p className="text-dark">Rendah / Aman</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
          <p className="text-dark">Waspada</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-orange-500"></div>
          <p className="text-dark">Tinggi</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          <p className="text-dark">Sangat Tinggi / Darurat</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <p className="text-dark">Data Tidak Tersedia</p>
        </div>
      </div>
    </div>
  );
};

export default PetaPersebaranAnakStunting;