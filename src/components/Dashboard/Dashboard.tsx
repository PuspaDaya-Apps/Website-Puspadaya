"use client";


import DashboardAdmin from "./component/DashboardAdmin";
import DashboardDinasKesehatan from "./component/DashboardDinasKesehatan";
import DashboardDinasSosial from "./component/DashboardDinasSosial";
import DashboardKepalaDesa from "./component/DashboardKepalaDesa";
import DashboardKetuaKader from "./component/DashboardKetuaKader";
import DashboardTenagaPelaksanaGizi from "./component/DashboardTenagaPelaksanaGizi";


const Dashboard = () => {
  const namaRole = sessionStorage.getItem("user_role");

  if (namaRole === "Admin") {
    return <DashboardAdmin />;
  } else if (namaRole === "Dinas Kesehatan") {
     return <DashboardDinasKesehatan />;
  }
   else if (namaRole === "Dinas Sosial") {
     return <DashboardDinasSosial/>;
  }
   else if (namaRole === "Kepala Desa") {
     return <DashboardKepalaDesa/>;
  }
  else if (namaRole === "TPG") {
     return <DashboardTenagaPelaksanaGizi/>;
  }
   else if (namaRole === "Ketua Kader") {
     return <DashboardKetuaKader/>;
  }
    else if (namaRole === "Kader") {
     return <DashboardKetuaKader/>;
  }
  else {
    return <p>Anda tidak memiliki akses ke dashboard ini.</p>;
  }
};

export default Dashboard;
