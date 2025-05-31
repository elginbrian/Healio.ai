"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown, Loader2, Hospital, Pill, Stethoscope, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { IDisbursement, DisbursementStatus } from "@/types"; // Use IDisbursement

interface PengeluaranTabProps {
  poolId?: string;
}

const PengeluaranTab = ({ poolId }: PengeluaranTabProps) => {
  const [expenses, setExpenses] = useState<IDisbursement[]>([]); // Changed to IDisbursement
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchActualExpenses = useCallback(async () => {
    // Renamed function
    if (!poolId) return;

    setIsLoading(true);
    try {
      // Fetch disbursements that are considered actual expenses
      const response = await api.get(`/api/microfunding/pool/${poolId}/disbursements?status=${DisbursementStatus.DISBURSED}`);
      // Or you might want to include APPROVED ones too: ?status=DISBURSED&status=APPROVED
      if (response.data.success) {
        // Sort by disbursement_date or resolved_at if disbursement_date is not set yet
        const sortedData = response.data.disbursements.sort((a: IDisbursement, b: IDisbursement) => {
          const dateA = new Date(a.disbursement_date || a.resolved_at || a.request_date).getTime();
          const dateB = new Date(b.disbursement_date || b.resolved_at || b.request_date).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
        setExpenses(sortedData || []);
      } else {
        toast.error(response.data.message || "Gagal memuat daftar pengeluaran.");
      }
    } catch (error: any) {
      console.error("Error fetching actual expenses:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat memuat pengeluaran.");
    } finally {
      setIsLoading(false);
    }
  }, [poolId, sortOrder]); // Add sortOrder dependency

  useEffect(() => {
    fetchActualExpenses();
  }, [fetchActualExpenses]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      const newOrder = prevOrder === "asc" ? "desc" : "asc";
      // Re-sort existing data, or let fetchActualExpenses handle it if it depends on sortOrder
      setExpenses((prevExpenses) =>
        [...prevExpenses].sort((a, b) => {
          const dateA = new Date(a.disbursement_date || a.resolved_at || a.request_date).getTime();
          const dateB = new Date(b.disbursement_date || b.resolved_at || b.request_date).getTime();
          return newOrder === "asc" ? dateA - dateB : dateB - dateA;
        })
      );
      return newOrder;
    });
  };

  // This function might need adjustment based on how you categorize 'purpose' or if you add a 'category' field to IDisbursement
  const getExpenseIcon = (purpose: string) => {
    const lowerPurpose = purpose.toLowerCase();
    if (lowerPurpose.includes("rawat inap") || lowerPurpose.includes("hospital")) return Hospital;
    if (lowerPurpose.includes("obat") || lowerPurpose.includes("medicine") || lowerPurpose.includes("farmasi")) return Pill;
    if (lowerPurpose.includes("konsultasi") || lowerPurpose.includes("doctor") || lowerPurpose.includes("spesialis")) return Stethoscope;
    return CheckCircle; // Default icon for a disbursed item
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Riwayat Pengeluaran Pool</h3>
        <div className="ml-2 flex flex-col cursor-pointer" onClick={toggleSortOrder}>
          <ChevronUp size={16} className={`${sortOrder === "asc" ? "text-[var(--color-p-300)]" : "text-gray-400"} hover:text-gray-600`} />
          <ChevronDown size={16} className={`${sortOrder === "desc" ? "text-[var(--color-p-300)]" : "text-gray-400"} hover:text-gray-600`} />
        </div>
      </div>

      <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-p-300)]" />
          </div>
        ) : expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense) => {
              const ExpenseIcon = getExpenseIcon(expense.purpose);
              const recipientName = (expense.recipient_user_id as any)?.name || "Penerima Tidak Diketahui";
              return (
                <div key={expense._id.toString()} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full mr-4">
                      <ExpenseIcon size={24} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-800">{expense.purpose}</div>
                      <div className="text-sm text-gray-500">
                        Untuk: {recipientName} • {formatDate(expense.disbursement_date || expense.resolved_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[var(--color-p-300)]">Rp{expense.amount.toLocaleString("id-ID")}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">Belum ada pengeluaran yang tercatat dari pool ini.</p>
        )}
      </div>
    </div>
  );
};

export default PengeluaranTab;
