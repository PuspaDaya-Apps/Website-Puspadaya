"use client";
import DashboardAdmin from "./component/DashboardAdmin";
import DashboardAnggotaKader from "./component/DashboardAnggotaKader";
import DashboardDinasKesehatan from "./component/DashboardDinasKesehatan";
import DashboardDinasSosial from "./component/DashboardDinasSosial";
import DashboardKepalaDesa from "./component/DashboardKepalaDesa";
import DashboardTenagaPelaksanaGizi from "./component/DashboardTenagaPelaksanaGizi";


const Dashboard = () => {
  const namaRole = sessionStorage.getItem("user_role");

  if (!namaRole) {
    return <p>Loading...</p>;
  }

  // Normalize role string (handle case sensitivity and variations)
  const normalizedRole = namaRole.trim().toLowerCase();

  if (normalizedRole === "admin" || normalizedRole === "super admin") {
    return <DashboardAdmin />;
  } else if (normalizedRole === "dinas kesehatan") {
    return <DashboardDinasKesehatan />;
  }
  else if (normalizedRole === "dinas sosial") {
    return <DashboardDinasSosial />;
  }
  else if (normalizedRole === "kepala desa") {
    return <DashboardKepalaDesa />;
  }
  else if (normalizedRole === "tpg" || normalizedRole === "tenaga pelaksana gizi") {
    return <DashboardTenagaPelaksanaGizi />;
  }
  else if (normalizedRole === "ketua kader") {
    return <DashboardAnggotaKader />;
  }
  else if (normalizedRole === "kader" || normalizedRole === "anggota kader") {
    return <DashboardAnggotaKader />;
  }
  else if (normalizedRole === "bidan") {
    return <DashboardAnggotaKader />; // Assuming Bidan uses same dashboard
  }
  else {
    return <p>Anda tidak memiliki akses ke dashboard ini.</p>;
  }
};

export default Dashboard;
