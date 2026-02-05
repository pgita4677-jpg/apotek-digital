"use client";

import { useEffect, useState } from "react";

type Sale = {
  id: number;
  date: string;
  total: number;
  cashier: string;
};

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/sales/history")
      .then(res => res.json())
      .then(setSales);
  }, []);

  const openDetail = async (id: number) => {
    setSelectedId(id);
    const res = await fetch(`/api/sales/${id}`);
    const data = await res.json();
    setDetails(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Riwayat Penjualan</h2>

      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tanggal</th>
            <th>Kasir</th>
            <th>Total</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{new Date(s.date).toLocaleString()}</td>
              <td>{s.cashier}</td>
              <td>Rp {s.total}</td>
              <td>
                <button onClick={() => openDetail(s.id)}>
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedId && (
        <div style={{ marginTop: 30 }}>
          <h3>🧾 Detail Transaksi #{selectedId}</h3>
          <table width="100%" border={1} cellPadding={8}>
            <thead>
              <tr>
                <th>Obat</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d, i) => (
                <tr key={i}>
                  <td>{d.name}</td>
                  <td>{d.qty}</td>
                  <td>Rp {d.price}</td>
                  <td>Rp {d.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
