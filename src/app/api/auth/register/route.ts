import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import { Gender } from "@/types/enums";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Nama, email, dan password wajib diisi." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password minimal harus 6 karakter." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password_hash: hashedPassword,
    });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    return NextResponse.json({ message: "Registrasi berhasil. Silakan login.", user: userResponse }, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
