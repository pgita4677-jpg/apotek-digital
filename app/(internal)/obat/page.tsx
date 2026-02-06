"use client";

import { useEffect, useState } from "react";

type Obat = {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  expired_date: string;
};

const ITEMS_PER_PAGE = 5;

export default function ObatPage() {
  const [data, setData] = useState<Obat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // ===== tambah obat =====
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    harga: "",
    stok: "",
    expired: "",
  });

  // ===== tambah stok =====
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedObat, setSelectedObat] = useState<Obat | null>(null);
  const [addStock, setAddStock] = useState("");

  // =====================
  // FETCH DATA
  // =====================
  const fetchData = async () => {
    const res = await fetch("/api/obat");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================
  // PAGINATION
  // =====================
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // =====================
  // TAMBAH OBAT BARU
  // =====================
  const handleSubmit = async () => {
    if (
      !form.nama ||
      !form.kategori ||
      !form.harga ||
      !form.stok ||
      !form.expired
    ) {
      alert("Semua field wajib diisi");
      return;
    }

    const res = await fetch("/api/obat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.nama,
        category: form.kategori,
        price: Number(form.harga),
        stock: Number(form.stok),
        expired_date: form.expired,
      }),
    });

    if (!res.ok) {
      alert("Gagal menyimpan data");
      return;
    }

    await fetchData();
    setShowModal(false);
    setCurrentPage(1);
    setForm({
      nama: "",
      kategori: "",
      harga: "",
      stok: "",
      expired: "",
    });
  };

  // =====================
  // TAMBAH STOK OBAT
  // =====================
  const handleAddStock = async () => {
    if (!addStock || Number(addStock) <= 0) {
      alert("Jumlah stok tidak valid");
      return;
    }

    const res = await fetch(`/api/obat/${selectedObat?.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        add_stock: Number(addStock),
      }),
    });

    if (!res.ok) {
      alert("Gagal menambah stok");
      return;
    }

    await fetchData();
    setShowStockModal(false);
    setSelectedObat(null);
    setAddStock("");
  };

  return (
    <div className="relative space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Data Obat</h1>
        <p className="text-gray-500">Kelola data obat apotek</p>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg font-medium"
      >
        + Tambah Obat
      </button>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Kode</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-left">Stok</th>
              <th className="p-3 text-left">Expired</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  Belum ada data obat
                </td>
              </tr>
            ) : (
              paginatedData.map((obat) => (
                <tr key={obat.id} className="border-t">
                  <td className="p-3">{obat.code}</td>
                  <td className="p-3">{obat.name}</td>
                  <td className="p-3">{obat.category}</td>
                  <td className="p-3">
                    Rp {obat.price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">{obat.stock}</td>
                  <td className="p-3 text-red-500">
                    {obat.expired_date}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedObat(obat);
                        setAddStock("");
                        setShowStockModal(true);
                      }}
                      className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                    >
                      ➕ Stok
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t text-sm">
            <span className="text-gray-500">
              Halaman {currentPage} dari {totalPages}
            </span>

            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-sky-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH OBAT */}
      {showModal && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-emerald-500 px-6 py-5">
              <h2 className="text-xl font-bold text-white">
                Tambah Data Obat
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Nama Obat"
                value={form.nama}
                onChange={(e) =>
                  setForm({ ...form, nama: e.target.value })
                }
                className="border px-4 py-2 rounded-lg"
              />

              <select
                value={form.kategori}
                onChange={(e) =>
                  setForm({ ...form, kategori: e.target.value })
                }
                className="border px-4 py-2 rounded-lg"
              >
                <option value="">Pilih Kategori</option>
                <option>Tablet / Kapsul / Pil / Kaplet</option>
                <option>Cair (Sirup / Tetes)</option>
                <option>Semi Padat (Salep / Krim / Gel)</option>
                <option>Gas / Inhalasi</option>
              </select>

              <input
                type="number"
                placeholder="Harga"
                value={form.harga}
                onChange={(e) =>
                  setForm({ ...form, harga: e.target.value })
                }
                className="border px-4 py-2 rounded-lg"
              />

              <input
                type="number"
                placeholder="Stok Awal"
                value={form.stok}
                onChange={(e) =>
                  setForm({ ...form, stok: e.target.value })
                }
                className="border px-4 py-2 rounded-lg"
              />

              <input
                type="date"
                value={form.expired}
                onChange={(e) =>
                  setForm({ ...form, expired: e.target.value })
                }
                className="border px-4 py-2 rounded-lg md:col-span-2"
              />
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH STOK */}
      {showStockModal && selectedObat && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl">
            <div className="bg-emerald-600 px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                Tambah Stok Obat
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <input
                disabled
                value={selectedObat.name}
                className="w-full border px-4 py-2 rounded bg-gray-100"
              />
              <input
                disabled
                value={`Stok saat ini: ${selectedObat.stock}`}
                className="w-full border px-4 py-2 rounded bg-gray-100"
              />
              <input
                type="number"
                placeholder="Jumlah tambahan"
                value={addStock}
                onChange={(e) => setAddStock(e.target.value)}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowStockModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleAddStock}
                className="px-4 py-2 bg-emerald-600 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
