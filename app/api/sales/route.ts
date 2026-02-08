import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// =====================
// GET RIWAYAT SALES
// =====================
export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        id,
        user_id,
        date,
        CAST(total AS UNSIGNED) AS total
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
  const conn = await pool.getConnection();

  try {
    const body = await req.json();
    const { user_id, cart, total } = body;

    // ✅ VALIDASI AMAN
    if (
      user_id === undefined ||
      !Array.isArray(cart) ||
      cart.length === 0 ||
      total === undefined
    ) {
      return NextResponse.json(
        { message: "Data transaksi tidak lengkap" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    // 1️⃣ INSERT SALES
    const [saleResult]: any = await conn.query(
      "INSERT INTO sales (user_id, date, total) VALUES (?, NOW(), ?)",
      [user_id, Number(total)]
    );

    const saleId = saleResult.insertId;

    // 2️⃣ DETAIL + STOK (LOCK)
    for (const item of cart) {
      const qty = Number(item.qty);
      const price = Number(item.price);

      if (qty <= 0 || price <= 0) {
        throw new Error("Qty atau harga tidak valid");
      }

      // 🔒 LOCK STOK
      const [[med]]: any = await conn.query(
        "SELECT stock FROM medicines WHERE id = ? FOR UPDATE",
        [item.id]
      );

      if (!med || med.stock < qty) {
        throw new Error("Stok tidak mencukupi");
      }

      // INSERT DETAIL (TANPA subtotal)
      await conn.query(
        `INSERT INTO sales_details 
         (sale_id, medicine_id, qty, price)
         VALUES (?, ?, ?, ?)`,
        [saleId, item.id, qty, price]
      );

      // UPDATE STOK
      await conn.query(
        "UPDATE medicines SET stock = stock - ? WHERE id = ?",
        [qty, item.id]
      );
    }

    await conn.commit();

    return NextResponse.json({
      success: true,
      sale_id: saleId,
    });
  } catch (err: any) {
    await conn.rollback();
    console.error("POST SALES ERROR:", err);

    return NextResponse.json(
      { message: err.message || "Gagal menyimpan transaksi" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
