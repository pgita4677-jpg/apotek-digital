import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

/* ================= GET ================= */
export async function GET() {
  const [rows] = await pool.query(
    "SELECT * FROM suppliers ORDER BY name"
  );
  return NextResponse.json(rows);
}

/* ================= POST ================= */
export async function POST(req: Request) {
  const { name, phone, address } = await req.json();

  if (!name) {
    return NextResponse.json(
      { message: "Nama supplier wajib diisi" },
      { status: 400 }
    );
  }

  await pool.query(
    "INSERT INTO suppliers (name, phone, address) VALUES (?, ?, ?)",
    [name, phone, address]
  );

  return NextResponse.json({ message: "Supplier berhasil ditambahkan" });
}

/* ================= PUT ================= */
export async function PUT(req: Request) {
  const { id, name, phone, address } = await req.json();

  if (!id || !name) {
    return NextResponse.json(
      { message: "Data tidak lengkap" },
      { status: 400 }
    );
  }

  await pool.query(
    `UPDATE suppliers
     SET name = ?, phone = ?, address = ?
     WHERE id = ?`,
    [name, phone, address, id]
  );

  return NextResponse.json({ message: "Supplier berhasil diupdate" });
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { message: "ID tidak ditemukan" },
      { status: 400 }
    );
  }

  /* ⚠️ Cegah hapus supplier yang sudah dipakai */
  const [check]: any = await pool.query(
    "SELECT id FROM purchases WHERE supplier_id = ? LIMIT 1",
    [id]
  );

  if (check.length > 0) {
    return NextResponse.json(
      { message: "Supplier sudah dipakai di purchases" },
      { status: 409 }
    );
  }

  await pool.query("DELETE FROM suppliers WHERE id = ?", [id]);

  return NextResponse.json({ message: "Supplier berhasil dihapus" });
}
