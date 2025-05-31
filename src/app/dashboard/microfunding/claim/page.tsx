// pages/claim/ClaimFund.tsx
'use client';

import DetailKlaimSection from '@/components/claim/claim_form_detail/page';
import ClaimSuccess from '@/components/claim/claim_success/page';
import FileUploadInput from '@/components/claim/file_upload/page';
import ClaimHeader from '@/components/claim/header/page';
import InformasiPembayaranSection from '@/components/claim/payment_info/page';
import JoinPoolSuccess from '@/components/microfunding/success_join/page';
import React, { useState } from 'react';

const ClaimFund = () => {
  const [suratDokterFile, setSuratDokterFile] = useState<File | null>(null);
  const [kwitansiFile, setKwitansiFile] = useState<File | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for popup visibility

  const handleSubmitClaim = () => {
    // In a real application, you'd send the files and other data to your backend here
    console.log('Submitting claim with files:', {
      suratDokterFile,
      kwitansiFile,
    });
    // For demonstration, we'll just show the success popup
    setShowSuccessPopup(true);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    // Optionally reset form states here if you want to clear the form after closing the popup
    setSuratDokterFile(null);
    setKwitansiFile(null);
  };

  return (
    <div className='p-8 bg-[var(--color-w-300)] min-h-screen'>
      <ClaimHeader />

      <div className='bg-white shadow-md rounded-2xl p-6 mt-8'>
        <p className='text-xl font-semibold text-gray-800 mb-6'>Form Pengajuan Klaim</p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <DetailKlaimSection />
          <InformasiPembayaranSection />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
          <FileUploadInput
            label="Surat Dokter"
            onFileChange={setSuratDokterFile} 
            acceptedFileTypes="image/*,application/pdf"
          />
          <FileUploadInput
            label="Kwitansi/Bukti Pembayaran"
            onFileChange={setKwitansiFile}
            acceptedFileTypes="image/*,application/pdf"
          />
        </div>

        <div className='flex justify-end mt-8'>
          <button
            className='bg-[var(--color-p-300)] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-[var(--color-p-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] focus:ring-offset-2'
            onClick={handleSubmitClaim}
            // You might want to disable the button if required files are not uploaded
            // disabled={!suratDokterFile || !kwitansiFile} 
          >
            Ajukan Klaim
          </button>
        </div>
      </div>

      {/* Conditionally render the success popup */}
      {showSuccessPopup && (
        <ClaimSuccess onClose={handleCloseSuccessPopup} />
      )}
    </div>
  );
};

export default ClaimFund;