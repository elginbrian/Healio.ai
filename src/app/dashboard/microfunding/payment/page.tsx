"use client";

import NotifProfile from "@/components/notification_profile/page";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { IMicrofundingPool, PaymentMethod as PaymentMethodEnum, IContribution, ContributionStatus } from "@/types";
import { useAuth } from "@/lib/auth";
import { Loader2, Wallet, ArrowLeft, RefreshCw } from "lucide-react";
import { useMidtransAvailability } from "@/hooks/useMidtransAvailability";

declare global {
  interface Window {
    snap: any;
  }
}

const PaymentContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const poolId = searchParams.get("poolId");
  const { user, loading: authLoading } = useAuth();
  const { isMidtransAvailable, isChecking } = useMidtransAvailability();

  const [poolDetails, setPoolDetails] = useState<IMicrofundingPool | null>(null);
  const [isLoadingPool, setIsLoadingPool] = useState(true);
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<IContribution[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const fetchPaymentHistory = useCallback(() => {
    if (!poolId || !user) return;
    setIsLoadingHistory(true);
    api
      .get<{ success: boolean; contributions: IContribution[] }>(`/api/microfunding/pool/${poolId}/contributions/me`)
      .then((res) => {
        if (res.data.success) {
          setPaymentHistory(res.data.contributions || []);
        } else {
          console.error("Gagal memuat riwayat pembayaran");
        }
      })
      .catch((err) => {
        console.error("Error memuat riwayat pembayaran:", err.response?.data?.message || err.message);
      })
      .finally(() => setIsLoadingHistory(false));
  }, [poolId, user]);

  const checkPaymentStatus = async (contributionId: string) => {
    try {
      const response = await api.get(`/api/microfunding/contributions/${contributionId}/check-status`);
      if (response.data.success && response.data.status === ContributionStatus.SUCCESS) {
        toast.success("Pembayaran berhasil dikonfirmasi!");
        fetchPaymentHistory();
      }
      return response.data;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return null;
    }
  };

  useEffect(() => {
    if (poolId && !authLoading && user) {
      setIsLoadingPool(true);
      api
        .get<{ success: boolean; pool: IMicrofundingPool }>(`/api/microfunding/pool/${poolId}`)
        .then((response) => {
          if (response.data.success) {
            setPoolDetails(response.data.pool);
            setAmountToPay(response.data.pool.contribution_amount_per_member || 10000);
          } else {
            toast.error("Gagal memuat detail pool.");
            router.push("/dashboard/microfunding");
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Error memuat detail pool.");
          console.error(err);
          router.push("/dashboard/microfunding");
        })
        .finally(() => setIsLoadingPool(false));

      fetchPaymentHistory();
    } else if (!authLoading && !user) {
      toast.error("Silakan login untuk melanjutkan.");
      router.push("/login");
    }
  }, [poolId, user, authLoading, router, fetchPaymentHistory]);

  const handlePayNow = async () => {
    if (!poolId || amountToPay < 10000) {
      toast.error("Jumlah pembayaran minimal adalah Rp 10.000.");
      return;
    }

    if (!isMidtransAvailable) {
      toast.error("Layanan pembayaran (Midtrans Snap.js) belum termuat. Mohon refresh halaman atau coba lagi sesaat.");
      console.error("Midtrans Snap.js (window.snap) is not available.");
      return;
    }

    setIsProcessingPayment(true);
    const paymentToastId = toast.loading("Memproses permintaan pembayaran...");
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        contributionId: string;
        paymentToken: string;
      }>(`/api/microfunding/pool/${poolId}/contributions`, {
        amount: amountToPay,
        payment_method: PaymentMethodEnum.E_WALLET,
      });

      toast.dismiss(paymentToastId);

      if (response.data.success && response.data.paymentToken) {
        const paymentToken = response.data.paymentToken;
        const contributionId = response.data.contributionId;
        toast.success("Membuka jendela pembayaran...");

        window.snap.pay(paymentToken, {
          onSuccess: function (result: any) {
            console.log("Midtrans onSuccess:", result);
            toast.success(`Pembayaran untuk order ID ${result.order_id} berhasil! Status akan segera diperbarui.`);
            setTimeout(() => checkPaymentStatus(contributionId), 2000);
            fetchPaymentHistory();
          },
          onPending: function (result: any) {
            console.log("Midtrans onPending:", result);
            toast("Pembayaran Anda sedang diproses. Instruksi pembayaran telah dikirim.", { icon: "⏳", duration: 5000 });
            fetchPaymentHistory();
          },
          onError: function (result: any) {
            console.error("Midtrans onError:", result);
            toast.error("Pembayaran gagal atau terjadi kesalahan pada proses pembayaran.");
          },
          onClose: function () {
            console.log("Pengguna menutup popup pembayaran Midtrans.");
            toast.dismiss();
            toast("Anda menutup jendela pembayaran.", { icon: "ℹ️" });
            setTimeout(() => checkPaymentStatus(contributionId), 2000);
          },
        });
      } else {
        toast.error(response.data.message || "Gagal memulai pembayaran dari server.");
      }
    } catch (error: any) {
      toast.dismiss(paymentToastId);
      console.error("Error saat proses bayar:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat menghubungi server untuk pembayaran.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoadingPool || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--color-p-300)]" />
      </div>
    );
  }
  if (!poolDetails) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Gagal memuat detail pool atau pool tidak ditemukan.</p>
        <button onClick={() => router.back()} className="bg-[var(--color-p-300)] text-white py-2 px-4 rounded-lg hover:bg-[var(--color-p-400)] transition-colors flex items-center mx-auto">
          <ArrowLeft size={18} className="mr-2" /> Kembali
        </button>
      </div>
    );
  }

  const renderPaymentHistoryItem = (item: IContribution) => {
    return (
      <div key={item._id} className="flex items-start p-3 bg-gray-50 rounded-lg">
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center mr-3 ${
            (item as any).status === ContributionStatus.SUCCESS ? "bg-green-100" : (item as any).status === ContributionStatus.PENDING ? "bg-yellow-100" : "bg-red-100"
          }`}
        >
          <Wallet size={18} className={`${(item as any).status === ContributionStatus.SUCCESS ? "text-green-600" : (item as any).status === ContributionStatus.PENDING ? "text-yellow-600" : "text-red-600"}`} />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-800">Rp {item.amount.toLocaleString("id-ID")}</p>
            {(item as any).status && (
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                  (item as any).status === ContributionStatus.SUCCESS ? "bg-green-200 text-green-700" : (item as any).status === ContributionStatus.PENDING ? "bg-yellow-200 text-yellow-700" : "bg-red-200 text-red-700"
                }`}
              >
                {(item as any).status}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">{new Date(item.contribution_date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>


            {(item as any).status === ContributionStatus.PENDING && (
              <button onClick={() => checkPaymentStatus(item._id)} className="text-xs text-blue-500 hover:text-blue-700 underline ml-2">
                Periksa Status
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/dashboard/microfunding/detail?poolId=${poolId}`)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Kembali ke detail pool">
            <ArrowLeft size={24} className="text-[var(--color-p-300)]" />
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--color-p-300)]">Pembayaran Kontribusi</h1>
        </div>
        <NotifProfile profileImageSrc={(user as any)?.picture || "/img/hospital_dummy.png"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Detail Pembayaran</h2>
            <p className="text-sm text-gray-600 mb-6">
              Lakukan pembayaran kontribusi untuk pool <span className="font-medium text-[var(--color-p-300)]">{poolDetails.title}</span>.
            </p>

            <div className="mb-6">
              <label htmlFor="amountToPay" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Pembayaran (Rp)
              </label>
              <input
                type="number"
                id="amountToPay"
                value={amountToPay}
                onChange={(e) => setAmountToPay(Math.max(0, Number(e.target.value)))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] outline-none"
                placeholder="Masukkan jumlah"
                min="10000"
              />
              <p className="text-xs text-gray-500 mt-1">Iuran per periode untuk pool ini: Rp {poolDetails.contribution_amount_per_member.toLocaleString("id-ID")}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
              <p className="text-xs text-gray-500">
                Anda dapat memilih metode pembayaran (seperti GoPay, Transfer Bank Virtual Account, Kartu Kredit, dll.) melalui halaman pembayaran Midtrans setelah menekan tombol "Lanjutkan Pembayaran".
              </p>
            </div>

            <button
              onClick={handlePayNow}
              disabled={isProcessingPayment || amountToPay < 10000 || !isMidtransAvailable}
              className="w-full bg-[var(--color-p-300)] text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-[var(--color-p-400)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-base"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" /> Memproses...
                </>
              ) : (
                "Lanjutkan Pembayaran"
              )}
            </button>

            {isChecking ? (
              <div className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Menyiapkan layanan pembayaran...
              </div>
            ) : (
              !isMidtransAvailable && (
                <div className="text-xs text-red-500 mt-2 text-center">
                  <p>Layanan pembayaran sedang tidak tersedia. Mohon coba lagi nanti.</p>
                  <button onClick={() => window.location.reload()} className="inline-flex items-center text-[var(--color-p-300)] mt-1 hover:underline">
                    <RefreshCw className="w-3 h-3 mr-1" /> Muat ulang halaman
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan</h2>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Nama Pool:</span>
                <span className="text-sm font-medium text-gray-900 truncate" title={poolDetails.title}>
                  {poolDetails.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Periode Iuran:</span>
                <span className="text-sm font-medium text-gray-900">{poolDetails.contribution_period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jumlah Iuran per Anggota:</span>
                <span className="text-sm font-medium text-gray-900">Rp {poolDetails.contribution_amount_per_member.toLocaleString("id-ID")}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-gray-700">Total Akan Dibayar:</span>
                <span className="font-bold text-[var(--color-p-300)]">Rp {amountToPay.toLocaleString("id-ID")}</span>
              </div>
              <p className="text-xs text-gray-500 text-center pt-1">Biaya admin (jika ada) akan ditampilkan oleh Midtrans.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Kontribusi (Pool Ini)</h2>
            <div className="max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {isLoadingHistory ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : paymentHistory.length > 0 ? (
                <div className="space-y-3">{paymentHistory.map(renderPaymentHistoryItem)}</div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">Belum ada riwayat kontribusi.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-16 w-16 animate-spin text-[var(--color-p-300)]" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
};

export default PaymentPage;

