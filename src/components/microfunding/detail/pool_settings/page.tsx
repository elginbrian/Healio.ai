'use client'; // This directive is necessary for client-side components in Next.js 13+

import React, { useState } from 'react';
// No need for X icon since it's not a popup
// import { X, Check } from 'lucide-react'; // Check can still be useful for custom checkboxes

const PoolSettingsForm = () => {
  const [namaPool, setNamaPool] = useState('Keluarga Sehat');
  const [jumlahKontribusiBulanan, setJumlahKontribusiBulanan] = useState('200.000');
  const [jumlahMaksimalAnggota, setJumlahMaksimalAnggota] = useState('25');
  const [deskripsiPool, setDeskripsiPool] = useState('Pool kesehatan untuk keluarga dan kerabat dekat dengan perlindungan maksimal.');
  const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState('15');

  // Benefit Coverages
  const [rawatInap, setRawatInap] = useState(true);
  const [obatObatan, setObatObatan] = useState(true);
  const [konsultasiDokter, setKonsultasiDokter] = useState(true);
  const [tindakanOperasi, setTindakanOperasi] = useState(false);
  const [lainnya, setLainnya] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      namaPool,
      jumlahKontribusiBulanan,
      jumlahMaksimalAnggota,
      deskripsiPool,
      tanggalJatuhTempo,
      rawatInap,
      obatObatan,
      konsultasiDokter,
      tindakanOperasi,
      lainnya,
    });
    alert('Pengaturan Pool berhasil disimpan!');
    // In a real application, you would typically save this to a backend
    // and then perhaps navigate or show a success message without closing a modal.
  };

  return (
    // Removed the fixed inset-0 backdrop-blur-sm bg-white/20 container
    // and the absolute close button.
    // The outer div now directly contains the form content, fitting within the tab structure.
    <div className="p-4"> {/* Added a small internal padding to separate from tab edges */}
      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Pengaturan Pool
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6 w-5/12 flex flex-col justify-between">
            <div>
              <label className="block text-gray-700 text-md font-semibold mb-2">Nama Pool</label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]" // Changed focus:border-pink-500
                value={namaPool}
                onChange={(e) => setNamaPool(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-md font-semibold mb-2">Jumlah Kontribusi Bulanan</label>
              <div className="flex items-center">
                <span className="p-3 bg-gray-50 text-gray-800 rounded-l-xl border-2 border-r-0 border-gray-300 text-md">Rp</span>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-r-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]" // Changed focus:border-pink-500
                  placeholder="200.000"
                  value={jumlahKontribusiBulanan}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                    setJumlahKontribusiBulanan(value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')); // Add dot as thousands separator
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-md font-semibold">Jumlah Maksimal Anggota</label>
              <input
                type="number"
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]" // Changed focus:border-pink-500
                value={jumlahMaksimalAnggota}
                onChange={(e) => setJumlahMaksimalAnggota(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Middle Column */}
          <div className="w-5/12 flex flex-col justify-between">
            <div className=''>
              <label className="block text-gray-700 text-md font-semibold mb-2">Deskripsi</label>
              <textarea
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)] h-40" // Changed focus:border-pink-500
                placeholder="Jelaskan tujuan dan aturan pool dana komunitas anda"
                value={deskripsiPool}
                onChange={(e) => setDeskripsiPool(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-gray-700 text-md font-semibold">Tanggal Jatuh Tempo</label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]" // Changed focus:border-pink-500
                placeholder="Tanggal 15"
                value={tanggalJatuhTempo}
                onChange={(e) => setTanggalJatuhTempo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="w-2/12 space-y-6 w-1/3">
            <div>
              <label className="block text-gray-700 text-md font-semibold mb-2">Cakupan Manfaat</label>
              <div className="space-y-3">
                {[
                  { label: 'Rawat Inap', state: rawatInap, setState: setRawatInap },
                  { label: 'Obat-obatan', state: obatObatan, setState: setObatObatan },
                  { label: 'Konsultasi Dokter', state: konsultasiDokter, setState: setKonsultasiDokter },
                  { label: 'Tindakan Operasi', state: tindakanOperasi, setState: setTindakanOperasi },
                  { label: 'Lainnya', state: lainnya, setState: setLainnya },
                ].map((item) => (
                  <label key={item.label} className="flex items-center text-gray-800 text-md cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-[var(--color-p-300)] mr-3 rounded" // Changed accent-pink-500
                      checked={item.state}
                      onChange={(e) => item.setState(e.target.checked)}
                    />

                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 font-semibold py-3 px-10 rounded-full hover:bg-gray-300 transition duration-300 text-md"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-[var(--color-p-300)] text-white font-semibold py-3 px-10 rounded-full hover:bg-[var(--color-p-400)] transition duration-300 text-md" // Changed bg-pink-500 and hover:bg-pink-600
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default PoolSettingsForm;