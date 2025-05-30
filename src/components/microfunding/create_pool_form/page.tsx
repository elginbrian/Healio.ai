import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePoolFormProps {
  onClose: () => void;
}

const CreatePoolForm = ({ onClose }: CreatePoolFormProps) => {
  const [namaPool, setNamaPool] = useState('');
  const [jenisKomunitas, setJenisKomunitas] = useState('Komunitas Profesi');
  const [jumlahMaksimalAnggota, setJumlahMaksimalAnggota] = useState('');
  const [periodeKontribusi, setPeriodeKontribusi] = useState('Bulanan');
  const [jumlahIuran, setJumlahIuran] = useState('');
  const [deskripsiPool, setDeskripsiPool] = useState('');
  const [rawatInap, setRawatInap] = useState(false);
  const [obatObatan, setObatObatan] = useState(false);
  const [konsultasiDokter, setKonsultasiDokter] = useState(false);
  const [tindakanOperasi, setTindakanOperasi] = useState(false);
  const [lainnya, setLainnya] = useState(false);
  const [durasiVotingKlaim, setDurasiVotingKlaim] = useState('24 Jam');
  const [menyetujuiSyaratKetentuan, setMenyetujuiSyaratKetentuan] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      namaPool,
      jenisKomunitas,
      jumlahMaksimalAnggota,
      periodeKontribusi,
      jumlahIuran,
      deskripsiPool,
      rawatInap,
      obatObatan,
      konsultasiDokter,
      tindakanOperasi,
      lainnya,
      durasiVotingKlaim,
      menyetujuiSyaratKetentuan,
    });
    alert('Form submitted! Check console for data.');
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-6xl w-full relative overflow-y-auto max-h-[90vh] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-p-300)] hover:text-[var(--color-p-300)] transition p-2"
          aria-label="Close form"
        >
          <X size={28} strokeWidth={2} />
        </button>
        <h2 className="text-2xl font-bold text-[var(--color-p-300)] mb-8">
          Buat Pool Dana Komunitas
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[var(--color-p-300)] text-md font-semibold">Nama Pool</label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]"
                  placeholder="Contoh: Pool Kesehatan RT 17"
                  value={namaPool}
                  onChange={(e) => setNamaPool(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--color-p-300)] text-md font-semibold">Jenis Komunitas</label>
                <select
                  className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)] appearance-none bg-white"
                  value={jenisKomunitas}
                  onChange={(e) => setJenisKomunitas(e.target.value)}
                  required
                >
                  <option>Komunitas Profesi</option>
                  <option>Komunitas Hobi</option>
                  <option>Komunitas Lokasi</option>
                  <option>Komunitas Keluarga</option>
                </select>
              </div>
              <div>
                <label className="block text-[var(--color-p-300)] text-md font-semibold">Jumlah Maksimal Anggota</label>
                <input
                  type="number"
                  className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]"
                  placeholder="Contoh: 25"
                  value={jumlahMaksimalAnggota}
                  onChange={(e) => setJumlahMaksimalAnggota(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--color-p-300)] text-md font-semibold">Periode Kontribusi</label>
                <select
                  className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)] appearance-none bg-white"
                  value={periodeKontribusi}
                  onChange={(e) => setPeriodeKontribusi(e.target.value)}
                  required
                >
                  <option>Bulanan</option>
                  <option>Mingguan</option>
                  <option>Tahunan</option>
                </select>
              </div>
              <div>
                <label className="block text-[var(--color-p-300)] text-md font-semibold">Jumlah Iuran</label>
                <div className="flex items-center">
                  <span className="p-3 bg-gray-50 text-gray-800 rounded-l-xl border-2 border-r-0 border-gray-300 text-md">Rp</span>
                  <input
                    type="number"
                    className="w-full p-3 border-2 border-gray-300 rounded-r-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)]"
                    placeholder="Contoh: 100.000"
                    value={jumlahIuran}
                    onChange={(e) => setJumlahIuran(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[var(--color-p-300)] text-md font-semibold">Cakupan Manfaat</label>
                <div className="space-y-3">
                  {[
                    { label: 'Rawat Inap', state: rawatInap, setState: setRawatInap },
                    { label: 'Obat-obatan', state: obatObatan, setState: setObatObatan },
                    { label: 'Konsultasi Dokter', state: konsultasiDokter, setState: setKonsultasiDokter },
                    { label: 'Tindakan Operasi', state: tindakanOperasi, setState: setTindakanOperasi },
                    { label: 'Lainnya', state: lainnya, setState: setLainnya },
                  ].map((item) => (
                    <label key={item.label} className="flex items-center text-gray-800 text-md">
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-[var(--color-p-300)] mr-3 rounded"
                        checked={item.state}
                        onChange={(e) => item.setState(e.target.checked)}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[var(--color-p-300)] text-md font-semibold">Sistem Persetujuan Klaim</label>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-800">
                  <p className="font-semibold mb-1">Voting Anggota (50%)</p>
                  <p className="text-sm">Setiap klaim harus disetujui oleh lebih dari 50% anggota pool dana</p>
                </div>
              </div>
              <div>
                <label className="block text-[var(--color-p-300)] text-md font-semibold">Durasi Voting Klaim</label>
                <select
                  className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)] appearance-none bg-white"
                  value={durasiVotingKlaim}
                  onChange={(e) => setDurasiVotingKlaim(e.target.value)}
                  required
                >
                  <option>24 Jam</option>
                  <option>48 Jam</option>
                  <option>72 Jam</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[var(--color-p-300)] text-md font-semibold">Deskripsi Pool</label>
            <textarea
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-md text-gray-800 focus:outline-none focus:border-[var(--color-p-300)] min-h-[120px]"
              placeholder="Jelaskan tujuan dan aturan pool dana komunitas anda"
              value={deskripsiPool}
              onChange={(e) => setDeskripsiPool(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center">
            <label className="flex items-center text-gray-800 text-md cursor-pointer">
              <input
                type="checkbox"
                className="h-5 w-5 accent-[var(--color-p-300)] mr-3 rounded"
                checked={menyetujuiSyaratKetentuan}
                onChange={(e) => setMenyetujuiSyaratKetentuan(e.target.checked)}
                required
              />
              <span>Saya menyetujui</span>
              <span className="text-[var(--color-p-300)] font-semibold ml-1">syarat dan ketentuan</span>
              <span className="ml-1">Healio.ai</span>
            </label>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-[var(--color-p-300)] text-white font-bold py-4 px-16 rounded-full hover:bg-[var(--color-p-300)] transition duration-300 text-xl"
            >
              Buat Pool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoolForm;
