"use client";


import DashboardAdmin from "./component/DashboardAdmin";
import DashboardDinasKesehatan from "./component/DashboardDinasKesehatan";


const Dashboard = () => {
  const namaRole = sessionStorage.getItem("user_role");

  if (namaRole === "Admin") {
    return <DashboardAdmin />;
  } else if (namaRole === "Dinas Kesehatan") {
     return <DashboardDinasKesehatan />;
  } else {
    return <p>Anda tidak memiliki akses ke dashboard ini.</p>;
  }
};

export default Dashboard;
