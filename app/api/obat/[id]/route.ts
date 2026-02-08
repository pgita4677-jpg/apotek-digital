import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, category, price, stock, expired_date } = body;

  // ambil id terakhir
  const [last]: any = await pool.query(
    "SELECT id FROM obat ORDER BY id DESC LIMIT 1"
  );

  const nextId = last.length > 0 ? last[0].id + 1 : 1;
  const code = `OBT-${String(nextId).padStart(4, "0")}`;

  await pool.query(
    `INSERT INTO obat (code, name, category, price, stock, expired_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [code, name, category, price, stock, expired_date]
  );

  return NextResponse.json({ message: "Obat berhasil ditambahkan" });
}
