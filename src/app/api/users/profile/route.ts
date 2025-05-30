import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import jwt from "jsonwebtoken";
import User from "@/models/user";

interface TokenPayload {
  userId: string;
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Akses ditolak: Token tidak ada" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (error) {
      return NextResponse.json({ message: "Akses ditolak: Token tidak valid" }, { status: 401 });
    }
    const { userId } = decoded;

    const profileData = await request.json();

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(userId, profileData, { new: true }).select("-password_hash");

    if (!updatedUser) {
      return NextResponse.json({ message: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profil berhasil diperbarui", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
