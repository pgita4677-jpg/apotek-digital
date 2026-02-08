import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const [obatRows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS totalObat FROM obat"
    );
    const totalObat = obatRows[0].totalObat as number;

    const [transaksiRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS transaksiHariIni
       FROM transaksi
       WHERE DATE(created_at) = CURDATE()`
    );
    const transaksiHariIni = transaksiRows[0].transaksiHariIni as number;

    const [stokRows] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS stokMenipis FROM obat WHERE stok <= 5"
    );
    const stokMenipis = stokRows[0].stokMenipis as number;

    const [expiredRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS expiredSoon
       FROM obat
       WHERE expired_at <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)`
    );
    const expiredSoon = expiredRows[0].expiredSoon as number;

    return NextResponse.json({
      totalObat,
      transaksiHariIni,
      stokMenipis,
      expiredSoon
    });

  } catch (error) {
    console.error("API DASHBOARD ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data dashboard" },
      { status: 500 }
    );
  }
}
