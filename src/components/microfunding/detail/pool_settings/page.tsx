"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ContributionPeriod } from "@/types/enums";
import { IMicrofundingPool } from "@/types";

interface PoolSettingsFormProps {
  poolDetails?: IMicrofundingPool;
  isAdmin?: boolean;
}

const PoolSettingsForm = ({ poolDetails, isAdmin = false }: PoolSettingsFormProps) => {
  const [namaPool, setNamaPool] = useState("");
  const [jumlahKontribusiBulanan, setJumlahKontribusiBulanan] = useState("");
  const [jumlahMaksimalAnggota, setJumlahMaksimalAnggota] = useState("");
  const [deskripsiPool, setDeskripsiPool] = useState("");
  const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState("15");
  const [benefitCoverage, setBenefitCoverage] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (poolDetails) {
      setNamaPool(poolDetails.title);
      setJumlahKontribusiBulanan(poolDetails.contribution_amount_per_member.toString());
      setJumlahMaksimalAnggota(poolDetails.max_members.toString());
      setDeskripsiPool(poolDetails.description);
      setBenefitCoverage(poolDetails.benefit_coverage || []);

      if (poolDetails.created_date) {
        const createdDate = new Date(poolDetails.created_date);
        setTanggalJatuhTempo(createdDate.getDate().toString());
      }
    }
  }, [poolDetails]);

  const handleBenefitChange = (benefit: string, checked: boolean) => {
    if (checked) {
      setBenefitCoverage((prev) => [...prev, benefit]);
    } else {
      setBenefitCoverage((prev) => prev.filter((b) => b !== benefit));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error("Hanya admin yang dapat mengubah pengaturan pool");
      return;
    }

    if (!poolDetails?._id) {
      toast.error("ID Pool tidak ditemukan");
      return;
    }

    setIsSaving(true);

    try {
      const formattedAmount = parseInt(jumlahKontribusiBulanan.replace(/\D/g, ""));
      const formattedMaxMembers = parseInt(jumlahMaksimalAnggota);

      if (isNaN(formattedAmount) || formattedAmount <= 0) {
        toast.error("Jumlah kontribusi harus berupa angka positif");
        setIsSaving(false);
        return;
      }

      if (isNaN(formattedMaxMembers) || formattedMaxMembers <= 0) {
        toast.error("Jumlah maksimal anggota harus berupa angka positif");
        setIsSaving(false);
        return;
      }

      const updateData = {
        title: namaPool,
        description: deskripsiPool,
        max_members: formattedMaxMembers,
        contribution_amount_per_member: formattedAmount,
        benefit_coverage: benefitCoverage,
      };

      const response = await api.patch(`/api/microfunding/pool/${poolDetails._id}`, updateData);

      if (response.data.success) {
        toast.success("Pengaturan pool berhasil disimpan!");
      } else {
        toast.error(response.data.message || "Gagal menyimpan pengaturan pool");
      }
    } catch (error: any) {
      console.error("Error updating pool settings:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat menyimpan pengaturan");
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const benefitOptions = [
    { id: "RAWAT_INAP", label: "Rawat Inap" },
    { id: "OBAT_OBATAN", label: "Obat-obatan" },
    { id: "KONSULTASI_DOKTER", label: "Konsultasi Dokter" },
    { id: "TINDAKAN_OPERASI", label: "Tindakan Operasi" },
    { id: "LAINNYA", label: "Lainnya" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-p-300)]" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Pengaturan Pool</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between gap-8 mb-8">
          <div className="space-y-6 w-5/12 flex flex-col justify-between">
            <div>
              <label className="block text-gray-700 text-md font-semibold mb-2">Nama Pool</label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]"
                value={namaPool}
                onChange={(e) => setNamaPool(e.target.value)}
                required
                disabled={!isAdmin || isSaving}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-md font-semibold mb-2">Jumlah Kontribusi Bulanan</label>
              <div className="flex items-center">
                <span className="p-3 bg-gray-50 text-gray-800 rounded-l-xl border-2 border-r-0 border-gray-300 text-md">Rp</span>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-r-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]"
                  placeholder="200.000"
                  value={formatCurrency(jumlahKontribusiBulanan)}
                  onChange={(e) => {
                    setJumlahKontribusiBulanan(e.target.value);
                  }}
                  required
                  disabled={!isAdmin || isSaving}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-md font-semibold">Jumlah Maksimal Anggota</label>
              <input
                type="number"
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]"
                value={jumlahMaksimalAnggota}
                onChange={(e) => setJumlahMaksimalAnggota(e.target.value)}
                required
                disabled={!isAdmin || isSaving}
              />
            </div>
          </div>

          <div className="w-5/12 flex flex-col justify-between">
            <div className="">
              <label className="block text-gray-700 text-md font-semibold mb-2">Deskripsi</label>
              <textarea
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)] h-40"
                placeholder="Jelaskan tujuan dan aturan pool dana komunitas anda"
                value={deskripsiPool}
                onChange={(e) => setDeskripsiPool(e.target.value)}
                required
                disabled={!isAdmin || isSaving}
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-md font-semibold">Tanggal Jatuh Tempo</label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]"
                placeholder="Tanggal 15"
                value={tanggalJatuhTempo}
                onChange={(e) => setTanggalJatuhTempo(e.target.value)}
                required
                disabled={true}
              />
              <p className="text-xs text-gray-500 mt-1">Tanggal jatuh tempo tidak dapat diubah</p>
            </div>
          </div>

          <div className="w-2/12 space-y-6">
            <div>
              <label className="block text-gray-700 text-md font-semibold mb-2">Cakupan Manfaat</label>
              <div className="space-y-3">
                {benefitOptions.map((option) => (
                  <label key={option.id} className="flex items-center text-gray-800 text-md cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-[var(--color-p-300)] mr-3 rounded"
                      checked={benefitCoverage.includes(option.id)}
                      onChange={(e) => handleBenefitChange(option.id, e.target.checked)}
                      disabled={!isAdmin || isSaving}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              className="bg-gray-200 text-gray-700 font-semibold py-3 px-10 rounded-full hover:bg-gray-300 transition duration-300 text-md"
              disabled={isSaving}
              onClick={() => {
                if (poolDetails) {
                  setNamaPool(poolDetails.title);
                  setJumlahKontribusiBulanan(poolDetails.contribution_amount_per_member.toString());
                  setJumlahMaksimalAnggota(poolDetails.max_members.toString());
                  setDeskripsiPool(poolDetails.description);
                  setBenefitCoverage(poolDetails.benefit_coverage || []);
                }
              }}
            >
              Batal
            </button>
            <button type="submit" className="bg-[var(--color-p-300)] text-white font-semibold py-3 px-10 rounded-full hover:bg-[var(--color-p-400)] transition duration-300 text-md flex items-center" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PoolSettingsForm;

