"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import PoolTabs from "@/components/microfunding/detail/pool_tabs/page";
import NotifProfile from "@/components/notification_profile/page";
import api from "@/lib/api";
import { IMicrofundingPool, IPoolMember, IUser } from "@/types";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";
import { AlertTriangle, Loader2, Users, DollarSign, CheckCircle, ArrowLeft, Globe } from "lucide-react";

export interface PoolTabsProps {
  poolDetails: IMicrofundingPool;
  currentUserMembership: IPoolMember | null;
}

interface IPoolSummary {
  memberCount: number;
  totalFunds: number;
  claimsApproved: number;
}

interface IUserContributionSummary {
  status: "LUNAS" | "BELUM_LUNAS" | "TIDAK_ADA";
  amount: number;
  totalContribution: number;
  nextDueDate?: string;
}

const MicrofundingDetailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const poolId = searchParams.get("poolId");
  const { user, loading: authLoading } = useAuth();

  const [poolDetails, setPoolDetails] = useState<IMicrofundingPool | null>(null);
  const [currentUserMembership, setCurrentUserMembership] = useState<IPoolMember | null>(null);
  const [poolSummary, setPoolSummary] = useState<IPoolSummary | null>(null);
  const [userContribution, setUserContribution] = useState<IUserContributionSummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poolId) {
      setError("Pool ID tidak ditemukan di URL.");
      setIsLoading(false);
      return;
    }

    if (authLoading) return;

    if (!user) {
      setError("Pengguna tidak terautentikasi. Silakan login kembali.");
      setIsLoading(false);
      return;
    }

    const fetchPoolData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const poolDetailResponse = await api.get<{ success: boolean; pool: IMicrofundingPool; message?: string }>(`/api/microfunding/pool/${poolId}`);
        if (poolDetailResponse.data.success) {
          setPoolDetails(poolDetailResponse.data.pool);
        } else {
          throw new Error(poolDetailResponse.data.message || "Gagal memuat detail pool.");
        }

        const membershipResponse = await api.get<{ success: boolean; member: IPoolMember; message?: string }>(`/api/microfunding/pool/${poolId}/members/me`);
        if (membershipResponse.data.success) {
          setCurrentUserMembership(membershipResponse.data.member);
        } else {
          console.warn(membershipResponse.data.message || "Pengguna bukan anggota pool ini atau gagal memuat status keanggotaan.");
          setCurrentUserMembership(null);
        }

        const summaryResponse = await api.get<{ success: boolean; summary: IPoolSummary; message?: string }>(`/api/microfunding/pool/${poolId}/summary`);
        if (summaryResponse.data.success) {
          setPoolSummary(summaryResponse.data.summary);
        } else {
          setPoolSummary({ memberCount: 0, totalFunds: poolDetailResponse.data.pool?.current_amount || 0, claimsApproved: 0 });
          console.warn("Gagal memuat ringkasan pool, menggunakan data parsial.");
        }

        const contributionResponse = await api.get<{ success: boolean; contribution: IUserContributionSummary; message?: string }>(`/api/microfunding/pool/${poolId}/contributions/me`);
        if (contributionResponse.data.success) {
          setUserContribution(contributionResponse.data.contribution);
        } else {
          setUserContribution({ status: "TIDAK_ADA", amount: 0, totalContribution: 0, nextDueDate: "-" });
          console.warn("Gagal memuat ringkasan kontribusi pengguna.");
        }
      } catch (err: any) {
        console.error("Error fetching pool detail data:", err);
        const errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat memuat data pool.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolData();
  }, [poolId, user, authLoading, router]);

  const isCurrentUserAdmin = currentUserMembership?.role === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--color-p-300)]" />
        <p className="mt-4 text-gray-600">Memuat detail pool...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-red-600 font-semibold">Gagal Memuat Data</p>
        <p className="text-gray-700 mt-2">{error}</p>
        <button onClick={() => router.back()} className="mt-6 flex items-center bg-[var(--color-p-300)] text-white py-2 px-4 rounded-lg hover:bg-[var(--color-p-400)] transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Kembali
        </button>
      </div>
    );
  }

  if (!poolDetails) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <p className="mt-4 text-yellow-700 font-semibold">Pool Tidak Ditemukan</p>
        <p className="text-gray-600 mt-2">Pool yang Anda cari mungkin tidak ada atau telah dihapus.</p>
        <button onClick={() => router.back()} className="mt-6 flex items-center bg-[var(--color-p-300)] text-white py-2 px-4 rounded-lg hover:bg-[var(--color-p-400)] transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Kembali
        </button>
      </div>
    );
  }

  const formatNextDueDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="p-4 md:p-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard/microfunding")} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Kembali ke daftar pool">
              <ArrowLeft size={24} className="text-[var(--color-p-300)]" />
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-p-300)]">Detail Dana Komunal</h1>
          </div>
          <NotifProfile profileImageSrc={user?.ktp_number ? `/img/avatars/${user._id}.png` : "/img/hospital_dummy.png"} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-2xl p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-p-300)] break-all">{poolDetails.title}</h2>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full
                                ${poolDetails.status === "OPEN" ? "bg-green-100 text-green-700" : poolDetails.status === "CLOSED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
              >
                {poolDetails.status.charAt(0) + poolDetails.status.slice(1).toLowerCase()}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-6 min-h-[60px]">{poolDetails.description}</p>

            <div className="grid grid-cols-3 gap-4 text-center mt-auto pt-4 border-t border-gray-200">
              <div>
                <Users size={20} className="mx-auto mb-1 text-gray-500" />
                <p className="text-gray-500 font-medium text-xs mb-1">ANGGOTA</p>
                <p className="text-xl md:text-2xl font-bold text-[var(--color-p-300)]">{poolSummary?.memberCount ?? "N/A"}</p>
              </div>
              <div>
                <DollarSign size={20} className="mx-auto mb-1 text-gray-500" />
                <p className="text-gray-500 font-medium text-xs mb-1">DANA TERKUMPUL</p>
                <p className="text-xl md:text-2xl font-bold text-[var(--color-p-300)]">Rp{(poolSummary?.totalFunds ?? poolDetails.current_amount).toLocaleString("id-ID")}</p>
              </div>
              <div>
                <CheckCircle size={20} className="mx-auto mb-1 text-gray-500" />
                <p className="text-gray-500 font-medium text-xs mb-1">KLAIM DISETUJUI</p>
                <p className="text-xl md:text-2xl font-bold text-[var(--color-p-300)]">{poolSummary?.claimsApproved ?? "N/A"}</p>
              </div>
            </div>
          </div>

          {currentUserMembership && (
            <div className="w-full lg:w-1/2 bg-white shadow-md rounded-2xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-p-300)] mb-4">Kontribusi Saya</h2>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Status Pembayaran Terakhir</p>
                    <p className={`font-medium ${userContribution?.status === "LUNAS" ? "text-green-600" : userContribution?.status === "BELUM_LUNAS" ? "text-red-600" : "text-gray-500"}`}>
                      {userContribution?.status?.replace("_", " ") || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Jumlah Iuran per Periode</p>
                    <p className="font-semibold text-[var(--color-p-300)]">Rp{(poolDetails.contribution_amount_per_member || 0).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Total Kontribusi Saya</p>
                    <p className="font-semibold text-[var(--color-p-300)]">Rp{(userContribution?.totalContribution || 0).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Jatuh Tempo Berikutnya</p>
                    <p className="font-semibold text-[var(--color-p-300)]">{formatNextDueDate(userContribution?.nextDueDate)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => router.push(`/dashboard/microfunding/payment?poolId=${poolId}`)}
                  className="flex-1 py-3 px-4 rounded-lg bg-[var(--color-p-300)] text-white font-semibold hover:bg-[var(--color-p-400)] transition-colors duration-300 text-sm"
                >
                  Bayar Kontribusi
                </button>
                <button className="flex-1 py-3 px-4 rounded-lg border border-[var(--color-p-300)] text-[var(--color-p-300)] font-semibold hover:bg-[var(--color-p-75)] transition-colors duration-300 text-sm">Ajukan Klaim</button>
              </div>
            </div>
          )}
          {!currentUserMembership && user && (
            <div className="w-full lg:w-1/2 bg-white shadow-md rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center">
              <Globe size={48} className="text-[var(--color-p-300)] mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Anda Belum Bergabung</h3>
              <p className="text-gray-600 text-sm mb-6">Anda bukan anggota dari pool ini. Gabung sekarang untuk berpartisipasi!</p>
              <button onClick={() => router.push("/dashboard/microfunding")} className="py-3 px-6 rounded-lg bg-[var(--color-p-300)] text-white font-semibold hover:bg-[var(--color-p-400)] transition-colors duration-300">
                Cari & Gabung Pool
              </button>
            </div>
          )}
        </div>

        <PoolTabs poolDetails={poolDetails} currentUserMembership={currentUserMembership} />
      </div>
      <FooterDashboard />
    </div>
  );
};

const MicrofundingDetailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen items-center justify-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--color-p-300)]" />
          <p className="mt-4 text-gray-600">Memuat halaman...</p>
        </div>
      }
    >
      <MicrofundingDetailContent />
    </Suspense>
  );
};

export default MicrofundingDetailPage;
