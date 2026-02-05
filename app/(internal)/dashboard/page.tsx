import {
  Pill,
  ShoppingCart,
  AlertTriangle,
  CalendarClock
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6">
        <h1 className="text-3xl font-semibold text-sky-800">
          Dashboard
        </h1>
        <p className="text-sky-500 mt-1">
          Ringkasan sistem informasi apotek
        </p>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOTAL OBAT */}
        <div className="rounded-2xl bg-white/70 backdrop-blur border border-sky-100 p-6 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Obat</p>
            <Pill className="w-5 h-5 text-sky-500" />
          </div>
          <h2 className="text-3xl font-semibold text-sky-600 mt-3">
            120
          </h2>
        </div>

        {/* TRANSAKSI */}
        <div className="rounded-2xl bg-white/70 backdrop-blur border border-sky-100 p-6 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Transaksi Hari Ini</p>
            <ShoppingCart className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-3xl font-semibold text-blue-600 mt-3">
            25
          </h2>
        </div>

        {/* STOK MENIPIS */}
        <div className="rounded-2xl bg-white/70 backdrop-blur border border-sky-100 p-6 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Obat Hampir Habis</p>
            <AlertTriangle className="w-5 h-5 text-sky-400" />
          </div>
          <h2 className="text-3xl font-semibold text-sky-500 mt-3">
            8
          </h2>
        </div>

        {/* EXPIRED */}
        <div className="rounded-2xl bg-white/70 backdrop-blur border border-sky-100 p-6 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Mendekati Expired</p>
            <CalendarClock className="w-5 h-5 text-sky-600" />
          </div>
          <h2 className="text-3xl font-semibold text-sky-700 mt-3">
            3
          </h2>
        </div>

      </div>

      {/* SECTION BAWAH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* INFO */}
        <div className="rounded-2xl bg-white/70 backdrop-blur border border-sky-100 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-sky-700">
            Informasi Sistem
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Kelola data obat dengan mudah</li>
            <li>• Pantau stok dan tanggal kadaluarsa</li>
            <li>• Catat transaksi pembelian & penjualan</li>
            <li>• Lihat laporan transaksi</li>
          </ul>
        </div>

        {/* AKTIVITAS */}
        <div className="rounded-2xl bg-white/70 backdrop-blur border border-sky-100 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-sky-700">
            Aktivitas Hari Ini
          </h3>
          <p className="text-sm text-gray-500 italic">
            Belum ada aktivitas terbaru
          </p>
        </div>

      </div>

    </div>
  );
}
