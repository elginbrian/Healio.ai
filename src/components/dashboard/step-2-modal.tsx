"use client";

import React, { ChangeEvent, FormEvent, useRef } from "react";
import { UploadCloud, AlertTriangle } from "lucide-react";

interface Step2VerifikasiKTPProps {
  formData: {
    nik: string;
    ktpImage: File | null;
  };
  ktpImagePreview: string | null;
  onFormDataChange: (field: string, value: string | File | null) => void;
  onKtpFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmitStep: (e: FormEvent) => void;
  onGoToPreviousStep?: () => void;
  isLoading: boolean;
}

const Step2VerifikasiKTP: React.FC<Step2VerifikasiKTPProps> = ({ formData, ktpImagePreview, onFormDataChange, onKtpFileChange, onSubmitStep, onGoToPreviousStep, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerKtpFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleNikChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    onFormDataChange("nik", value);
  };

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Verifikasi KTP</h3>
      <p className="text-sm text-gray-600 mb-6">Verifikasi identitas Anda untuk keamanan dan akurasi rekomendasi.</p>
      <form onSubmit={onSubmitStep} className="space-y-5">
        <div>
          <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Induk Kependudukan (NIK)
          </label>
          <input
            type="text"
            id="nik"
            name="nik"
            value={formData.nik}
            onChange={handleNikChange}
            placeholder="16 digit NIK Anda"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            required
            minLength={16}
            maxLength={16}
            pattern="\d{16}"
            title="NIK harus terdiri dari 16 digit angka."
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">Format: 16 digit angka tanpa spasi</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Foto KTP</label>
          <div
            onClick={triggerKtpFileInput}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                onKtpFileChange({ target: { files: e.dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            className="mt-1 flex justify-center items-center flex-col px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-[var(--color-p-300)] transition-colors"
          >
            {ktpImagePreview ? <img src={ktpImagePreview} alt="Preview KTP" className="max-h-40 rounded-lg object-contain mb-2" /> : <UploadCloud size={48} className="mx-auto text-gray-400 mb-2" />}
            <div className="space-y-1 text-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[var(--color-p-300)]">Seret dan lepas berkas</span> atau klik untuk mengunggah
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP hingga 2MB</p>
            </div>
            <input id="ktp-upload" name="ktp-upload" type="file" accept="image/png, image/jpeg, image/webp" className="sr-only" ref={fileInputRef} onChange={onKtpFileChange} disabled={isLoading} />
          </div>
          {formData.ktpImage && <p className="mt-1 text-xs text-gray-500">File terpilih: {formData.ktpImage.name}</p>}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Data KTP Anda aman dan hanya digunakan untuk verifikasi identitas. Kami tidak akan membagikan data ini kepada pihak ketiga.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto justify-center rounded-xl bg-[var(--color-p-300)] px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[var(--color-p-400)] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            disabled={isLoading || !formData.nik || !formData.ktpImage || formData.nik.length !== 16}
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

export default Step2VerifikasiKTP;

