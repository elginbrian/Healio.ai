"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2, AlertTriangle, ShoppingBag } from "lucide-react";
import { ExpenseCategory } from "@/types";
import { IExpenseRecordDocument } from "@/models/expense-record";

interface RecentExpensesProps {
  dataVersion: number;
}

const RecentExpenses = ({ dataVersion }: RecentExpensesProps) => {
  const [expenses, setExpenses] = useState<IExpenseRecordDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "all">("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: any = {
          page: activeTab === "all" ? currentPage : 1,
          limit: activeTab === "all" ? limit : 5,
          sortBy: "transaction_date",
          sortOrder: "desc",
        };
        const response = await api.get("/api/expenses", { params });
        if (response.data.success) {
          setExpenses(response.data.data);
          if (activeTab === "all") {
            setTotalPages(response.data.pagination.totalPages);
          }
        } else {
          throw new Error(response.data.message || "Gagal mengambil data pengeluaran.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan.");
        setExpenses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [dataVersion, activeTab, currentPage]);

  const getCategoryIcon = (category: ExpenseCategory | string) => {
    switch (category) {
      case ExpenseCategory.MEDICATION:
        return <ShoppingBag size={20} className="text-blue-500" />;
      case ExpenseCategory.CONSULTATION:
        return <ShoppingBag size={20} className="text-green-500" />;
      case ExpenseCategory.LAB_FEE:
        return <ShoppingBag size={20} className="text-purple-500" />;
      default:
        return <ShoppingBag size={20} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mb-8">
      <p className="text-[var(--color-p-300)] font-semibold text-xl mb-4">Pengeluaran</p>
      <div className="w-full min-h-[24rem] shadow-md rounded-2xl bg-white p-6">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => {
              setActiveTab("recent");
              setCurrentPage(1);
            }}
            className={`py-2 px-4 font-semibold ${activeTab === "recent" ? "text-[var(--color-p-300)] border-b-2 border-[var(--color-p-300)]" : "text-gray-500"}`}
          >
            Terkini
          </button>
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`py-2 px-4 font-semibold ${activeTab === "all" ? "text-[var(--color-p-300)] border-b-2 border-[var(--color-p-300)]" : "text-gray-500"}`}
          >
            Semua
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-p-300)]" />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-60 text-red-500">
            <AlertTriangle size={32} className="mb-2" />
            <p>{error}</p>
          </div>
        ) : expenses.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Belum ada data pengeluaran.</p>
        ) : (
          <>
            <div className="space-y-3 overflow-y-auto h-[calc(100%-100px)] custom-scrollbar pr-2">
              {expenses.map((item) => (
                <div key={String(item._id)} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-gray-100 rounded-full mr-3">{getCategoryIcon(item.category)}</div>
                    <div>
                      <p className="text-md font-semibold text-gray-800">{item.medicine_name || item.facility_name || item.category}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.transaction_date || item.createdAt)}
                        {item.facility_name && item.medicine_name ? ` • ${item.facility_name}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="text-md font-bold text-[var(--color-p-300)]">Rp{item.total_price.toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>
            {activeTab === "all" && totalPages > 1 && (
              <div className="mt-4 flex justify-center items-center space-x-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50">
                  Sebelumnya
                </button>
                <span className="text-sm">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50">
                  Berikutnya
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentExpenses;

