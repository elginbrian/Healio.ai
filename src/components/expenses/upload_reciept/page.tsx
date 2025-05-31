"use client";

import { CloudUpload, Loader2 } from "lucide-react";
import React, { useRef, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface UploadReceiptProps {
  onUploadSuccess: () => void;
}

const UploadReceipt = ({ onUploadSuccess }: UploadReceiptProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal adalah 5MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Tipe file tidak didukung. Harap unggah JPG, PNG, atau WEBP.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal adalah 5MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Tipe file tidak didukung. Harap unggah JPG, PNG, atau WEBP.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleScanClick = async () => {
    if (!selectedFile) {
      toast.error("Silakan pilih file struk terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Mengunggah dan memproses struk...");

    const formData = new FormData();
    formData.append("receiptImage", selectedFile);

    try {
      const response = await api.post("/api/expenses/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const itemCount = response.data.expenses?.length || 0;
        const totalAmount = response.data.expenses?.reduce((sum: number, exp: any) => sum + exp.total_price, 0) || 0;

        toast.success(
          <div>
            <p>Struk berhasil diproses!</p>
            <p className="text-sm">
              {itemCount} item | Total: Rp {totalAmount.toLocaleString("id-ID")}
            </p>
          </div>,
          { id: toastId, duration: 4000 }
        );

        onUploadSuccess();
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        throw new Error(response.data.message || "Gagal memproses struk.");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || error.message || "Terjadi kesalahan saat memproses struk.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-8">
      <p className="text-[var(--color-p-300)] font-semibold text-xl mb-4">Unggah Struk</p>
      <div className="w-full shadow-md rounded-2xl bg-white p-6">
        <div
          className={`w-full h-80 border-2 border-dashed border-[var(--color-p-300)] rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors hover:bg-pink-50`}
          onClick={triggerFileInput}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {isLoading ? (
            <Loader2 size={48} className="text-[var(--color-p-300)] animate-spin mb-4" />
          ) : previewUrl ? (
            <div className="mt-2 max-h-48 overflow-hidden rounded-lg border">
              <img src={previewUrl} alt="Preview Struk" className="w-auto h-full max-h-48 object-contain mx-auto" />
            </div>
          ) : (
            <CloudUpload size={48} className="text-[var(--color-p-300)] mb-4" />
          )}
          <p className="text-[var(--color-p-300)] text-lg mt-4">{isLoading ? "Sedang Memproses..." : selectedFile ? selectedFile.name : "Seret dan lepas berkas atau klik untuk mengunggah"}</p>
          {!selectedFile && !isLoading && <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP (Maks 5MB)</p>}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={isLoading} />
        </div>

        <button className="mt-6 w-full py-3 bg-[var(--color-p-300)] text-white font-semibold rounded-full disabled:opacity-50 flex items-center justify-center" disabled={!selectedFile || isLoading} onClick={handleScanClick}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Memproses...
            </>
          ) : (
            "Scan Struk"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadReceipt;

