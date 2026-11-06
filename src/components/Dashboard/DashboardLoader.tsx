import React from "react";

interface DashboardLoaderProps {
  /**
   * Dibaca screen reader saja, tidak tampil di layar. Loading di dashboard
   * sengaja tanpa teks, tapi pengguna screen reader tetap perlu tahu bahwa
   * halaman sedang memuat.
   */
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<DashboardLoaderProps["size"]>, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-14 w-14 border-4",
};

const PADDING_CLASS: Record<NonNullable<DashboardLoaderProps["size"]>, string> = {
  sm: "py-4",
  md: "py-10",
  lg: "py-24",
};

const DashboardLoader: React.FC<DashboardLoaderProps> = ({
  label = "Memuat data",
  size = "lg",
  className = "",
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full items-center justify-center ${PADDING_CLASS[size]} ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-solid border-primary border-t-transparent ${SIZE_CLASS[size]}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default DashboardLoader;
