import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// =====================
// GET DATA OBAT
// (dipakai: halaman obat & sales)
// =====================
export async function GET() {
  const [rows] = await pool.query(
    `SELECT id, code, name, category, price, stock, expired_date
     FROM medicines
     ORDER BY id DESC`
  );

  return NextResponse.json(rows);
}

// =====================
// TAMBAH DATA OBAT
// =====================
export async function POST(req: Request) {
  const { name, category, price, stock, expired_date } = await req.json();

  if (!name || !category || !price || !stock || !expired_date) {
    return NextResponse.json(
      { message: "Data tidak lengkap" },
      { status: 400 }
    );
  }

  // insert awal
  const [result]: any = await pool.query(
    `INSERT INTO medicines 
     (code, name, category, price, stock, expired_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ["TEMP", name, category, price, stock, expired_date]
  );

  // generate kode otomatis
  const code = `OBT${result.insertId.toString().padStart(4, "0")}`;

  await pool.query(
    "UPDATE medicines SET code = ? WHERE id = ?",
    [code, result.insertId]
  );

  return NextResponse.json({
    success: true,
    message: "Obat berhasil ditambahkan",
  });
}
