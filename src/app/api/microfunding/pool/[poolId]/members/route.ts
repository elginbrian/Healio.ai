import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth-util";
import mongoose from "mongoose";
import PoolMember from "@/models/pool-member";
import User from "@/models/user";
import Contribution from "@/models/contribution";
import { ContributionStatus } from "@/types/enums";

export async function GET(request: NextRequest, { params }: { params: Promise<{ poolId: string }> }) {
  try {
    await connectToDatabase();
    const { poolId } = await params;

    const userId = getUserIdFromToken(request.headers.get("Authorization"));
    if (!userId) {
      return NextResponse.json({ success: false, message: "Akses ditolak: Tidak terautentikasi." }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(poolId)) {
      return NextResponse.json({ success: false, message: "Format Pool ID tidak valid." }, { status: 400 });
    }

    // Get all members of the pool with user details
    const members = await PoolMember.find({ pool_id: poolId }).populate("user_id", "name email picture").lean();

    // Fetch contribution totals for each member
    const memberIds = members.map((m) => m.user_id._id);

    // Get all successful contributions for these members in this pool
    const contributionAggregates = await Contribution.aggregate([
      {
        $match: {
          pool: new mongoose.Types.ObjectId(poolId),
          member: { $in: memberIds.map((id) => new mongoose.Types.ObjectId(id.toString())) },
          status: ContributionStatus.SUCCESS,
        },
      },
      {
        $group: {
          _id: "$member",
          total_contribution: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Map contribution data to members
    const contributionMap = contributionAggregates.reduce((map, item) => {
      map[item._id.toString()] = {
        total_contribution: item.total_contribution,
        count: item.count,
      };
      return map;
    }, {});

    // Combine member data with their contributions
    const membersWithContributions = members.map((member) => {
      const userId = member.user_id._id.toString();
      const contributionData = contributionMap[userId] || { total_contribution: 0, count: 0 };

      return {
        ...member,
        total_contribution: contributionData.total_contribution,
        total_claims: 0, // Placeholder for claims data, to be implemented later
      };
    });

    return NextResponse.json(
      {
        success: true,
        members: membersWithContributions,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET_POOL_MEMBERS_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat mengambil daftar anggota.",
      },
      { status: 500 }
    );
  }
}
