"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import PoolTabs from "@/components/microfunding/detail/pool_tabs/page";
import NotifProfile from "@/components/notification_profile/page";
import api from "@/lib/api";
import { IMicrofundingPool, IPoolMember, IUser, IContribution, ContributionStatus } from "@/types";
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
  amountPerPeriod: number;
  totalContributionByUser: number;
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
  const [userContributionSummary, setUserContributionSummary] = useState<IUserContributionSummary | null>(null);
  const [userContributions, setUserContributions] = useState<IContribution[]>([]);
  const [totalUserContribution, setTotalUserContribution] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateNextDueDate = (pool: IMicrofundingPool, lastSuccessfulContributionDate?: Date): string => {
    let baseDate = lastSuccessfulContributionDate || new Date(pool.created_date);
    if (pool.contribution_period === "BULANAN") {
      baseDate.setMonth(baseDate.getMonth() + 1);
    } else if (pool.contribution_period === "MINGGUAN") {
      baseDate.setDate(baseDate.getDate() + 7);
    } else if (pool.contribution_period === "TAHUNAN") {
      baseDate.setFullYear(baseDate.getFullYear() + 1);
    }
    return baseDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  useEffect(() => {
    const fetchPoolData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const poolDetailResponse = await api.get<{ success: boolean; pool: IMicrofundingPool; message?: string }>(`/api/microfunding/pool/${poolId}`);
        if (poolDetailResponse.data.success && poolDetailResponse.data.pool) {
          setPoolDetails(poolDetailResponse.data.pool);
        } else {
          throw new Error(poolDetailResponse.data.message || "Gagal memuat detail pool.");
        }
        const currentPoolDetails = poolDetailResponse.data.pool;

        const membershipResponse = await api.get<{ success: boolean; member: IPoolMember; message?: string }>(`/api/microfunding/pool/${poolId}/members/me`);
        if (membershipResponse.data.success && membershipResponse.data.member) {
          setCurrentUserMembership(membershipResponse.data.member);
        } else {
          console.warn(membershipResponse.data.message || "Pengguna bukan anggota pool ini atau gagal memuat status keanggotaan.");
          setCurrentUserMembership(null);
        }

        const summaryResponse = await api.get<{ success: boolean; summary: IPoolSummary; message?: string }>(`/api/microfunding/pool/${poolId}/summary`);
        if (summaryResponse.data.success && summaryResponse.data.summary) {
          setPoolSummary(summaryResponse.data.summary);
        } else {
          setPoolSummary({
            memberCount: 0,
            totalFunds: currentPoolDetails.current_amount || 0,
            claimsApproved: 0,
          });
          console.warn("Gagal memuat ringkasan pool, menggunakan data parsial.");
        }

        if (currentUserMembership || membershipResponse.data.success) {
          const contributionListResponse = await api.get<{ success: boolean; contributions: IContribution[]; message?: string }>(`/api/microfunding/pool/${poolId}/contributions/me`);

          if (contributionListResponse.data.success && Array.isArray(contributionListResponse.data.contributions)) {
            const allUserContributions = contributionListResponse.data.contributions;
            const successfulContributions = allUserContributions.filter(
              (c) => (c as any).status === ContributionStatus.SUCCESS
            );
            setUserContributions(allUserContributions);
            setTotalUserContribution(
              successfulContributions.reduce((acc, curr) => acc + curr.amount, 0)
            );

            const lastSuccessfulContribution = successfulContributions.sort((a, b) => new Date(b.contribution_date).getTime() - new Date(a.contribution_date).getTime())[0];

            let paymentStatus: "LUNAS" | "BELUM_LUNAS" | "TIDAK_ADA" = "TIDAK_ADA";
            if (successfulContributions.length > 0) {
              paymentStatus = "LUNAS";
            } else if (allUserContributions.some((c) => (c as any).status === ContributionStatus.PENDING)) {
              paymentStatus = "BELUM_LUNAS";
            }

            setUserContributionSummary({
              status: paymentStatus,
              amountPerPeriod: currentPoolDetails.contribution_amount_per_member || 0,
              totalContributionByUser: totalUserContribution,
              nextDueDate: calculateNextDueDate(currentPoolDetails, lastSuccessfulContribution ? new Date(lastSuccessfulContribution.contribution_date) : undefined),
            });
          } else {
            console.warn("Gagal memuat daftar kontribusi pengguna untuk ringkasan.");
            setUserContributionSummary({
              status: "TIDAK_ADA",
              amountPerPeriod: currentPoolDetails.contribution_amount_per_member || 0,
              totalContributionByUser: 0,
              nextDueDate: calculateNextDueDate(currentPoolDetails),
            });
          }
        } else {
          setUserContributionSummary({
            status: "TIDAK_ADA",
            amountPerPeriod: currentPoolDetails.contribution_amount_per_member || 0,
            totalContributionByUser: 0,
            nextDueDate: "-",
          });
        }
      } catch (err: any) {
        console.error("Error saat mengambil data detail pool:", err);
        const errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat memuat data pool.";
        setError(errorMessage);
        toast.error(errorMessage);
        if (err.response?.status === 404) {
          router.push("/dashboard/microfunding");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (poolId && !authLoading && user) {
      fetchPoolData();
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [poolId, user, authLoading, router]);


  const renderUserContributionSummary = () => {
    if (!currentUserMembership) {
      return (
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center">
          <Globe size={48} className="text-[var(--color-p-300)] mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Anda Belum Bergabung</h3>
          <p className="text-gray-600 text-sm mb-6">Anda bukan anggota dari pool ini. Gabung sekarang untuk berpartisipasi!</p>
          <button onClick={() => router.push("/dashboard/microfunding")} className="py-3 px-6 rounded-lg bg-[var(--color-p-300)] text-white font-semibold hover:bg-[var(--color-p-400)] transition-colors duration-300">
            Cari & Gabung Pool
          </button>
        </div>
      );
    }
    if (!userContributionSummary) {
      return (
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-6 md:p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="ml-2 text-gray-500">Memuat ringkasan kontribusi...</p>
        </div>
      );
    }
    return (
      <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-p-300)] mb-4">Kontribusi Saya</h2>
          <div className="space-y-2.5 text-sm mb-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Status Pembayaran Periode Ini</p>
              <p
                className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                  userContributionSummary.status === "LUNAS" ? "bg-green-100 text-green-700" : userContributionSummary.status === "BELUM_LUNAS" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {userContributionSummary.status.replace("_", " ")}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Jumlah Iuran per Periode</p>
              <p className="font-semibold text-gray-800">Rp {userContributionSummary.amountPerPeriod.toLocaleString("id-ID")}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Total Kontribusi Saya (Sukses)</p>
              <p className="font-semibold text-[var(--color-p-300)]">Rp {userContributionSummary.totalContributionByUser.toLocaleString("id-ID")}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Jatuh Tempo Berikutnya</p>
              <p className="font-semibold text-gray-800">{userContributionSummary.nextDueDate || "-"}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => router.push(`/dashboard/microfunding/payment?poolId=${poolId}`)}
            className="flex-1 py-3 px-4 rounded-lg bg-[var(--color-p-300)] text-white font-semibold hover:bg-[var(--color-p-400)] transition-colors duration-300 text-sm"
          >
            Bayar Kontribusi
          </button>
          <button
            onClick={() => toast.error("Fitur Ajukan Klaim belum diimplementasikan.")}
            className="flex-1 py-3 px-4 rounded-lg border border-[var(--color-p-300)] text-[var(--color-p-300)] font-semibold hover:bg-[var(--color-p-75)] hover:text-white transition-colors duration-300 text-sm"
          >
            Ajukan Klaim
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
  }
  if (error) {
  }
  if (!poolDetails) {
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="p-4 md:p-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard/microfunding")} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Kembali ke daftar pool">
              <ArrowLeft size={24} className="text-[var(--color-p-300)]" />
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--color-p-300)]">Detail Dana Komunal</h1>
          </div>
          <NotifProfile profileImageSrc={(user as any)?.picture || "/img/hospital_dummy.png"} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-6 md:mb-8">

          <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl md:text-2xl font-semibold text-[var(--color-p-300)] break-all" title={poolDetails?.title || ""}>
                {poolDetails?.title || ""}
              </h2>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                  poolDetails?.status === "OPEN" ? "bg-green-100 text-green-700" : poolDetails?.status === "CLOSED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {poolDetails?.status ? poolDetails.status.charAt(0) + poolDetails.status.slice(1).toLowerCase() : "N/A"}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-6 min-h-[60px] leading-relaxed line-clamp-3">{poolDetails?.description}</p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mt-auto pt-4 border-t border-gray-100">
              <div>
                <Users size={20} className="mx-auto mb-1 text-gray-500" />
                <p className="text-gray-500 font-medium text-xs mb-0.5 uppercase">Anggota</p>
                <p className="text-lg md:text-xl font-bold text-gray-800">{poolSummary?.memberCount ?? "N/A"}</p>
              </div>
              <div>
                <DollarSign size={20} className="mx-auto mb-1 text-gray-500" />
                <p className="text-gray-500 font-medium text-xs mb-0.5 uppercase">Dana Pool</p>
                <p className="text-lg md:text-xl font-bold text-gray-800">Rp {(poolSummary?.totalFunds ?? poolDetails?.current_amount ?? 0).toLocaleString("id-ID")}</p>
              </div>
              <div>
                <CheckCircle size={20} className="mx-auto mb-1 text-gray-500" />
                <p className="text-gray-500 font-medium text-xs mb-0.5 uppercase">Klaim OK</p>
                <p className="text-lg md:text-xl font-bold text-gray-800">{poolSummary?.claimsApproved ?? "N/A"}</p>
              </div>
            </div>
          </div>

          {renderUserContributionSummary()}
        </div>

        {poolDetails && <PoolTabs poolDetails={poolDetails} currentUserMembership={currentUserMembership} />}
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
          <Loader2 className="h-16 w-16 animate-spin text-[var(--color-p-300)]" />
          <p className="mt-4 text-gray-600">Memuat halaman detail pool...</p>
        </div>
      }
    >
      <MicrofundingDetailContent />
    </Suspense>
  );
};

export default MicrofundingDetailPage;

