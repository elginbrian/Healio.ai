"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { ChevronDown } from "lucide-react";

interface Step4AlamatKesehatanProps {
  formData: {
    alamatLengkap: string;
    kotaKabupaten: string;
    kodePos: string;
    provinsi: string;
    riwayatKesehatan: string;
    persetujuanAnalisisData: boolean;
  };
  onFormDataChange: (field: string, value: string | boolean) => void;
  onSubmitProfile: (e: FormEvent) => void;
  onGoToPreviousStep?: () => void;
  isLoading: boolean;
}

const daftarProvinsi = ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten", "Yogyakarta"];

const Step4AlamatKesehatan: React.FC<Step4AlamatKesehatanProps> = ({ formData, onFormDataChange, onSubmitProfile, onGoToPreviousStep, isLoading }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      onFormDataChange(name, (e.target as HTMLInputElement).checked);
    } else {
      onFormDataChange(name, value);
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Alamat dan Riwayat Kesehatan</h3>
      <form onSubmit={onSubmitProfile} className="space-y-5">
        <div>
          <label htmlFor="alamatLengkap" className="block text-sm font-medium text-gray-500 mb-1">
            Alamat Lengkap
          </label>
          <textarea
            id="alamatLengkap"
            name="alamatLengkap"
            rows={3}
            value={formData.alamatLengkap}
            onChange={handleInputChange}
            placeholder="Masukkan alamat lengkap Anda"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="kotaKabupaten" className="block text-sm font-medium text-gray-500 mb-1">
              Kota/Kabupaten
            </label>
            <input
              type="text"
              id="kotaKabupaten"
              name="kotaKabupaten"
              value={formData.kotaKabupaten}
              onChange={handleInputChange}
              placeholder="Nama Kota/Kabupaten"
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="kodePos" className="block text-sm font-medium text-gray-500 mb-1">
              Kode Pos
            </label>
            <input
              type="text"
              id="kodePos"
              name="kodePos"
              value={formData.kodePos}
              onChange={handleInputChange}
              placeholder="Kode Pos"
              pattern="\d{5}"
              title="Kode Pos harus 5 digit angka"
              className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="provinsi" className="block text-sm font-medium text-gray-500 mb-1">
            Provinsi
          </label>
          <div className="relative">
            <select
              id="provinsi"
              name="provinsi"
              value={formData.provinsi}
              onChange={handleInputChange}
              className="appearance-none w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
              required
              disabled={isLoading}
            >
              <option value="" disabled>
                Pilih Provinsi
              </option>
              {daftarProvinsi.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="riwayatKesehatan" className="block text-sm font-medium text-gray-500 mb-1">
            Riwayat Kesehatan
          </label>
          <textarea
            id="riwayatKesehatan"
            name="riwayatKesehatan"
            rows={4}
            value={formData.riwayatKesehatan}
            onChange={handleInputChange}
            placeholder="Jelaskan riwayat kesehatan Anda (opsional)"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            id="persetujuanAnalisisData"
            name="persetujuanAnalisisData"
            type="checkbox"
            checked={formData.persetujuanAnalisisData}
            onChange={handleInputChange}
            className="h-5 w-5 rounded border-gray-300 text-[var(--color-p-300)] focus:ring-[var(--color-p-300)] accent-[var(--color-p-300)]"
            disabled={isLoading}
            required
          />
          <label htmlFor="persetujuanAnalisisData" className="text-sm text-gray-600">
            Saya setuju data saya dianalisis oleh AI untuk rekomendasi fasilitas kesehatan
          </label>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto justify-center rounded-xl bg-[var(--color-p-300)] px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[var(--color-p-400)] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            disabled={isLoading || !formData.alamatLengkap || !formData.kotaKabupaten || !formData.kodePos || !formData.provinsi || !formData.persetujuanAnalisisData}
          >
            {isLoading ? <>Loading...</> : "Simpan Profil"}
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

export default Step4AlamatKesehatan;

