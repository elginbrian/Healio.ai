// components/claim/InformasiPembayaranSection.tsx
import React from 'react';
import ClaimFormSection from '../claim_form_section/page';

const InformasiPembayaranSection: React.FC = () => {
  return (
    <ClaimFormSection title="Informasi Pembayaran">
      {/* Jumlah Klaim */}
      <div className='mb-4'>
        <label htmlFor='jumlahKlaim' className='block text-gray-700 text-sm font-medium mb-2'>
          Jumlah Klaim
        </label>
        <input
          type='text'
          id='jumlahKlaim'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]'
          placeholder='350.000'
        />
      </div>

      {/* Metode Pembayaran */}
      <div className='mb-4'>
        <label htmlFor='metodePembayaran' className='block text-gray-700 text-sm font-medium mb-2'>
          Metode Pembayaran
        </label>
        <select
          id='metodePembayaran'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]'
        >
          <option>--Pilih Metode Pembayaran--</option>
          <option>Transfer Bank</option>
          <option>Kartu Kredit</option>
          <option>E-Wallet</option>
        </select>
      </div>
    </ClaimFormSection>
  );
};

export default InformasiPembayaranSection;