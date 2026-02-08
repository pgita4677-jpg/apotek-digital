"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [totalObat, setTotalObat] = useState(0);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalOmzet, setTotalOmzet] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    // total obat
    const obatRes = await fetch("/api/obat");
    const obatData = await obatRes.json();
    setTotalObat(obatData.length);

    // transaksi
    const salesRes = await fetch("/api/sales");
    const salesData = await salesRes.json();

    setTotalTransaksi(salesData.length);

    const omzet = salesData.reduce(
      (sum: number, s: any) => sum + Number(s.total),
      0
    );

    setTotalOmzet(omzet);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1 */}
        <div className="bg-white border rounded-lg p-5 shadow">
          <p className="text-sm text-gray-500">Total Obat</p>
          <p className="text-3xl font-bold mt-2">
            {totalObat}
          </p>
        </div>

        {/* CARD 2 */}
        <div className="bg-white border rounded-lg p-5 shadow">
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <p className="text-3xl font-bold mt-2">
            {totalTransaksi}
          </p>
        </div>

        {/* CARD 3 */}
        <div className="bg-white border rounded-lg p-5 shadow">
          <p className="text-sm text-gray-500">Total Omzet</p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            Rp {totalOmzet.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}
