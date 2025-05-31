import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface JoinPoolFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const JoinPoolForm = ({ onClose, onSuccess }: JoinPoolFormProps) => {
  const [kodePool, setKodePool] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    if (!kodePool.trim()) {
      toast.error("Masukkan kode pool terlebih dahulu!");
      return;
    }

    const poolCode = kodePool.trim().toUpperCase();
    if (poolCode.length < 6 || poolCode.length > 8) {
      toast.error("Kode pool harus terdiri dari 6-8 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/microfunding/join-requests", {
        pool_code: poolCode,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Permintaan bergabung telah dikirim!");
        onSuccess();
      } else {
        toast.error(response.data.message || "Gagal mengirim permintaan bergabung.");
      }
    } catch (error: any) {
      console.error("Error joining pool:", error);
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat mengirim permintaan.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    setKodePool("");
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full relative shadow-2xl overflow-hidden">
        <div className="px-8 py-6 text-center bg-[var(--color-p-300)]">
          <button onClick={handleCancel} disabled={isLoading} className="absolute top-4 right-4 text-white hover:text-gray-200 transition p-1 disabled:opacity-50" aria-label="Close form">
            <X size={24} strokeWidth={2} />
          </button>
          <h2 className="text-2xl font-bold text-white mb-2">Gabung Pool</h2>
          <p className="text-white/90 text-sm">Masukkan kode untuk bergabung dengan pool</p>
        </div>

        <div className="px-8 py-8">
          <div className="mb-6">
            <label htmlFor="kodePoolInput" className="block text-gray-800 text-lg font-semibold mb-4 text-center">
              Masukkan Kode Pool
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl font-bold">#</span>
              <input
                id="kodePoolInput"
                type="text"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-lg text-gray-800 focus:outline-none focus:border-[var(--color-p-300)] text-center font-semibold tracking-wider uppercase"
                placeholder="KODEUNIK"
                value={kodePool}
                onChange={(e) => setKodePool(e.target.value.toUpperCase())}
                maxLength={8}
                disabled={isLoading}
              />
            </div>
            <p className="text-sm text-gray-500 text-center mt-3">Kode terdiri dari 6-8 karakter alfanumerik.</p>
          </div>

          <div className="flex gap-4">
            <button onClick={handleCancel} disabled={isLoading} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              Batal
            </button>
            <button
              onClick={handleJoin}
              disabled={isLoading || !kodePool.trim()}
              className="flex-1 bg-[var(--color-p-300)] text-white font-semibold py-3 px-6 rounded-xl transition duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:brightness-110"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Memproses...</span>
                </>
              ) : (
                "Minta Bergabung"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPoolForm;
