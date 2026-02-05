"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    // nanti di sini bisa ditambah:
    // localStorage.removeItem("token");
    // cookies.delete("session");

    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col">
      {/* HEADER */}
      <div className="p-6 font-bold text-lg border-b">
        🏥 Apotek Poltekkes
      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded hover:bg-blue-100"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/obat"
          className="block px-4 py-2 rounded hover:bg-blue-100"
        >
          💊 Medicines
        </Link>

        <Link
          href="/sales"
          className="block px-4 py-2 rounded hover:bg-blue-100"
        >
          🧾 Sales 
        </Link>

        <Link
          href="/purchases"
          className="block px-4 py-2 rounded hover:bg-blue-100"
        >
          🧾 Purchases
        </Link>
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
