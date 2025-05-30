'use client';
import React, { useState } from 'react';

// Interface for JobInfo component props
interface JobInfoProps {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

// Interface for JobData state
interface JobData {
  pekerjaan: string;
  perusahaan: string;
  lamaBekerja: string;
  pendapatanBulanan: string;
  sumberPendapatanLain: string;
}

const JobInfo: React.FC<JobInfoProps> = ({ isEditMode, setIsEditMode }) => {
  const [jobData, setJobData] = useState<JobData>({
    pekerjaan: 'Manajer Pemasaran',
    perusahaan: 'PT Maju Bersama',
    lamaBekerja: '5 Tahun',
    pendapatanBulanan: 'Rp15.000.000',
    sumberPendapatanLain: 'Investasi'
  });

  const handleInputChange = (field: keyof JobData, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Pekerjaan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <InputField label="Pekerjaan" value={jobData.pekerjaan} onChange={(value) => handleInputChange('pekerjaan', value)} />
            <InputField label="Perusahaan/Instansi" value={jobData.perusahaan} onChange={(value) => handleInputChange('perusahaan', value)} />
            <InputField label="Lama Bekerja" value={jobData.lamaBekerja} onChange={(value) => handleInputChange('lamaBekerja', value)} />
            <InputField label="Pendapatan Bulanan" value={jobData.pendapatanBulanan} onChange={(value) => handleInputChange('pendapatanBulanan', value)} />
            <InputField label="Sumber Pendapatan Lain" value={jobData.sumberPendapatanLain} onChange={(value) => handleInputChange('sumberPendapatanLain', value)} />
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Pekerjaan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        <Info label="Pekerjaan" value={jobData.pekerjaan} />
        <Info label="Perusahaan/Instansi" value={jobData.perusahaan} />
        <Info label="Lama Bekerja" value={jobData.lamaBekerja} />
        <Info label="Pendapatan Bulanan" value={jobData.pendapatanBulanan} />
        <Info label="Sumber Pendapatan Lain" value={jobData.sumberPendapatanLain} />
      </div>
    </div>
  );
};

// Interface for Info component props
interface InfoProps {
  label: string;
  value: string;
}

const Info: React.FC<InfoProps> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-800 font-medium text-lg">{value}</span>
  </div>
);

// Interface for InputField component props
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

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

export default JobInfo;