import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// =======================
// GET /api/obat
// =======================
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        code,
        name,
        category,
        price,
        stock,
        expired_date
      FROM medicines
      ORDER BY id DESC
    `);

    // 🔥 PENTING: rows SUDAH ARRAY
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/obat ERROR:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data obat" },
      { status: 500 }
    );
  }
}

// =======================
// POST /api/obat
// =======================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, stock, expired_date } = body;

    if (!name || !category || !price || !expired_date) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    await pool.execute(
      `
      INSERT INTO medicines 
      (name, category, price, stock, expired_date)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, category, price, stock ?? 0, expired_date]
    );

    return NextResponse.json({
      message: "Obat berhasil ditambahkan",
    });
  } catch (error) {
    console.error("POST /api/obat ERROR:", error);
    return NextResponse.json(
      { message: "Gagal menambah obat" },
      { status: 500 }
    );
  }
}
