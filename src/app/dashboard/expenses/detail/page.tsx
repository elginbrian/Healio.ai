"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Filter, Download, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { AxiosError } from "axios";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import NotifProfile from "@/components/notification_profile/page";
import { ExpenseCategory } from "@/types";
import { useAuth } from "@/lib/auth";

interface Expense {
  _id: string;
  medicine_name?: string;
  facility_name?: string;
  category: string;
  transaction_date?: Date | string;
  createdAt: Date | string;
  total_price: number;
}

const DetailExpensePage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("current_month");
  const [periodLabel, setPeriodLabel] = useState("Bulan Ini");
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First fetch the summary to get the total
        const summaryResponse = await api.get(`/api/expenses/summary?period=${period}`);
        if (summaryResponse.data.success) {
          setTotalAmount(summaryResponse.data.summary.totalSpending);
          setPeriodLabel(summaryResponse.data.summary.periodLabel);
        }

        // Then fetch all expenses for this period
        const startDate = summaryResponse.data.summary.dateRange?.start;
        const endDate = summaryResponse.data.summary.dateRange?.end;

        const expensesResponse = await api.get("/api/expenses", {
          params: {
            startDate,
            endDate,
            limit: 100,
            sortBy: "transaction_date",
            sortOrder: "desc",
          },
        });

        if (expensesResponse.data.success) {
          setExpenses(expensesResponse.data.data);
        } else {
          throw new Error(expensesResponse.data.message || "Gagal mengambil data pengeluaran.");
        }
      } catch (err) {
        console.error("EXPENSE_DETAIL_ERROR:", err);
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || err.message || "Terjadi kesalahan.");
        } else if (err instanceof Error) {
          setError("Terjadi kesalahan.");
        } else {
          setError("Terjadi kesalahan.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [period]);

  const handleGoBack = () => {
    router.back();
  };

  type PeriodType = "current_month" | "last_month" | "last_3_months" | "year_to_date";

  const handleChangePeriod = (newPeriod: PeriodType): void => {
    setPeriod(newPeriod);
  };

  const getCategoryIcon = (category: ExpenseCategory): React.ReactElement => {
    return <div className="p-2.5 bg-gray-100 rounded-full">{/* Icon based on category */}</div>;
  };

  interface DateFormatOptions {
    day: "2-digit" | "numeric";
    month: "short" | "long" | "narrow" | "2-digit" | "numeric";
    year: "2-digit" | "numeric";
  }

  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow px-6 pt-8 md:px-10 pb-20">
        <div className="flex justify-between items-center mb-8">
          <button onClick={handleGoBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            <span>Kembali</span>
          </button>
          <NotifProfile profileImageSrc={(user as any)?.picture || "/img/pink2.jpg"} />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Detail Pengeluaran</h1>
          <p className="text-gray-600">{periodLabel}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-[var(--color-p-300)]">Rp {totalAmount.toLocaleString("id-ID")}</p>
            </div>

            <div className="flex gap-2">
              <select value={period} onChange={(e) => handleChangePeriod(e.target.value as PeriodType)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="current_month">Bulan Ini</option>
                <option value="last_month">Bulan Lalu</option>
                <option value="last_3_months">3 Bulan Terakhir</option>
                <option value="year_to_date">Tahun Ini</option>
              </select>

              <button className="p-2 bg-gray-100 rounded-lg">
                <Filter size={18} className="text-gray-600" />
              </button>

              <button className="p-2 bg-gray-100 rounded-lg">
                <Download size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-p-300)]" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle size={48} className="text-red-500 mb-4" />
              <p className="text-red-500 font-medium mb-2">Gagal memuat data</p>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Tidak ada data pengeluaran untuk periode ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-gray-100 rounded-full mr-3">{/* Use appropriate icon based on category */}</div>
                    <div>
                      <p className="font-semibold text-gray-800">{expense.medicine_name || expense.facility_name || expense.category}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(expense.transaction_date || expense.createdAt)}
                        {expense.facility_name && ` • ${expense.facility_name}`}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-[var(--color-p-300)]">Rp{expense.total_price.toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <FooterDashboard />
      </div>
    </div>
  );
};

export default DetailExpensePage;
