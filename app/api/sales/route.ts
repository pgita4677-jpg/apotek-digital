import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// =====================
// GET RIWAYAT SALES
// =====================
export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT id, user_id, date, total
      FROM sales
      ORDER BY date DESC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET SALES ERROR:", err);
    return NextResponse.json(
      { message: "Gagal mengambil data sales" },
      { status: 500 }
    );
  }
}

// =====================
// SIMPAN TRANSAKSI
// =====================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("DATA MASUK:", body);

    const { user_id, cart, total } = body;

    // VALIDASI WAJIB
    if (!user_id || !cart || cart.length === 0 || !total) {
      return NextResponse.json(
        { message: "Data transaksi tidak lengkap" },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // INSERT SALES
      const [saleResult]: any = await conn.query(
        "INSERT INTO sales (user_id, date, total) VALUES (?, NOW(), ?)",
        [user_id, total]
      );

      const saleId = saleResult.insertId;

      // INSERT DETAIL + UPDATE STOK
      for (const item of cart) {
        await conn.query(
          "INSERT INTO sales_details (sale_id, medicine_id, qty, price) VALUES (?, ?, ?, ?)",
          [saleId, item.id, item.qty, item.price]
        );

        await conn.query(
          "UPDATE medicines SET stock = stock - ? WHERE id = ?",
          [item.qty, item.id]
        );
      }

      await conn.commit();
      conn.release();

      return NextResponse.json({ success: true });
    } catch (err) {
      await conn.rollback();
      conn.release();
      console.error("TRANSACTION ERROR:", err);

      return NextResponse.json(
        { message: "Gagal menyimpan transaksi" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("POST SALES ERROR:", err);
    return NextResponse.json(
      { message: "Request tidak valid" },
      { status: 400 }
    );
  }
}
