"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { ChevronDown } from "lucide-react";

interface Step3PekerjaanPendapatanProps {
  formData: {
    pekerjaan: string;
    perusahaan: string;
    lamaBekerjaJumlah: string;
    lamaBekerjaSatuan: string;
    pendapatanBulanan: string;
    sumberPendapatanLain: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onSubmitStep: (e: FormEvent) => void;
  onGoToPreviousStep?: () => void;
  isLoading: boolean;
}

const Step3PekerjaanPendapatan: React.FC<Step3PekerjaanPendapatanProps> = ({ formData, onFormDataChange, onSubmitStep, onGoToPreviousStep, isLoading }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFormDataChange(e.target.name, e.target.value);
  };

  const handlePendapatanChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, "");
    onFormDataChange("pendapatanBulanan", value);
  };

  const formatToRupiah = (angka: string) => {
    if (!angka) return "";
    return `Rp ${parseInt(angka, 10).toLocaleString("id-ID")}`;
  };

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Pekerjaan & Pendapatan</h3>
      <p className="text-sm text-gray-600 mb-6">Informasi ini membantu AI memberikan rekomendasi faskes yang sesuai.</p>
      <form onSubmit={onSubmitStep} className="space-y-5">
        <div>
          <label htmlFor="pekerjaan" className="block text-sm font-medium text-gray-500 mb-1">
            Pekerjaan
          </label>
          <input
            type="text"
            id="pekerjaan"
            name="pekerjaan"
            value={formData.pekerjaan}
            onChange={handleInputChange}
            placeholder="Pekerjaan Anda saat ini"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="perusahaan" className="block text-sm font-medium text-gray-500 mb-1">
            Perusahaan/Instansi
          </label>
          <input
            type="text"
            id="perusahaan"
            name="perusahaan"
            value={formData.perusahaan}
            onChange={handleInputChange}
            placeholder="Nama perusahaan/instansi"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="lamaBekerjaJumlah" className="block text-sm font-medium text-gray-500 mb-1">
            Lama Bekerja
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              id="lamaBekerjaJumlah"
              name="lamaBekerjaJumlah"
              value={formData.lamaBekerjaJumlah}
              onChange={handleInputChange}
              placeholder="Jumlah"
              className="w-2/3 rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
              required
              min="0"
              disabled={isLoading}
            />
            <div className="relative w-1/3">
              <select
                id="lamaBekerjaSatuan"
                name="lamaBekerjaSatuan"
                value={formData.lamaBekerjaSatuan}
                onChange={handleInputChange}
                className="appearance-none w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
                required
                disabled={isLoading}
              >
                <option value="BULAN">Bulan</option>
                <option value="TAHUN">Tahun</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="pendapatanBulanan" className="block text-sm font-medium text-gray-500 mb-1">
            Pendapatan Bulanan
          </label>
          <input
            type="text"
            id="pendapatanBulanan"
            name="pendapatanBulanan"
            value={formatToRupiah(formData.pendapatanBulanan)}
            onChange={handlePendapatanChange}
            placeholder="Rp 0"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="sumberPendapatanLain" className="block text-sm font-medium text-gray-500 mb-1">
            Sumber Pendapatan Lain
          </label>
          <div className="relative">
            <select
              id="sumberPendapatanLain"
              name="sumberPendapatanLain"
              value={formData.sumberPendapatanLain}
              onChange={handleInputChange}
              className="appearance-none w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
              required
              disabled={isLoading}
            >
              <option value="" disabled>
                Pilih sumber
              </option>
              <option value="TIDAK_ADA">Tidak ada</option>
              <option value="INVESTASI">Investasi</option>
              <option value="BISNIS_SAMPINGAN">Bisnis Sampingan</option>
              <option value="FREELANCE">Freelance</option>
              <option value="LAINNYA">Lainnya (isi manual)</option>
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto justify-center rounded-xl bg-[var(--color-p-300)] px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[var(--color-p-400)] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            disabled={isLoading || !formData.pekerjaan || !formData.perusahaan || !formData.lamaBekerjaJumlah || !formData.pendapatanBulanan}
          >
            {isLoading ? <>Loading...</> : "Selanjutnya"}
          </button>
          {onGoToPreviousStep && (
            <button
              type="button"
              onClick={onGoToPreviousStep}
              className="w-full sm:w-auto justify-center rounded-xl bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              disabled={isLoading}
            >
              Sebelumnya
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Step3PekerjaanPendapatan;

