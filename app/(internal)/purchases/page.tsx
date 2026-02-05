"use client";

import { useState } from "react";

export default function PembelianPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transaksi Pembelian</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-sky-500 text-white px-4 py-2 rounded-lg"
        >
          + Tambah Pembelian
        </button>
      </div>

      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">2025-02-01</td>
              <td className="p-3">PT Sehat Selalu</td>
              <td className="p-3">Rp 1.200.000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Tambah Pembelian</h2>

            <input
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Supplier"
            />
            <input
              type="date"
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              type="number"
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Total"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>Batal</button>
              <button className="bg-sky-500 text-white px-4 py-2 rounded">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
