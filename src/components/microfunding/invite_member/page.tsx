"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Copy, Share2, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  const fetchPendingRequests = useCallback(async () => {
    if (!poolId || !isCurrentUserAdmin) {
      setPendingRequests([]);
      return;
    }

    setIsLoadingRequests(true);
    setError(null);

    try {
      console.log("Fetching join requests for pool:", poolId);
      const response = await api.get(`/api/microfunding/pool/${poolId}/join-requests?status=PENDING`);

      if (response.data.success) {
        console.log("Join requests fetched successfully:", response.data.requests);
        setPendingRequests(response.data.requests || []);

        if (response.data.requests.length === 0) {
          console.log("No pending join requests found");
        }
      } else {
        console.error("Failed to fetch join requests:", response.data.message);
        setError(response.data.message || "Gagal memuat permintaan bergabung.");
        toast.error(response.data.message || "Gagal memuat permintaan bergabung.");
      }
    } catch (error: any) {
      console.error("Error fetching join requests:", error);
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat memuat permintaan.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [poolId, isCurrentUserAdmin]);

  useEffect(() => {
    fetchPendingRequests();

    // Set up periodic refresh (every 30 seconds)
    if (poolId && isCurrentUserAdmin) {
      const intervalId = setInterval(fetchPendingRequests, 30000);
      return () => clearInterval(intervalId);
    }
  }, [fetchPendingRequests, poolId, isCurrentUserAdmin]);

  // ... existing code for handleCopy and handleUpdateRequestStatus ...

  return (
    <div className="p-1 md:p-6 bg-white">
      {/* ... existing code for invitation section ... */}

      {isCurrentUserAdmin && (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-6 mt-8">Permintaan Bergabung</h3>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                  <button onClick={fetchPendingRequests} className="mt-2 flex items-center text-sm text-red-600 hover:text-red-800">
                    <RefreshCw size={14} className="mr-1" /> Coba lagi
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoadingRequests ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-p-300)]" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Tidak ada permintaan bergabung yang tertunda.</p>
          ) : (
            <div className="bg-white rounded-lg overflow-x-auto">{/* ... existing table code ... */}</div>
          )}
        </>
      )}
    </div>
  );
};

export default UndangAnggotaTab;
