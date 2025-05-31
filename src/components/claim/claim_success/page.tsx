import React from 'react';

interface JoinPoolSuccessProps {
  onClose: () => void;
}

const ClaimSuccess = ({ onClose }: JoinPoolSuccessProps) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full relative shadow-2xl p-8 text-center">

        <div className="mb-6 flex justify-center">
          <img
            src="/img/claim_done.svg"
            alt="Success Document"
            className="w-40 object-contain"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--color-p-300)] mb-4"> 
            Pengajuan Berhasil
          </h2>
          <p className="text-gray-600 text-md leading-relaxed">
            Pengajuan kamu telah berhasil dikirim dan sedang menunggu proses voting dari komunitas. Pantau terus statusnya di halaman riwayat pengajuan untuk informasi selanjutnya.
          </p>
        </div>

        <button
          onClick={onClose}
          className="bg-[var(--color-p-300)] text-white font-semibold py-4 px-6 rounded-full hover:bg-[var(--color-p-400)] transition duration-300 text-lg" // Changed bg-gradient-to-r from-pink-400 to-pink-500 and hover:from-pink-500 hover:to-pink-600
        >
          Kembali ke Pool
        </button>
      </div>
    </div>
  );
};

export default ClaimSuccess;