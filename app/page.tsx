import Link from "next/link";

export default function Test() {
  return (
    <div className="h-screen bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl text-center shadow-xl">
        <h1 className="text-4xl font-bold mb-4">💊 Aplikasi Apotek</h1>
        <p className="mb-6 text-white/90">
          Sistem Penjualan & Manajemen Obat
        </p>

        <Link
          href="/login"
          className="inline-block bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-100 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
