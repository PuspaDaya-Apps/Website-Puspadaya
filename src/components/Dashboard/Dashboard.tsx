"use client";

import DashboardAdmin from "./component/Dashboardadmin";
import DashboardKtuaKader from "./component/DashboardKtuaKader";

const Dashboard = () => {
  const namaRole = sessionStorage.getItem("user_role");

  if (namaRole === "Admin") {
    return <DashboardAdmin />;
  } else if (namaRole === "Kader") {
    return <DashboardKtuaKader />;
  } else {
    return <p>Anda tidak memiliki akses ke dashboard ini.</p>;
  }
};

export default Dashboard;
