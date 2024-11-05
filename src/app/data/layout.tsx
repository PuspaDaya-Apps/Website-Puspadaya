import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default Layout;

