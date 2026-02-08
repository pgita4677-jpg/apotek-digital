import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export async function POST(req: Request) {
  const { supplier_id, date, details } = await req.json();

  if (!supplier_id || !date || !details?.length) {
    return NextResponse.json(
      { message: "Data tidak lengkap" },
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. insert purchases
    const [purchase] = await conn.query<any>(
      "INSERT INTO purchases (supplier_id, date, total) VALUES (?, ?, 0)",
      [supplier_id, date]
    );

    const purchaseId = purchase.insertId;
    let total = 0;

    // 2. insert details + update stock
    for (const d of details) {
      if (!d.medicine_id || d.qty <= 0 || d.price <= 0) {
        throw new Error("Detail purchase tidak valid");
      }

      await conn.query(
        `INSERT INTO purchase_details 
         (purchase_id, medicine_id, qty, price)
         VALUES (?, ?, ?, ?)`,
        [purchaseId, d.medicine_id, d.qty, d.price]
      );

      // 🔥 UPDATE STOK OBAT
      await conn.query(
        `UPDATE medicines 
         SET stock = stock + ? 
         WHERE id = ?`,
        [d.qty, d.medicine_id]
      );

      total += d.qty * d.price;
    }

    // 3. update total
    await conn.query(
      "UPDATE purchases SET total = ? WHERE id = ?",
      [total, purchaseId]
    );

    await conn.commit();

    return NextResponse.json({ message: "Purchase berhasil" });
  } catch (err: any) {
    await conn.rollback();
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  } finally {
    conn.release();
  }
}
