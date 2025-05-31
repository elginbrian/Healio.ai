"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { IDisbursement, IPoolMember, IMicrofundingPool, DisbursementStatus, VoteOption } from "@/types";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";
import { Loader2, PlusCircle, ChevronDown, ChevronUp, AlertTriangle, Info, CheckCircle, XCircle, HelpCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import RequestDisbursementModal from "./modal";

interface DisbursementsTabProps {
  poolId?: string;
  poolDetails?: IMicrofundingPool;
  currentUserMembership?: IPoolMember | null;
}

interface DisbursementItemProps {
  disbursement: IDisbursement;
  poolDetails: IMicrofundingPool;
  currentUserId: string | undefined;
  onVoteSuccess: () => void;
  isPoolAdmin: boolean;
}

const DisbursementItem: React.FC<DisbursementItemProps> = ({ disbursement, poolDetails, currentUserId, onVoteSuccess, isPoolAdmin }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const userVote = disbursement.voters.find((v) => v.user_id.toString() === currentUserId);
  const canVote =
    disbursement.status === DisbursementStatus.PENDING_VOTE &&
    !userVote &&
    currentUserId !== disbursement.recipient_user_id.toString() && // User cannot vote on their own request
    new Date(disbursement.voting_deadline || 0) > new Date();

  const handleVote = async (voteOption: VoteOption) => {
    if (!currentUserId || !disbursement._id) return;
    setIsVoting(true);
    try {
      const response = await api.post(`/api/microfunding/disbursements/${disbursement._id}/vote`, {
        vote: voteOption,
      });
      if (response.data.success) {
        toast.success("Vote Anda berhasil direkam!");
        onVoteSuccess(); // Refresh the list
      } else {
        toast.error(response.data.message || "Gagal merekam vote.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat voting.");
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusChip = (status: DisbursementStatus) => {
    switch (status) {
      case DisbursementStatus.PENDING_VOTE:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Menunggu Vote</span>;
      case DisbursementStatus.APPROVED:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Disetujui</span>;
      case DisbursementStatus.REJECTED:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">Ditolak</span>;
      case DisbursementStatus.PROCESSING_PAYOUT:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">Diproses</span>;
      case DisbursementStatus.DISBURSED:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700">Dicairkan</span>;
      case DisbursementStatus.FAILED_PAYOUT:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700">Pencairan Gagal</span>;
      case DisbursementStatus.CANCELLED:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">Dibatalkan</span>;
      default:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <h4 className="text-md font-semibold text-gray-800">
            Rp {disbursement.amount.toLocaleString("id-ID")} - {disbursement.purpose}
          </h4>
          <p className="text-xs text-gray-500">
            Diajukan oleh: {(disbursement.requested_by_user_id as any).name || "N/A"} pada {new Date(disbursement.request_date).toLocaleDateString("id-ID")}
          </p>
          <p className="text-xs text-gray-500">Untuk: {(disbursement.recipient_user_id as any).name || "N/A"}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusChip(disbursement.status)}
          {expanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Detail Tujuan:</span> {disbursement.purpose}
          </p>
          {disbursement.proof_url && (
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Bukti:</span>{" "}
              <a href={disbursement.proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Lihat Bukti
              </a>
            </p>
          )}
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Status:</span> {getStatusChip(disbursement.status)}
          </p>

          {disbursement.status === DisbursementStatus.PENDING_VOTE && (
            <>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Batas Waktu Vote:</span> {disbursement.voting_deadline ? new Date(disbursement.voting_deadline).toLocaleString("id-ID") : "N/A"}
              </p>
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <p className="text-xs font-medium text-gray-600 mb-1">Voting Progress (Total Anggota: {poolDetails?.max_members || "N/A"}):</p>
                <div className="flex items-center text-xs">
                  <ThumbsUp size={14} className="text-green-500 mr-1" /> {disbursement.votes_for} Setuju
                  <ThumbsDown size={14} className="text-red-500 ml-3 mr-1" /> {disbursement.votes_against} Tolak
                </div>
                {poolDetails?.claim_approval_system === "VOTING_50_PERCENT" && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Dibutuhkan {">"}
                    {Math.floor((poolDetails?.max_members || 0) / 2)} suara setuju.
                  </p>
                )}
              </div>
            </>
          )}
          {userVote && (
            <p className="text-sm italic text-gray-600 mt-2">
              Anda telah vote: <span className="font-medium">{userVote.vote}</span>
            </p>
          )}

          {canVote && (
            <div className="mt-4 flex space-x-3">
              <button onClick={() => handleVote(VoteOption.FOR)} disabled={isVoting} className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition text-sm disabled:opacity-50">
                {isVoting ? <Loader2 className="animate-spin inline mr-1 h-4 w-4" /> : <ThumbsUp size={16} className="inline mr-1" />} Setuju
              </button>
              <button onClick={() => handleVote(VoteOption.AGAINST)} disabled={isVoting} className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50">
                {isVoting ? <Loader2 className="animate-spin inline mr-1 h-4 w-4" /> : <ThumbsDown size={16} className="inline mr-1" />} Tolak
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DisbursementsTab: React.FC<DisbursementsTabProps> = ({ poolId, poolDetails, currentUserMembership }) => {
  const [disbursements, setDisbursements] = useState<IDisbursement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth(); // Get current user from auth context

  const fetchDisbursements = useCallback(async () => {
    if (!poolId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/microfunding/pool/${poolId}/disbursements`);
      if (response.data.success) {
        // Sort by request_date descending initially
        const sortedData = response.data.disbursements.sort((a: IDisbursement, b: IDisbursement) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime());
        setDisbursements(sortedData || []);
      } else {
        setError(response.data.message || "Gagal memuat data pengajuan dana.");
        toast.error(response.data.message || "Gagal memuat data pengajuan dana.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat memuat pengajuan.");
    } finally {
      setIsLoading(false);
    }
  }, [poolId]);

  useEffect(() => {
    fetchDisbursements();
  }, [fetchDisbursements]);

  const handleDisbursementRequested = () => {
    setIsModalOpen(false);
    fetchDisbursements(); // Refresh the list
  };

  const isPoolAdmin = currentUserMembership?.role === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--color-p-300)]" />
        <p className="ml-3 text-gray-600">Memuat data pengajuan dana...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Pengajuan & Pencairan Dana</h3>
        {currentUserMembership && ( // Only show button if user is a member
          <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-[var(--color-p-300)] text-white py-2 px-4 rounded-lg hover:bg-[var(--color-p-400)] transition font-semibold text-sm">
            <PlusCircle size={18} className="mr-2" />
            Ajukan Dana
          </button>
        )}
      </div>

      {disbursements.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <HelpCircle size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">Belum ada pengajuan pencairan dana untuk pool ini.</p>
          {currentUserMembership && <p className="text-sm text-gray-400 mt-1">Anda dapat membuat pengajuan baru jika diperlukan.</p>}
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {poolDetails &&
            disbursements.map((disbursement) => (
              <DisbursementItem key={disbursement._id.toString()} disbursement={disbursement} poolDetails={poolDetails} currentUserId={user?._id} onVoteSuccess={fetchDisbursements} isPoolAdmin={isPoolAdmin} />
            ))}
        </div>
      )}

      {isModalOpen && poolId && poolDetails && (
        <RequestDisbursementModal poolId={poolId} poolName={poolDetails.title} maxDisbursableAmount={poolDetails.current_amount} onClose={() => setIsModalOpen(false)} onSuccess={handleDisbursementRequested} />
      )}
    </div>
  );
};

export default DisbursementsTab;
