'use client';
import React, { useState } from 'react';

interface HealthInfoProps {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

const HealthInfo: React.FC<HealthInfoProps> = ({ isEditMode, setIsEditMode }) => {
  const [healthText, setHealthText] = useState('Saya berusia 24 tahun dan umumnya dalam kondisi sehat...');

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
          <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Kesehatan</h2>
          <div className="mb-4">
            <label className="text-gray-500 text-sm mb-2 block">Informasi Kesehatan</label>
            <textarea
              value={healthText}
              onChange={(e) => setHealthText(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] focus:border-transparent resize-none"
              placeholder="Masukkan informasi kesehatan Anda..."
            />
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
      <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Kesehatan</h2>
      <p className="text-gray-800 leading-relaxed">
        {healthText}
      </p>
    </div>
  );
};

export default HealthInfo;