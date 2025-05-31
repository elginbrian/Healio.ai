// components/claim/DetailKlaimSection.tsx
import React from 'react';
import ClaimFormSection from '../claim_form_section/page';

const DetailKlaimSection: React.FC = () => {
  return (
    <ClaimFormSection title="Detail Klaim">
      {/* Jenis Klaim */}
      <div className='mb-4'>
        <label htmlFor='jenisKlaim' className='block text-gray-700 text-sm font-medium mb-2'>
          Jenis Klaim
        </label>
        <select
          id='jenisKlaim'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]'
        >
          <option>Rawat Inap</option>
          <option>Rawat Jalan</option>
          <option>Gigi</option>
          <option>Melahirkan</option>
        </select>
      </div>

      {/* Nama Rumah Sakit/Klinik */}
      <div className='mb-4'>
        <label htmlFor='namaRsKlinik' className='block text-gray-700 text-sm font-medium mb-2'>
          Nama Rumah Sakit/Klinik
        </label>
        <input
          type='text'
          id='namaRsKlinik'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]'
          placeholder='Klinik Sehat Sentosa'
        />
      </div>

      {/* Tanggal Perawatan */}
      <div className='mb-4'>
        <label htmlFor='tanggalPerawatan' className='block text-gray-700 text-sm font-medium mb-2'>
          Tanggal Perawatan
        </label>
        <input
          type='date'
          id='tanggalPerawatan'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]'
          defaultValue='2025-05-30'
        />
      </div>

      {/* Diagnosis */}
      <div className='mb-4'>
        <label htmlFor='diagnosis' className='block text-gray-700 text-sm font-medium mb-2'>
          Diagnosis
        </label>
        <input
          type='text'
          id='diagnosis'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]'
          placeholder='Infeksi Saluran Pernapasan Atas (ISPA)'
        />
      </div>

      {/* Keterangan Tambahan */}
      <div className='mb-4'>
        <label htmlFor='keteranganTambahan' className='block text-gray-700 text-sm font-medium mb-2'>
          Keterangan Tambahan
        </label>
        <textarea
          id='keteranganTambahan'
          rows={5}
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] resize-y'
          placeholder='Sudah beberapa hari saya mengalami batuk kering, hidung tersumbat, dan tenggorokan terasa gatal. Dokter mendiagnosis saya terkena ISPA ringan dan memberikan obat serta saran istirahat total. Biaya klaim ini mencakup biaya konsultasi dokter umum dan resep obat.'
        ></textarea>
      </div>
    </ClaimFormSection>
  );
};

export default DetailKlaimSection;