"use client";
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Dropdown } from "primereact/dropdown";
import { DesaKader, PersebaranKaderResponse } from "@/types/dashborad";
import { mapPersebaranKader } from "@/app/api/statistik-maps/mapPersebaranKader";

interface Wilayah {
  name: string;
  code: string;
}

const banyuwangiView: L.LatLngTuple = [-8.2192, 114.3691];
const malukuTengahView: L.LatLngTuple = [-3.3746, 128.1228]; 

const MapPersebaranKader: React.FC = () => {
  const wilayah: Wilayah[] = [
    { name: "Banyuwangi", code: "Banyuwangi" },
    { name: "Maluku Tengah", code: "MT" },
  ];

  const [dataMaps, setDataMaps] = useState<DesaKader[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchStuntingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await mapPersebaranKader();
        // console.log("API Response:", result);
        
        if (result.data) {
          const response = result.data as PersebaranKaderResponse;
          if (response.data?.data && Array.isArray(response.data.data)) {
            setDataMaps(response.data.data);
            // setMessage(response.message);
          } else {
            setError("Invalid data structure received from API");
          }
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchStuntingData();
  }, []);


  const provinsi: string = sessionStorage.getItem("nama_provinsi") ?? "";
  const role: string = sessionStorage.getItem("user_role") ?? "";

  const [selectedWilayah, setSelectedWilayah] = useState<Wilayah | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [geoJSONLayer, setGeoJSONLayer] = useState<L.GeoJSON | null>(null);

  useEffect(() => {
    const mapInstance = L.map("map-perseberan-kader").setView(banyuwangiView, 10);
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
    return name.toLowerCase().trim().replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '') 
      .replace(/\bdesa\b/g, '')
      .trim();
  };

  const getDesaKader = (feature: any): DesaKader | undefined => {
    if (!dataMaps || !feature.properties) {
      // console.log("No dataMaps or feature properties");
      return undefined;
    }
    const featureName1 = feature.properties.NAMOBJ || "";
    const featureName2 = feature.properties.WADMKD || "";
    const featureName = featureName1 || featureName2;
    
    // console.log(`Looking for: ${featureName}`);
    
    const match = dataMaps.find(desa => {
      const normalizedDesaName = normalizeName(desa.nama_desa);
      const normalizedFeatureName1 = normalizeName(featureName1);
      const normalizedFeatureName2 = normalizeName(featureName2);
      
      // console.log(`Comparing: ${normalizedDesaName} vs ${normalizedFeatureName1} or ${normalizedFeatureName2}`); // Debug log
      
      return normalizedDesaName === normalizedFeatureName1 || 
             normalizedDesaName === normalizedFeatureName2 ||
             normalizedDesaName.includes(normalizedFeatureName1) ||
             normalizedFeatureName1.includes(normalizedDesaName);
    });
    
    // console.log("Match found:", match); // Debug log
    return match;
  };

  const popupContentKader = (feature: any, desaKader?: DesaKader) => {
    const wilayahName = feature.properties.NAMOBJ || feature.properties.WADMKD || feature.properties.name;
    
    if (desaKader) {
      return `
        <div style="min-width: 150px;">
          <h4 style="margin-bottom: 8px; font-weight: bold;">${wilayahName}</h4>
          <p><strong>Total Kader:</strong> ${desaKader.count_aktif + desaKader.count_tidak_aktif}</p>
          <p><strong>Kader Aktif:</strong> ${desaKader.count_aktif}</p>
          <p><strong>Kader Tidak Aktif:</strong> ${desaKader.count_tidak_aktif}</p>
        </div>
      `;
    }
    
    return `
      <div style="min-width: 150px;">
        <h4 style="margin-bottom: 8px; font-weight: bold;">${wilayahName}</h4>
        <p style="color: #666;">Data kader tidak tersedia</p>
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
          // console.log("GeoJSON loaded:", geoJSONData); // Debug log
          
          const newGeoJSONLayer = L.geoJSON(geoJSONData, {
            style: (feature) => {
              const desaData = getDesaKader(feature);
              if (desaData) {
                const activeRatio = desaData.count_aktif / (desaData.count_aktif + desaData.count_tidak_aktif);
                return {
                  color: "#333",
                  weight: 1,
                  fillColor: activeRatio > 0.5 ? "#4CAF50" : activeRatio > 0 ? "#FFC107" : "#F44336",
                  fillOpacity: 0.7
                };
              }
              return {
                color: "#999",
                weight: 1,
                fillColor: "#DDD",
                fillOpacity: 0.5
              };
            },
            onEachFeature: (feature, layer) => {
              const desaData = getDesaKader(feature);
              layer.bindPopup(popupContentKader(feature, desaData));

              layer.on({
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    weight: 2,
                    color: "#666",
                    fillOpacity: 0.9
                  });
                  layer.bringToFront();
                },
                mouseout: (e) => {
                  const layer = e.target;
                  const desaData = getDesaKader(feature);
                  if (desaData) {
                    const activeRatio = desaData.count_aktif / (desaData.count_aktif + desaData.count_tidak_aktif);
                    layer.setStyle({
                      weight: 1,
                      color: "#333",
                      fillColor: activeRatio > 0.5 ? "#4CAF50" : activeRatio > 0 ? "#FFC107" : "#F44336",
                      fillOpacity: 0.7
                    });
                  } else {
                    layer.setStyle({
                      color: "#333",
                      weight: 1,
                      fillColor: "#DDD",
                      fillOpacity: 0.5
                    });
                  }
                }
              });
            },
          }).addTo(map);

          setGeoJSONLayer(newGeoJSONLayer);
          const bounds = newGeoJSONLayer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds);
          }
        } catch (error) {
          console.error("Error loading GeoJSON:", error);
          setError("Gagal memuat data peta");
        }
      };

      fetchGeoJSON();
    }
  }, [map, selectedWilayah, dataMaps]);

  return (
    <div className="relative">
      <div className="mb-10 flex justify-between">
        <div>
          <h1 className="text-body-2xlg font-bold text-dark dark:text-white">
            Peta Penyebaran Kader Aktif dan Tidak Aktif
          </h1>
          <p className="text-dark">
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
            disabled={role !== "Admin"} 
          />
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-dark">Memuat data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {message && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded-lg">
          {message}
        </div>
      )}

      <div
        id="map-perseberan-kader"
        style={{ height: "70vh", width: "100%", zIndex: 1 }}
      />

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <p className="text-dark">Kader Aktif</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
          <p className="text-dark">Cukup Aktif</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          <p className="text-dark">Kader Tidak Aktif</p>
        </div>
        
      </div>
    </div>
  );
};

export default MapPersebaranKader;