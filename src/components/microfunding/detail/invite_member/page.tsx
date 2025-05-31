"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Copy, Share2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { IJoinRequest, IUser, JoinRequestStatus } from "@/types";
import { useAuth } from "@/lib/auth";

interface PopulatedJoinRequest extends Omit<IJoinRequest, "user_id"> {
  user_id: Pick<IUser, "_id" | "name" | "email">;
}

interface UndangAnggotaTabProps {
  poolId?: string;
  poolCode?: string;
  isCurrentUserAdmin?: boolean;
}

const UndangAnggotaTab = ({ poolId, poolCode = "#KODEPOOL", isCurrentUserAdmin = false }: UndangAnggotaTabProps) => {
  const [copied, setCopied] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PopulatedJoinRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

  const fetchPendingRequests = useCallback(async () => {
    if (!poolId || !isCurrentUserAdmin) {
      setPendingRequests([]);
      return;
    }
    setIsLoadingRequests(true);
    try {
      const response = await api.get(`/api/microfunding/pool/${poolId}/join-requests?status=PENDING`);
      if (response.data.success) {
        setPendingRequests(response.data.requests || []);
      } else {
        toast.error(response.data.message || "Gagal memuat permintaan bergabung.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat memuat permintaan.");
      console.error("Fetch pending requests error:", error);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [poolId, isCurrentUserAdmin]);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleCopy = () => {
    if (!poolCode) return;
    navigator.clipboard.writeText(poolCode);
    setCopied(true);
    toast.success("Kode pool berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateRequestStatus = async (requestId: string, newStatus: "APPROVED" | "REJECTED") => {
    setProcessingRequestId(requestId);
    try {
      console.log(`Sending request to update join request ${requestId} to status: ${newStatus}`);
      const response = await api.patch(`/api/microfunding/join-requests/${requestId}`, { status: newStatus });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchPendingRequests();
      } else {
        toast.error(response.data.message || `Gagal ${newStatus === "APPROVED" ? "menyetujui" : "menolak"} permintaan.`);
      }
    } catch (error: any) {
      console.error(`Error updating request ${requestId} to ${newStatus}:`, error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);

      const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.";
      toast.error(errorMsg);
    } finally {
      setProcessingRequestId(null);
    }
  };

  return (
    <div className="p-1 md:p-6 bg-white">
      {" "}
      <h3 className="text-xl font-bold text-gray-900 mb-2">Undang Anggota Baru</h3>
      <p className="text-gray-600 mb-6">Bagikan kode undangan untuk mengundang anggota baru ke pool Anda:</p>
      <div className="flex flex-col sm:flex-row w-full justify-between gap-4 sm:gap-16 mb-8">
        <div className="flex items-center flex-grow bg-gray-50 rounded-xl p-4">
          <span className="text-lg sm:text-xl font-bold text-gray-800 flex-1 mr-4 break-all">{poolCode || "MEMUAT..."}</span>
          <button
            onClick={handleCopy}
            disabled={!poolCode}
            className="bg-[var(--color-p-300)] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-[var(--color-p-400)] transition-colors duration-300 text-sm sm:text-base disabled:opacity-50"
          >
            <Copy size={18} />
            {copied ? "Tersalin!" : "Salin"}
          </button>
        </div>

        <div className="mb-0 sm:mb-8">
          {" "}
          <h4 className="text-base font-semibold text-gray-700 mb-2 sm:mb-4">Bagikan melalui:</h4>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {["WhatsApp", "Email", "Salin Tautan"].map((platform) => (
              <button
                key={platform}
                disabled={!poolCode}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50"
              >
                <Share2 size={14} />
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isCurrentUserAdmin && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-6 mt-8">Permintaan Bergabung</h3>
          {isLoadingRequests ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-p-300)]" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Tidak ada permintaan bergabung yang tertunda.</p>
          ) : (
            <div className="bg-white rounded-lg overflow-x-auto">
              {" "}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Nama", "Status", "Tanggal Permintaan", "Aksi"].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pendingRequests.map((request) => (
                    <tr key={request._id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{request.user_id?.name?.charAt(0).toUpperCase() || "U"}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.user_id?.name || "Nama Tidak Ada"}</div>
                            <div className="text-sm text-gray-500">{request.user_id?.email || "Email Tidak Ada"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full
                                                ${request.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""} 
                                            `}
                        >
                          {" "}
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.requested_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateRequestStatus(request._id, JoinRequestStatus.REJECTED)}
                            disabled={processingRequestId === request._id}
                            className="py-2 px-3 rounded-full text-xs font-semibold transition-colors duration-300 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                          >
                            {processingRequestId === request._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tolak"}
                          </button>
                          <button
                            onClick={() => handleUpdateRequestStatus(request._id, JoinRequestStatus.APPROVED)}
                            disabled={processingRequestId === request._id}
                            className="py-2 px-3 rounded-full text-xs font-semibold transition-colors duration-300 bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                          >
                            {processingRequestId === request._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Terima"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UndangAnggotaTab;
