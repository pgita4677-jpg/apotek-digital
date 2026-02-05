import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT 
      s.id,
      s.date,
      s.total,
      u.name AS cashier
    FROM sales s
    LEFT JOIN users u ON s.user_id = u.id
    ORDER BY s.date DESC
  `);

  return NextResponse.json(rows);
}
