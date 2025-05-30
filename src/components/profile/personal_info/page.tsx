'use client';
import React, { useState } from 'react';

export interface PersonalInfoProps {
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;
}

export interface PersonalInfoFormData {
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  tanggalLahir: string;
  jenisKelamin: string;
  nik: string;
  alamatLengkap: string;
  provinsi: string;
  kota: string;
  kodePos: string;
}

export interface InfoProps {
  label: string;
  value: string;
}

export interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}


const Info: React.FC<InfoProps> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-800 font-medium text-lg">{value}</span>
  </div>
);

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-gray-500 text-sm mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] focus:border-transparent"
    />
  </div>
);

const SelectField: React.FC<SelectFieldProps> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col">
    <label className="text-gray-500 text-sm mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const PersonalInfo: React.FC<PersonalInfoProps> = ({ isEditMode, setIsEditMode }) => {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    namaLengkap: 'Johan Arizona',
    email: 'johanariz@gmail.com',
    nomorTelepon: '+6281234567890',
    tanggalLahir: '15 Agustus 1985',
    jenisKelamin: 'Laki-laki',
    nik: '3201011508850001',
    alamatLengkap: 'Jl. Merdeka No. 123, RT 05/RW 02',
    provinsi: 'DKI Jakarta',
    kota: 'Jakarta Selatan',
    kodePos: '64151'
  });

  const handleInputChange = (field: keyof PersonalInfoFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving data:", formData);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Pribadi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <InputField label="Nama Lengkap" value={formData.namaLengkap} onChange={(value) => handleInputChange('namaLengkap', value)} />
            <InputField label="Email" value={formData.email} onChange={(value) => handleInputChange('email', value)} />
            <InputField label="Nomor Telepon" value={formData.nomorTelepon} onChange={(value) => handleInputChange('nomorTelepon', value)} />
            <InputField label="Tanggal Lahir" value={formData.tanggalLahir} onChange={(value) => handleInputChange('tanggalLahir', value)} />
            <SelectField
              label="Jenis Kelamin"
              value={formData.jenisKelamin}
              options={['Laki-laki', 'Perempuan']}
              onChange={(value) => handleInputChange('jenisKelamin', value)}
            />
            <InputField label="NIK" value={formData.nik} onChange={(value) => handleInputChange('nik', value)} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Alamat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <InputField label="Alamat Lengkap" value={formData.alamatLengkap} onChange={(value) => handleInputChange('alamatLengkap', value)} />
            <InputField label="Provinsi" value={formData.provinsi} onChange={(value) => handleInputChange('provinsi', value)} />
            <InputField label="Kota" value={formData.kota} onChange={(value) => handleInputChange('kota', value)} />
            <InputField label="Kode Pos" value={formData.kodePos} onChange={(value) => handleInputChange('kodePos', value)} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[var(--color-p-300)] text-white rounded-lg hover:bg-[var(--color-p-400)] transition-colors duration-200"
          >
            Simpan
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Pribadi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <Info label="Nama Lengkap" value={formData.namaLengkap} />
          <Info label="Email" value={formData.email} />
          <Info label="Nomor Telepon" value={formData.nomorTelepon} />
          <Info label="Tanggal Lahir" value={formData.tanggalLahir} />
          <Info label="Jenis Kelamin" value={formData.jenisKelamin} />
          <Info label="NIK" value={formData.nik} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Alamat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <Info label="Alamat Lengkap" value={formData.alamatLengkap} />
          <Info label="Provinsi" value={formData.provinsi} />
          <Info label="Kota" value={formData.kota} />
          <Info label="Kode Pos" value={formData.kodePos} />
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
