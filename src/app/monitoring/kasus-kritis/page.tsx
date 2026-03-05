"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { CriticalChild } from "@/types/dashboard-kepala-desa";
import { criticalChildrenData } from "@/data/dummy-dashboard-kepala-desa";
import WhatsAppButton from "@/components/Dashboard/component-desa/WhatsAppButton";
import { WHATSAPP_TEMPLATES } from "@/types/whatsapp";

const KasusKritisPage: React.FC = () => {
  const [filterPosyandu, setFilterPosyandu] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPrioritas, setFilterPrioritas] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChild, setSelectedChild] = useState<CriticalChild | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get unique posyandu names for filter
  const posyanduList = useMemo(() => {
    return Array.from(new Set(criticalChildrenData.map((c) => c.posyandu_nama)));
  }, []);

  // Filter children
  const filteredChildren = useMemo(() => {
    return criticalChildrenData.filter((child) => {
      const matchPosyandu =
        filterPosyandu === "all" || child.posyandu_nama === filterPosyandu;
      const matchStatus =
        filterStatus === "all" ||
        child.status_gizi === filterStatus ||
        (filterStatus === "stunting" && child.status_stunting === "Stunting");
      const matchPrioritas =
        filterPrioritas === "all" || child.prioritas === filterPrioritas;
      const matchSearch =
        child.nama_anak.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.nama_ibu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.dusun.toLowerCase().includes(searchTerm.toLowerCase());
      return matchPosyandu && matchStatus && matchPrioritas && matchSearch;
    });
  }, [filterPosyandu, filterStatus, filterPrioritas, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: criticalChildrenData.length,
      gizi_buruk: criticalChildrenData.filter((c) => c.status_gizi === "Gizi Buruk").length,
      gizi_kurang: criticalChildrenData.filter((c) => c.status_gizi === "Gizi Kurang").length,
      stunting: criticalChildrenData.filter((c) => c.status_stunting === "Stunting").length,
      sangat_tinggi: criticalChildrenData.filter((c) => c.prioritas === "Sangat Tinggi").length,
      tinggi: criticalChildrenData.filter((c) => c.prioritas === "Tinggi").length,
      sedang: criticalChildrenData.filter((c) => c.prioritas === "Sedang").length,
    };
  }, []);

  // Get priority color
  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case "Sangat Tinggi":
        return "bg-red-500";
      case "Tinggi":
        return "bg-orange-500";
      case "Sedang":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get status badge color
  const getStatusColor = (status_gizi: string) => {
    switch (status_gizi) {
      case "Gizi Buruk":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Gizi Kurang":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "Gizi Baik":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate age from tanggal_lahir
  const calculateAge = (tanggal_lahir: string) => {
    const birthDate = new Date(tanggal_lahir);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    return months;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white md:text-3xl">
            ⚠️ Daftar Kasus Kritis
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Monitoring anak dengan gizi buruk dan stunting
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        <div className="rounded-xl bg-blue-50 p-4 text-center dark:bg-blue-900/20">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Kasus</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.gizi_buruk}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Gizi Buruk</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-900/20">
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.gizi_kurang}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Gizi Kurang</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-900/20">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.stunting}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Stunting</p>
        </div>
        <div className="rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.sangat_tinggi}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Prioritas Sangat Tinggi</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-orange-900/20">
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.tinggi}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Prioritas Tinggi</p>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.sedang}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Prioritas Sedang</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-dark">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              🔍 Cari
            </label>
            <input
              type="text"
              placeholder="Nama anak, ibu, atau dusun..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-9 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              🏠 Posyandu
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={filterPosyandu}
              onChange={(e) => setFilterPosyandu(e.target.value)}
            >
              <option value="all">Semua Posyandu</option>
              {posyanduList.map((posyandu) => (
                <option key={posyandu} value={posyandu}>
                  {posyandu}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              📊 Status
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="Gizi Buruk">Gizi Buruk</option>
              <option value="Gizi Kurang">Gizi Kurang</option>
              <option value="stunting">Stunting</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              ⚡ Prioritas
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-dark outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              value={filterPrioritas}
              onChange={(e) => setFilterPrioritas(e.target.value)}
            >
              <option value="all">Semua Prioritas</option>
              <option value="Sangat Tinggi">Sangat Tinggi</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Children List */}
      <div className="rounded-xl bg-white shadow-md dark:bg-gray-dark">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Prioritas</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Anak</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Usia</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Posyandu/Dusun</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Pengukuran</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredChildren.map((child) => (
                <tr key={child.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${getPriorityColor(child.prioritas)}`}></div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{child.prioritas}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-dark dark:text-white">{child.nama_anak}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ibu: {child.nama_ibu}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {calculateAge(child.tanggal_lahir)} bulan
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white">{child.posyandu_nama}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">📍 {child.dusun}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>BB: {child.berat_badan}kg</p>
                      <p>TB: {child.tinggi_badan}cm</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(child.status_gizi)}`}>
                        {child.status_gizi}
                      </span>
                      {child.status_stunting === "Stunting" && (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          Stunting
                        </span>
                      )}
                      {child.status_wasting === "Wasting" && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Wasting
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedChild(child);
                          setShowModal(true);
                        }}
                        className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                      >
                        Detail
                      </button>
                      <WhatsAppButton
                        phoneNumber="081234567890"
                        recipientName={child.nama_ibu}
                        template={WHATSAPP_TEMPLATES.find(t => t.id === "critical_alert")}
                        templateData={{
                          jenis_alert: "Kasus Gizi Buruk",
                          nama_penerima: child.nama_ibu,
                          jenis_kasus: child.status_gizi,
                          nama_anak: child.nama_anak,
                          usia: calculateAge(child.tanggal_lahir).toString(),
                          nama_posyandu: child.posyandu_nama,
                          detail_kasus: `BB: ${child.berat_badan}kg, TB: ${child.tinggi_badan}cm`,
                          prioritas: child.prioritas,
                          tindakan: child.prioritas === "Sangat Tinggi"
                            ? "1. Kunjungan rumah hari ini\n2. Rujuk ke puskesmas\n3. Berikan makanan tambahan"
                            : "1. Kunjungan rumah minggu ini\n2. Monitoring gizi\n3. Berikan makanan tambahan",
                        }}
                        buttonVariant="secondary"
                        iconOnly
                        buttonText=""
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredChildren.length === 0 && (
          <div className="py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Tidak ada data yang sesuai dengan filter</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-dark">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">{selectedChild.nama_anak}</h2>
                <p className="text-gray-600 dark:text-gray-400">NIK: {selectedChild.nik_anak}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Personal Info */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">📋 Informasi Pribadi</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tanggal Lahir</span>
                    <span className="font-medium text-dark dark:text-white">{formatDate(selectedChild.tanggal_lahir)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Usia</span>
                    <span className="font-medium text-dark dark:text-white">{calculateAge(selectedChild.tanggal_lahir)} bulan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Jenis Kelamin</span>
                    <span className="font-medium text-dark dark:text-white">{selectedChild.jenis_kelamin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Nama Ibu</span>
                    <span className="font-medium text-dark dark:text-white">{selectedChild.nama_ibu}</span>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">📍 Lokasi</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Posyandu</span>
                    <span className="font-medium text-dark dark:text-white">{selectedChild.posyandu_nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dusun</span>
                    <span className="font-medium text-dark dark:text-white">{selectedChild.dusun}</span>
                  </div>
                </div>
              </div>

              {/* Measurement Info */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">📏 Pengukuran Terakhir</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Berat Badan</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{selectedChild.berat_badan} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tinggi Badan</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{selectedChild.tinggi_badan} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tanggal</span>
                    <span className="font-medium text-dark dark:text-white">{formatDate(selectedChild.tanggal_pengukuran)}</span>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <h3 className="mb-3 text-lg font-semibold text-dark dark:text-white">⚕️ Status Kesehatan</h3>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedChild.status_gizi)}`}>
                      {selectedChild.status_gizi}
                    </span>
                    {selectedChild.status_stunting === "Stunting" && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        🦴 Stunting
                      </span>
                    )}
                    {selectedChild.status_wasting === "Wasting" && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        📉 Wasting
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Prioritas: </span>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                      selectedChild.prioritas === "Sangat Tinggi"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : selectedChild.prioritas === "Tinggi"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(selectedChild.prioritas)}`}></div>
                      {selectedChild.prioritas}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton
                phoneNumber="081234567890"
                recipientName={selectedChild.nama_ibu}
                template={WHATSAPP_TEMPLATES.find(t => t.id === "critical_alert")}
                templateData={{
                  jenis_alert: "Kasus Gizi Buruk",
                  nama_penerima: selectedChild.nama_ibu,
                  jenis_kasus: selectedChild.status_gizi,
                  nama_anak: selectedChild.nama_anak,
                  usia: calculateAge(selectedChild.tanggal_lahir).toString(),
                  nama_posyandu: selectedChild.posyandu_nama,
                  detail_kasus: `BB: ${selectedChild.berat_badan}kg, TB: ${selectedChild.tinggi_badan}cm`,
                  prioritas: selectedChild.prioritas,
                  tindakan: selectedChild.prioritas === "Sangat Tinggi"
                    ? "1. Kunjungan rumah hari ini\n2. Rujuk ke puskesmas\n3. Berikan makanan tambahan"
                    : "1. Kunjungan rumah minggu ini\n2. Monitoring gizi\n3. Berikan makanan tambahan",
                }}
                buttonVariant="primary"
                buttonText="📱 Kirim WhatsApp ke Ibu"
                className="flex-1"
              />
              <button className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700">
                📋 Buat Rujukan Puskesmas
              </button>
              <button className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
                🏠 Jadwalkan Kunjungan Rumah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KasusKritisPage;
