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

export default function SalesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [paid, setPaid] = useState(0);
  const userId = 1; // sementara (nanti dari login)

  // =====================
  // GET OBAT
  // =====================
  const fetchMedicines = async () => {
    const res = await fetch("/api/obat");
    const data = await res.json();
    setMedicines(data);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // =====================
  // ADD TO CART
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

  // =====================
  // TOTAL
  // =====================
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const change = paid - total;

  // =====================
  // SIMPAN TRANSAKSI
  // =====================
  const saveTransaction = async () => {
    if (cart.length === 0) {
      alert("Cart masih kosong");
      return;
    }

    if (paid < total) {
      alert("Uang bayar kurang");
      return;
    }

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
      alert("Transaksi berhasil disimpan ✅");
      setCart([]);
      setPaid(0);
      fetchMedicines(); // refresh stok
    } else {
      alert("Gagal menyimpan transaksi ❌");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🧾 Penjualan</h2>

      <div className="grid grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
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
                  className="border rounded p-3 text-center shadow-sm"
                >
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm">Rp {m.price}</p>
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

        {/* ================= RIGHT ================= */}
        <div className="border rounded p-4 shadow">
          <h3 className="font-semibold mb-2">Keranjang</h3>

          <table className="w-full text-sm mb-3">
            <thead>
              <tr className="border-b">
                <th>Nama</th>
                <th>Qty</th>
                <th>Subtotal</th>
              </tr>
            </thead>
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

          <p className="font-bold">Total: Rp {total}</p>

          <input
            type="number"
            placeholder="Uang bayar"
            value={paid}
            onChange={e => setPaid(Number(e.target.value))}
            className="w-full p-2 border rounded mt-2"
          />

          <p className="mt-2">
            Kembalian: <b>Rp {change > 0 ? change : 0}</b>
          </p>

          <button
            onClick={saveTransaction}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded"
          >
            💾 Simpan Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}
