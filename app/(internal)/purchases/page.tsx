"use client";

import { useEffect, useState } from "react";

/* ================= TYPES ================= */
type Supplier = {
  id: number;
  name: string;
  phone?: string;
  address?: string;
};

type Medicine = {
  id: number;
  name: string;
  price: number; // 🔹 harga dari database
};

type Detail = {
  medicine_id: number;
  qty: number;
  price: number;
};

/* ================= PAGE ================= */
export default function PurchasesPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  /* pagination supplier */
  const [page, setPage] = useState(1);
  const perPage = 3;

  /* supplier form */
  const [supplierForm, setSupplierForm] = useState({
    id: 0,
    name: "",
    phone: "",
    address: "",
  });

  /* purchase form */
  const [supplierId, setSupplierId] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState<Detail[]>([]);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setSuppliers(await (await fetch("/api/suppliers")).json());
    setMedicines(await (await fetch("/api/obat")).json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= SUPPLIER ================= */
  const submitSupplier = async (e: any) => {
    e.preventDefault();

    await fetch("/api/suppliers", {
      method: supplierForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(supplierForm),
    });

    setSupplierForm({ id: 0, name: "", phone: "", address: "" });
    fetchData();
  };

  const deleteSupplier = async (id: number) => {
    if (!confirm("Hapus supplier ini?")) return;

    const res = await fetch("/api/suppliers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) alert((await res.json()).message);
    fetchData();
  };

  /* ================= PURCHASE ================= */
  const addDetail = () => {
    setDetails([...details, { medicine_id: 0, qty: 1, price: 0 }]);
  };

  const submitPurchase = async () => {
    await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplier_id: supplierId, date, details }),
    });

    alert("Purchase berhasil");
    setSupplierId("");
    setDate("");
    setDetails([]);
  };

  /* ================= TOTAL ================= */
  const totalHarga = details.reduce(
    (sum, d) => sum + d.qty * d.price,
    0
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(suppliers.length / perPage);
  const supplierView = suppliers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Purchases</h1>

      {/* ================= SUPPLIER ================= */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Supplier</h2>

        <form onSubmit={submitSupplier} className="grid grid-cols-4 gap-2">
          <input
            className="border p-2 rounded"
            placeholder="Nama Supplier"
            value={supplierForm.name}
            onChange={(e) =>
              setSupplierForm({ ...supplierForm, name: e.target.value })
            }
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={supplierForm.phone}
            onChange={(e) =>
              setSupplierForm({ ...supplierForm, phone: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Alamat"
            value={supplierForm.address}
            onChange={(e) =>
              setSupplierForm({ ...supplierForm, address: e.target.value })
            }
          />
          <button className="bg-blue-600 text-white rounded">
            {supplierForm.id ? "Update" : "Tambah"}
          </button>
        </form>

        <table className="w-full mt-4">
          <tbody>
            {supplierView.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">
                  <button
                    onClick={() => setSupplierForm(s)}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSupplier(s.id)}
                    className="text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* pagination */}
        <div className="flex gap-2 mt-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <span>{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </section>

      {/* ================= PURCHASE ================= */}
      <section className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold">Input Purchase</h2>

        <select
          className="border p-2 rounded w-full"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          <option value="">Pilih Supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 rounded w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {details.map((d, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            <select
              className="border p-2 rounded"
              onChange={(e) => {
                const med = medicines.find(
                  (m) => m.id === Number(e.target.value)
                );
                const newDetails = [...details];
                newDetails[i].medicine_id = med?.id || 0;
                newDetails[i].price = med?.price || 0;
                setDetails(newDetails);
              }}
            >
              <option value="">Obat</option>
              {medicines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="border p-2 rounded"
              placeholder="Qty"
              value={d.qty}
              onChange={(e) => {
                const newDetails = [...details];
                newDetails[i].qty = Number(e.target.value);
                setDetails(newDetails);
              }}
            />

            <input
              type="number"
              className="border p-2 rounded"
              placeholder="Harga"
              value={d.price}
              readOnly
            />

            <div className="p-2 font-semibold">
              {d.qty * d.price}
            </div>
          </div>
        ))}

        <button onClick={addDetail} className="text-blue-600">
          + Tambah Obat
        </button>

        <div className="text-right font-bold text-lg">
          Total: {totalHarga}
        </div>

        <button
          onClick={submitPurchase}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Simpan Purchase
        </button>
      </section>
    </div>
  );
}
