import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // ⬇️ WAJIB await params
  const { id } = await params;
  const saleId = Number(id);

  // validasi biar aman
  if (isNaN(saleId)) {
    return NextResponse.json(
      { message: "ID transaksi tidak valid" },
      { status: 400 }
    );
  }

  const [rows] = await pool.query(
    `
    SELECT 
      m.name,
      sd.qty,
      sd.price,
      (sd.qty * sd.price) AS subtotal
    FROM sales_details sd
    JOIN medicines m ON sd.medicine_id = m.id
    WHERE sd.sale_id = ?
    `,
    [saleId]
  );

  return NextResponse.json(rows);
}
