import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

/* ===================== GET ===================== */
export async function GET() {
  const [rows] = await pool.query(
    "SELECT * FROM medicines ORDER BY id DESC"
  );
  return NextResponse.json(rows);
}

/* ===================== POST ===================== */
export async function POST(req: Request) {
  try {
    const { name, category, price, stock, expired_date } =
      await req.json();

    /* 🔹 AMBIL KODE TERAKHIR */
    const [last] = await pool.query<any[]>(
      `
      SELECT code
      FROM medicines
      WHERE code IS NOT NULL
      ORDER BY id DESC
      LIMIT 1
      `
    );

    let nextNumber = 1;

    if (last.length > 0) {
      nextNumber =
        parseInt(last[0].code.replace("OBT", "")) + 1;
    }

    const code = `OBT${String(nextNumber).padStart(4, "0")}`;

    /* 🔹 INSERT LENGKAP (WAJIB ADA CODE) */
    await pool.execute(
      `
      INSERT INTO medicines
      (code, name, category, price, stock, expired_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [code, name, category, price, stock, expired_date]
    );

    return NextResponse.json({
      message: "Obat berhasil ditambahkan",
      code,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
