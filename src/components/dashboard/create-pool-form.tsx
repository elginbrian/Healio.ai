"use client";
import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ContributionPeriod, ClaimApprovalSystem, IMicrofundingPool } from "@/types";

export interface CreatePoolFormProps {
  onClose: () => void;
  onPoolCreated?: (newPool: IMicrofundingPool) => void;
}

const CreatePoolForm = ({ onClose, onPoolCreated }: CreatePoolFormProps) => {
  const [namaPool, setNamaPool] = useState("");
  const [jenisKomunitas, setJenisKomunitas] = useState("Komunitas Profesi");
  const [jumlahMaksimalAnggota, setJumlahMaksimalAnggota] = useState("");
  const [periodeKontribusi, setPeriodeKontribusi] = useState<ContributionPeriod>(ContributionPeriod.MONTHLY);
  const [jumlahIuran, setJumlahIuran] = useState("");
  const [deskripsiPool, setDeskripsiPool] = useState("");
  const [cakupanManfaat, setCakupanManfaat] = useState<string[]>([]);
  const [durasiVotingKlaim, setDurasiVotingKlaim] = useState("24_JAM");
  const [menyetujuiSyaratKetentuan, setMenyetujuiSyaratKetentuan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBenefitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setCakupanManfaat((prev) => (checked ? [...prev, value] : prev.filter((benefit) => benefit !== value)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menyetujuiSyaratKetentuan) {
      toast.error("Anda harus menyetujui syarat dan ketentuan.");
      return;
    }
    setIsLoading(true);

    const poolData = {
      title: namaPool,
      type_of_community: jenisKomunitas,
      max_members: parseInt(jumlahMaksimalAnggota, 10),
      contribution_period: periodeKontribusi,
      contribution_amount_per_member: parseInt(jumlahIuran.replace(/\D/g, ""), 10),
      description: deskripsiPool,
      benefit_coverage: cakupanManfaat,
      claim_approval_system: ClaimApprovalSystem.VOTING_50_PERCENT,
      claim_voting_duration: durasiVotingKlaim,
    };

    if (!poolData.title || !poolData.type_of_community || isNaN(poolData.max_members) || poolData.max_members <= 0 || !poolData.contribution_period || isNaN(poolData.contribution_amount_per_member) || !poolData.description) {
      toast.error("Harap isi semua field yang wajib diisi dengan benar.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<{ success: boolean; message?: string; pool: IMicrofundingPool }>("/api/microfunding/pool", poolData);
      if (response.data.success && response.data.pool) {
        toast.success(response.data.message || "Pool berhasil dibuat!");
        if (onPoolCreated) {
          onPoolCreated(response.data.pool);
        }
        onClose();
      } else {
        toast.error(response.data.message || "Gagal membuat pool.");
      }
    } catch (error: any) {
      console.error("Error creating pool:", error);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat membuat pool.");
    } finally {
      setIsLoading(false);
    }
  };

  const communityTypes = ["Komunitas Profesi", "Komunitas Hobi", "Komunitas Lokasi", "Komunitas Keluarga", "Lainnya"];
  const contributionPeriods = Object.values(ContributionPeriod);
  const votingDurations = ["24_JAM", "48_JAM", "72_JAM"];
  const benefitOptions = [
    { label: "Rawat Inap", value: "RAWAT_INAP" },
    { label: "Obat-obatan", value: "OBAT_OBATAN" },
    { label: "Konsultasi Dokter", value: "KONSULTASI_DOKTER" },
    { label: "Tindakan Operasi", value: "TINDAKAN_OPERASI" },
    { label: "Lainnya", value: "LAINNYA_MANFAAT" },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full relative overflow-y-auto max-h-[90vh] shadow-2xl">
        <button onClick={onClose} disabled={isLoading} className="absolute top-4 right-4 text-[var(--color-p-300)] hover:text-[var(--color-p-400)] transition p-2" aria-label="Close form">
          <X size={28} strokeWidth={2} />
        </button>
        <h2 className="text-2xl font-bold text-[var(--color-p-300)] mb-8 text-center">Buat Pool Dana Komunitas</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="namaPool" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pool
                </label>
                <input
                  type="text"
                  id="namaPool"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)]"
                  placeholder="Contoh: Pool Kesehatan RT 17"
                  value={namaPool}
                  onChange={(e) => setNamaPool(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="jenisKomunitas" className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Komunitas
                </label>
                <select
                  id="jenisKomunitas"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] appearance-none bg-white"
                  value={jenisKomunitas}
                  onChange={(e) => setJenisKomunitas(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  {communityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jumlahMaksimalAnggota" className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Maksimal Anggota
                </label>
                <input
                  type="number"
                  id="jumlahMaksimalAnggota"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)]"
                  placeholder="Contoh: 25"
                  value={jumlahMaksimalAnggota}
                  onChange={(e) => setJumlahMaksimalAnggota(e.target.value)}
                  required
                  min="1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="periodeKontribusi" className="block text-sm font-medium text-gray-700 mb-1">
                  Periode Kontribusi
                </label>
                <select
                  id="periodeKontribusi"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] appearance-none bg-white"
                  value={periodeKontribusi}
                  onChange={(e) => setPeriodeKontribusi(e.target.value as ContributionPeriod)}
                  required
                  disabled={isLoading}
                >
                  {contributionPeriods.map((period) => (
                    <option key={period} value={period}>
                      {period.charAt(0) + period.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="jumlahIuran" className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Iuran (per periode, per anggota)
                </label>
                <div className="flex items-center">
                  <span className="p-3 bg-gray-100 text-gray-700 rounded-l-xl border border-r-0 border-gray-300 text-sm">Rp</span>
                  <input
                    type="text"
                    id="jumlahIuran"
                    className="w-full p-3 border border-gray-300 rounded-r-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)]"
                    placeholder="Contoh: 100.000"
                    value={jumlahIuran}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      setJumlahIuran(numericValue ? parseInt(numericValue, 10).toLocaleString("id-ID") : "");
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cakupan Manfaat</label>
                <div className="space-y-2">
                  {benefitOptions.map((item) => (
                    <label key={item.value} className="flex items-center text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[var(--color-p-300)] mr-2 rounded border-gray-300 focus:ring-[var(--color-p-300)]"
                        value={item.value}
                        checked={cakupanManfaat.includes(item.value)}
                        onChange={handleBenefitChange}
                        disabled={isLoading}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sistem Persetujuan Klaim</label>
                <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-700 border border-gray-200">
                  <p className="font-semibold mb-1">Voting Anggota (50% + 1)</p>
                  <p className="text-xs">Setiap klaim harus disetujui oleh lebih dari 50% anggota pool dana.</p>
                </div>
              </div>
              <div>
                <label htmlFor="durasiVotingKlaim" className="block text-sm font-medium text-gray-700 mb-1">
                  Durasi Voting Klaim
                </label>
                <select
                  id="durasiVotingKlaim"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] appearance-none bg-white"
                  value={durasiVotingKlaim}
                  onChange={(e) => setDurasiVotingKlaim(e.target.value)}
                  required
                  disabled={isLoading}
                >
                  {votingDurations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="deskripsiPool" className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Pool
            </label>
            <textarea
              id="deskripsiPool"
              className="w-full p-3 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)] focus:border-[var(--color-p-300)] min-h-[100px]"
              placeholder="Jelaskan tujuan dan aturan pool dana komunitas Anda (maks. 500 karakter)"
              value={deskripsiPool}
              onChange={(e) => setDeskripsiPool(e.target.value)}
              required
              maxLength={500}
              disabled={isLoading}
            ></textarea>
          </div>
          <div className="mb-8 flex items-start">
            <input
              id="menyetujuiSyaratKetentuan"
              type="checkbox"
              className="h-5 w-5 accent-[var(--color-p-300)] mr-3 rounded border-gray-300 focus:ring-[var(--color-p-300)] mt-1"
              checked={menyetujuiSyaratKetentuan}
              onChange={(e) => setMenyetujuiSyaratKetentuan(e.target.checked)}
              required
              disabled={isLoading}
            />
            <label htmlFor="menyetujuiSyaratKetentuan" className="text-sm text-gray-700">
              Saya menyatakan bahwa informasi yang saya berikan adalah benar dan saya menyetujui{" "}
              <a href="/terms" target="_blank" className="text-[var(--color-p-300)] hover:underline font-medium">
                syarat dan ketentuan
              </a>{" "}
              serta{" "}
              <a href="/privacy" target="_blank" className="text-[var(--color-p-300)] hover:underline font-medium">
                kebijakan privasi
              </a>{" "}
              Healio.ai.
            </label>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !menyetujuiSyaratKetentuan}
              className="bg-[var(--color-p-300)] text-white font-semibold py-3 px-12 rounded-full hover:bg-[var(--color-p-400)] transition duration-300 text-base disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Buat Pool"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoolForm;
