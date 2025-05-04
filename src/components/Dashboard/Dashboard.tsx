"use client";


import DashboardAdmin from "./component/DashboardAdmin";
import DashboardKetuaKader from "./component/DashboardKetuaKader";

const Dashboard = () => {
  const namaRole = sessionStorage.getItem("user_role");

  if (namaRole === "Admin") {
    return <DashboardAdmin />;
  } else if (namaRole === "Ketua Kader") {
     return <DashboardKetuaKader />;
  } else {
    return <p>Anda tidak memiliki akses ke dashboard ini.</p>;
  }
};

export default Dashboard;
