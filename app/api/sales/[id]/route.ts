import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const saleId = params.id;

  const [rows] = await pool.query(
    `
    SELECT 
      m.name,
      sd.qty,
      sd.price,
      (sd.qty * sd.price) AS subtotal
    FROM sales_details sd
    JOIN medicines m ON m.id = sd.medicine_id
    WHERE sd.sale_id = ?
    `,
    [saleId]
  );

  return NextResponse.json(rows);
}
