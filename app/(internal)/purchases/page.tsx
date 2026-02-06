"use client";

import { useEffect, useState } from "react";

type PurchaseItem = {
  name: string;
  qty: number;
  price: number;
};

type Purchase = {
  id: number;
  date: string;
  supplier: string;
  total: number;
  items: PurchaseItem[];
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/purchases")
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data purchases:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data purchases...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Purchases</h1>
      <p>Riwayat Pembelian</p>

      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Supplier</th>
            <th>Total</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p, i) => (
            <tr key={p.id}>
              <td>{i + 1}</td>
              <td>{p.date}</td>
              <td>{p.supplier}</td>
              <td>Rp {p.total.toLocaleString("id-ID")}</td>
              <td>
                <button onClick={() => setSelected(p)}>
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL DETAIL */}
      {selected && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Detail Pembelian</h3>
            <p><b>Tanggal:</b> {selected.date}</p>
            <p><b>Supplier:</b> {selected.supplier}</p>

            <table width="100%" border={1} cellPadding={6}>
              <thead>
                <tr>
                  <th>Barang</th>
                  <th>Qty</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {selected.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>Rp {item.price.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: 10 }}>
              <b>Total:</b> Rp {selected.total.toLocaleString("id-ID")}
            </p>

            <button onClick={() => setSelected(null)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  width: 420,
  borderRadius: 6,
};
