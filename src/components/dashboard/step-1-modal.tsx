"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

interface Step1InformasiDasarProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  onSubmitStep: (e: FormEvent) => void;
  isLoading: boolean;
}

const Step1InformasiDasar: React.FC<Step1InformasiDasarProps> = ({ formData, onFormDataChange, onSubmitStep, isLoading }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFormDataChange(e.target.name, e.target.value);
  };

  return (
    <>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Informasi dasar</h3>
      <form onSubmit={onSubmitStep} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-500 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Masukkan nama lengkap Anda"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">
            Alamat Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="contoh@email.com"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-1">
            Nomor Telepon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Nomor telepon Anda"
            className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-500 mb-1">
            Tanggal Lahir
          </label>
          <div className="relative">
            <input
              type="text"
              id="dob"
              name="dob"
              value={formData.dob}
              onFocus={(e) => (e.currentTarget.type = "date")}
              onBlur={(e) => !e.currentTarget.value && (e.currentTarget.type = "text")}
              onChange={handleInputChange}
              placeholder="hh/bb/tttt"
              className="w-full rounded-xl border border-gray-300 p-4 pr-12 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
              required
              disabled={isLoading}
            />
            <CalendarDays size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-500 mb-1">
            Jenis Kelamin
          </label>
          <div className="relative">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="appearance-none w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
              required
              disabled={isLoading}
            >
              <option value="" disabled>
                Pilih jenis kelamin
              </option>
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
              <option value="OTHER">Lainnya</option>
            </select>
            <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--color-p-300)] py-4 font-semibold text-white transition-all duration-300 hover:bg-[var(--color-p-400)] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <>Loading...</> : "Selanjutnya"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Step1InformasiDasar;
