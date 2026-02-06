"use client";

import { useEffect, useState } from "react";

type Medicine = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

type CartItem = Medicine & {
  qty: number;
};

type Sale = {
  id: number;
  date: string;
  total: number;
};

type SaleDetail = {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
};

export default function SalesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [paid, setPaid] = useState(0);

  const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleDetails, setSaleDetails] = useState<SaleDetail[]>([]);

  const userId = 1;

  // =====================
  // FETCH DATA
  // =====================
  const fetchMedicines = async () => {
    const res = await fetch("/api/obat");
    const data = await res.json();
    setMedicines(data);
  };

  const fetchSalesHistory = async () => {
    const res = await fetch("/api/sales");
    const data = await res.json();
    setSalesHistory(data);
  };

  const fetchSaleDetails = async (saleId: number) => {
    const res = await fetch(`/api/sales/${saleId}`);
    const data = await res.json();
    setSaleDetails(data);
  };

  useEffect(() => {
    fetchMedicines();
    fetchSalesHistory();
  }, []);

  // =====================
  // CART
  // =====================
  const addToCart = (med: Medicine) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === med.id);
      if (exist) {
        return prev.map(i =>
          i.id === med.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...med, qty: 1 }];
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const change = paid - total;

  // =====================
  // SAVE TRANSACTION
  // =====================
  const saveTransaction = async () => {
    if (cart.length === 0) return alert("Cart kosong");
    if (paid < total) return alert("Uang bayar kurang");

    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        total,
        cart,
      }),
    });

    if (res.ok) {
      alert("Transaksi berhasil");
      setCart([]);
      setPaid(0);
      fetchMedicines();
      fetchSalesHistory();
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* ================= TRANSAKSI ================= */}
      <div>
        <h2 className="text-xl font-bold mb-4">🧾 Penjualan</h2>

        <div className="grid grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="col-span-2">
            <input
              className="w-full p-2 border rounded mb-4"
              placeholder="Cari obat..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-4">
              {medicines
                .filter(m =>
                  m.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(m => (
                  <div
                    key={m.id}
                    className="border rounded p-3 text-center"
                  >
                    <p className="font-semibold">{m.name}</p>
                    <p>Rp {m.price}</p>
                    <p className="text-xs text-gray-500">
                      Stok: {m.stock}
                    </p>
                    <button
                      onClick={() => addToCart(m)}
                      className="mt-2 w-full bg-blue-500 text-white rounded py-1"
                    >
                      + Tambah
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Keranjang</h3>

            <table className="w-full text-sm">
              <tbody>
                {cart.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>Rp {item.qty * item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-2 font-bold">Total: Rp {total}</p>

            <input
              type="number"
              placeholder="Uang bayar"
              value={paid}
              onChange={e => setPaid(Number(e.target.value))}
              className="w-full p-2 border rounded mt-2"
            />

            <p className="mt-1">
              Kembalian: Rp {change > 0 ? change : 0}
            </p>

            <button
              onClick={saveTransaction}
              className="mt-3 w-full bg-green-600 text-white py-2 rounded"
            >
              Simpan Transaksi
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIWAYAT ================= */}
      <div>
        <h3 className="text-lg font-bold mb-3">📜 Riwayat Transaksi</h3>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {salesHistory.map(sale => (
              <tr
                key={sale.id}
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => {
                  setSelectedSale(sale);
                  fetchSaleDetails(sale.id);
                }}
              >
                <td className="border p-2">#{sale.id}</td>
                <td className="border p-2">
                  {new Date(sale.date).toLocaleString()}
                </td>
                <td className="border p-2 font-semibold">
                  Rp {sale.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= DETAIL ================= */}
      {selectedSale && (
        <div className="border rounded p-4 bg-gray-50">
          <h4 className="font-bold mb-2">
            Detail Transaksi #{selectedSale.id}
          </h4>

          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Obat</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Harga</th>
                <th className="border p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {saleDetails.map((d, i) => (
                <tr key={i}>
                  <td className="border p-2">{d.name}</td>
                  <td className="border p-2">{d.qty}</td>
                  <td className="border p-2">Rp {d.price}</td>
                  <td className="border p-2 font-semibold">
                    Rp {d.subtotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
