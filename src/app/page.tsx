import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import ECommerce from "@/components/Dashboard/E-commerce";

export const metadata: Metadata = {
  title:
    "Puspadaya",
  description: "Puspadaya",
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