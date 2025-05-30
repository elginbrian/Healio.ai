import React from 'react';
import { ChevronUp, ChevronDown, Wallet } from 'lucide-react';

interface Contribution {
  type: string;
  date: string;
  method: string;
  amount: number;
}

const contributions: Contribution[] = [
  {
    type: 'Kontribusi Bulanan',
    date: '15 Juni 2023',
    method: 'Transfer Bank',
    amount: 3500000,
  },
  {
    type: 'Kontribusi Bulanan',
    date: '15 Mei 2023',
    method: 'Transfer Bank',
    amount: 12000000,
  },
  {
    type: 'Kontribusi Bulanan',
    date: '15 April 2023',
    method: 'E-Wallet',
    amount: 850000,
  },
  {
    type: 'Kontribusi Bulanan',
    date: '15 Maret 2023',
    method: 'Transfer Bank',
    amount: 1200000,
  },
];

const KontribusiSayaTab = () => {
  const totalKontribusi = contributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Riwayat Kontribusi Saya</h3>
        <div className="flex items-center text-gray-600">
          Total Kontribusi: <span className="font-bold ml-1 text-[var(--color-p-300)]">Rp{totalKontribusi.toLocaleString('id-ID')}</span>
          <div className="ml-2 flex flex-col">
            <ChevronUp size={16} className="cursor-pointer text-gray-400 hover:text-gray-600" />
            <ChevronDown size={16} className="cursor-pointer text-gray-400 hover:text-gray-600" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar mb-6">
        {contributions.map((contribution, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full mr-4">
                <Wallet size={24} className="text-gray-500" />
              </div>
              <div>
                <div className="text-base font-semibold text-gray-800">{contribution.type}</div>
                <div className="text-sm text-gray-500">
                  {contribution.date} • {contribution.method}
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-[var(--color-p-300)]">
              Rp{contribution.amount.toLocaleString('id-ID')}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-xl font-bold text-gray-800 mb-3">Manfaat Kontribusi Anda</h4>
        <p className="text-gray-600">
          Kontribusi Anda telah membantu 4 anggota mendapatkan perawatan medis dengan total nilai{' '}
          <span className="font-bold text-[var(--color-p-300)]">Rp 17.550.000</span>
        </p>
      </div>
    </div>
  );
};

export default KontribusiSayaTab;