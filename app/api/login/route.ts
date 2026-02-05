import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import {pool} from "@/lib/db";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const [rows]: any = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { message: "Email tidak ditemukan" },
      { status: 401 }
    );
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return NextResponse.json(
      { message: "Password salah" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Login berhasil",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}
