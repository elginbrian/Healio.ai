import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import User from "@/models/user";
import { IMicrofundingPool, IPoolMember } from "@/types";
import { PoolStatus, PoolMemberRole, ContributionPeriod, ClaimApprovalSystem } from "@/types/enums";
import { customAlphabet } from "nanoid";
import MicrofundingPool from "@/models/microfunding-pool";
import PoolMember from "@/models/pool-member";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, type_of_community, max_members, contribution_period, contribution_amount_per_member, benefit_coverage, claim_voting_duration } = body;

    if (!title || !description || !type_of_community || !max_members || !contribution_period || !contribution_amount_per_member) {
      return NextResponse.json({ success: false, message: "Semua field wajib diisi: judul, deskripsi, jenis komunitas, maks anggota, periode dan jumlah kontribusi." }, { status: 400 });
    }
    if (max_members <= 0) {
      return NextResponse.json({ success: false, message: "Jumlah maksimal anggota harus lebih besar dari 0." }, { status: 400 });
    }
    if (contribution_amount_per_member < 0) {
      return NextResponse.json({ success: false, message: "Jumlah iuran tidak boleh negatif." }, { status: 400 });
    }
    if (!Object.values(ContributionPeriod).includes(contribution_period as ContributionPeriod)) {
      return NextResponse.json({ success: false, message: "Periode kontribusi tidak valid." }, { status: 400 });
    }

    const pool_code = nanoid();

    const newPoolData: Partial<IMicrofundingPool> = {
      creator_user_id: userId as any,
      title,
      description,
      pool_code,
      type_of_community,
      max_members,
      contribution_period,
      contribution_amount_per_member,
      benefit_coverage: Array.isArray(benefit_coverage) ? benefit_coverage : [],
      claim_voting_duration,
      goal_amount: 0,
      current_amount: 0,
      status: PoolStatus.OPEN,
      created_date: new Date().toISOString(),
    };

    const newPool = new MicrofundingPool(newPoolData);
    await newPool.save();

    const adminMember: Partial<IPoolMember> = {
      pool_id: newPool._id as any,
      user_id: userId as any,
      role: PoolMemberRole.ADMIN,
      joined_date: new Date().toISOString(),
    };
    const newAdmin = new PoolMember(adminMember);
    await newAdmin.save();

    return NextResponse.json(
      {
        success: true,
        message: "Pool berhasil dibuat!",
        pool: {
          _id: newPool._id.toString(),
          title: newPool.title,
          pool_code: newPool.pool_code,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE_POOL_ERROR:", error);
    if (error.code === 11000 && error.keyPattern?.pool_code) {
      return NextResponse.json({ success: false, message: "Gagal menghasilkan kode pool unik, coba lagi." }, { status: 500 });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json({ success: false, message: messages.join(", ") }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
