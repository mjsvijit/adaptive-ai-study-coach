"use client";
import React, { useEffect, useState } from "react";
// import CheckPermissions from "@/components/common/CheckPermissions";
import { HiOutlineSearch } from "react-icons/hi";
import dynamic from "next/dynamic";
// import { LogisticsStats } from "@/components/dashboard/logistics/LogisticsStats";

// const ShipmentTrendChart = dynamic(
//   () =>
//     import("@/components/dashboard/logistics/ShipmentTrendChart").then(
//       (mod) => mod.ShipmentTrendChart,
//     ),
//   { ssr: false },
// );

// const StatusDistributionChart = dynamic(
//   () =>
//     import("@/components/dashboard/logistics/StatusDistributionChart").then(
//       (mod) => mod.StatusDistributionChart,
//     ),
//   { ssr: false },
// );

export default function Ecommerce() {
  const viewPermissions = localStorage.getItem("token");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return viewPermissions ? (
    <div className="space-y-8 p-0">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s your logistics overview.
          </p>
        </div>

        <div className="relative w-full max-w-sm lg:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <HiOutlineSearch size={20} />
          </span>
          <input
            type="text"
            className="w-full rounded-xl border border-gray-100 bg-white py-3 pl-10 pr-4 text-sm font-medium placeholder-gray-400 outline-none shadow-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white dark:focus:border-indigo-600 dark:focus:ring-indigo-900/40"
            placeholder="Global search..."
          />
        </div>
      </div>

      {/* Top Stat Cards Card Section */}
      {/* <LogisticsStats /> */}

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          {/* <ShipmentTrendChart /> */}
        </div>
        <div className="col-span-12 xl:col-span-5">
          {/* <StatusDistributionChart /> */}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
      <div className="animate-pulse text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        ACCESS DENIED
      </div>
    </div>
  );
}
