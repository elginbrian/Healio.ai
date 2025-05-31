"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, DollarSign, FileText, UserCircle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { IPoolMember, IUser } from "@/types"; // Assuming IUser might be needed if selecting recipients

interface RequestDisbursementModalProps {
  poolId: string;
  poolName: string;
  maxDisbursableAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const RequestDisbursementModal: React.FC<RequestDisbursementModalProps> = ({ poolId, poolName, maxDisbursableAmount, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const [proofUrl, setProofUrl] = useState<string>("");
  // const [recipientUserId, setRecipientUserId] = useState<string>(user?._id || ''); // Default to self, or allow selection if admin
  // const [poolMembers, setPoolMembers] = useState<IUser[]>([]); // For admin to select recipient

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // // Fetch pool members if admin needs to select recipient (Optional advanced feature)
  // useEffect(() => {
  //   const fetchMembersForSelection = async () => {
  //     if (user?.isAdminForThisPool) { // You'd need a way to determine this
  //       try {
  //         const response = await api.get(`/api/microfunding/pool/${poolId}/members`);
  //         if (response.data.success) {
  //           setPoolMembers(response.data.members.map((m: any) => m.user_id));
  //         }
  //       } catch (error) {
  //         console.error("Failed to fetch pool members for recipient selection", error);
  //       }
  //     }
  //   };
  //   fetchMembersForSelection();
  // }, [poolId, user?.isAdminForThisPool]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("Jumlah harus berupa angka positif.");
      return;
    }
    if (numericAmount > maxDisbursableAmount) {
      setFormError(`Jumlah tidak boleh melebihi dana tersedia di pool (Rp ${maxDisbursableAmount.toLocaleString("id-ID")}).`);
      return;
    }
    if (!purpose.trim()) {
      setFormError("Tujuan pengajuan dana wajib diisi.");
      return;
    }
    if (!user?._id) {
      setFormError("Pengguna tidak teridentifikasi. Silakan login ulang.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        recipient_user_id: user._id, // For now, user requests for themselves.
        amount: numericAmount,
        purpose: purpose.trim(),
        proof_url: proofUrl.trim() || undefined,
      };

      const response = await api.post(`/api/microfunding/pool/${poolId}/disbursements`, payload);

      if (response.data.success) {
        toast.success(response.data.message || "Permintaan pengajuan dana berhasil dikirim!");
        onSuccess();
      } else {
        toast.error(response.data.message || "Gagal mengirim permintaan.");
        setFormError(response.data.message);
      }
    } catch (error: any) {
      console.error("Error submitting disbursement request:", error);
      const errMsg = error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error(errMsg);
      setFormError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl transform transition-all">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Ajukan Pencairan Dana</h3>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Mengajukan dana dari pool: <span className="font-medium text-[var(--color-p-300)]">{poolName}</span>.
            <br />
            Dana tersedia di pool: <span className="font-medium">Rp {maxDisbursableAmount.toLocaleString("id-ID")}</span>.
          </p>

          {/* Optional: Recipient Selection for Admins
          {user?.isAdminForThisPool && (
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">Penerima Dana</label>
              <select id="recipient" value={recipientUserId} onChange={(e) => setRecipientUserId(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] outline-none">
                <option value="">Pilih Penerima</option>
                {poolMembers.map(member => (
                  <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
                ))}
              </select>
            </div>
          )} */}

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Pengajuan (Rp)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 500000"
                className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] outline-none"
                required
                disabled={isLoading}
                min="1"
                max={maxDisbursableAmount}
              />
            </div>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
              Tujuan Pengajuan Dana
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 top-3 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="purpose"
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Contoh: Biaya rawat inap, pembelian obat, dll."
                className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] outline-none resize-none"
                required
                disabled={isLoading}
                maxLength={500}
              />
            </div>
          </div>

          <div>
            <label htmlFor="proofUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL Bukti Pendukung (Opsional)
            </label>
            <input
              type="url"
              id="proofUrl"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://contoh.com/bukti.jpg atau link Google Drive"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] outline-none"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">Link ke foto struk, tagihan rumah sakit, atau dokumen pendukung lainnya.</p>
          </div>

          {formError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{formError}</p>}

          <div className="pt-2 flex justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
              Batal
            </button>
            <button type="submit" disabled={isLoading} className="py-2 px-4 bg-[var(--color-p-300)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-p-400)] transition disabled:opacity-50 flex items-center justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Mengirim...
                </>
              ) : (
                "Kirim Pengajuan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestDisbursementModal;
