import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE, // apotek_db
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const add_stock = Number(body.add_stock);

    console.log("PATCH ID:", id);
    console.log("ADD STOCK:", add_stock);

    if (!id || !add_stock || add_stock <= 0) {
      return NextResponse.json(
        { message: "Data tidak valid" },
        { status: 400 }
      );
    }

    // ✅ GANTI KE medicines
    const [result]: any = await pool.execute(
      "UPDATE medicines SET stock = stock + ? WHERE id = ?",
      [add_stock, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Obat tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Stok berhasil ditambahkan",
    });
  } catch (error) {
    console.error("ERROR PATCH OBAT:", error);
    return NextResponse.json(
      { message: "Gagal menambah stok" },
      { status: 500 }
    );
  }
}
