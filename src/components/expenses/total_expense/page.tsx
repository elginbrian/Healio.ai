"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Loader2, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

interface TotalExpenseCardProps {
  dataVersion: number;
}

const TotalExpenseCard = ({ dataVersion }: TotalExpenseCardProps) => {
  const [totalSpending, setTotalSpending] = useState<number | null>(null);
  const [lastMonthSpending, setLastMonthSpending] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const currentResponse = await api.get("/api/expenses/summary?period=current_month");
        if (currentResponse.data.success && currentResponse.data.summary) {
          setTotalSpending(currentResponse.data.summary.totalSpending);

          const lastMonthResponse = await api.get("/api/expenses/summary?period=last_month");
          if (lastMonthResponse.data.success && lastMonthResponse.data.summary) {
            const lastMonth = lastMonthResponse.data.summary.totalSpending;
            setLastMonthSpending(lastMonth);

            if (lastMonth > 0) {
              const change = ((currentResponse.data.summary.totalSpending - lastMonth) / lastMonth) * 100;
              setPercentChange(change);
            } else {
              setPercentChange(null);
            }
          }
        } else {
          throw new Error(currentResponse.data.message || "Gagal mengambil ringkasan pengeluaran.");
        }
      } catch (err: any) {
        console.error("TOTAL_EXPENSE_ERROR:", err);
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan.");
        setTotalSpending(null);
        setLastMonthSpending(null);
        setPercentChange(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [dataVersion]);

  const handleViewDetail = () => {
    router.push("/dashboard/expenses?view=detail");
  };

  return (
    <div className="flex flex-col justify-between bg-[var(--color-p-300)] rounded-xl p-6 shadow-md overflow-hidden relative min-h-[180px]">
      <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-[var(--color-p-400)] rounded-full opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 -mb-8 -ml-8 bg-[var(--color-p-400)] rounded-full opacity-20"></div>

      <div className="mb-4 z-10">
        <p className="text-lg font-medium text-white/90">Total Pengeluaran (Bulan Ini)</p>
        {isLoading ? (
          <div className="flex items-center mt-1 h-9">
            <Loader2 className="w-7 h-7 animate-spin text-white" />
          </div>
        ) : error ? (
          <div className="flex items-center mt-1 text-white">
            <AlertTriangle size={20} className="mr-2" />
            <span className="text-sm">Gagal memuat</span>
          </div>
        ) : (
          <div className="flex items-center mt-1">
            <p className="text-3xl font-bold text-white">Rp {(totalSpending ?? 0).toLocaleString("id-ID")}</p>

            {percentChange !== null && (
              <div className={`ml-2 flex items-center ${percentChange > 0 ? "bg-red-500/20" : "bg-green-500/20"} rounded-full px-2 py-1 text-xs text-white`}>
                {percentChange > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {Math.abs(percentChange).toFixed(1)}%
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center z-10 mt-auto">
        {!isLoading && !error && lastMonthSpending !== null && <p className="text-sm text-white/80">Bulan lalu: Rp {lastMonthSpending.toLocaleString("id-ID")}</p>}
        <button 
          onClick={handleViewDetail}
          className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-1 px-3 rounded-full transition-colors">
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default TotalExpenseCard;


