import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Dashboard from "@/components/Dashboard/Dashboard";

export const metadata: Metadata = {
  title:
    "Dashboard Puspadaya",
  description: "Dashboard Puspadaya",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </>
  );
}
