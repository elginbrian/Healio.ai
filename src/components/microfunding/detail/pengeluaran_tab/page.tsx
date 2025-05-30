import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Hospital, Pill, Stethoscope } from 'lucide-react'; // Example icons

interface Expense {
  type: string;
  description: string;
  hospital?: string;
  date: string;
  amount: number;
  icon: React.ElementType; // To hold the Lucide icon component
}

const expenses: Expense[] = [
  {
    type: 'Rawat Inap',
    description: 'Rawat Inap - Johan Arizona',
    hospital: 'RS Medika Sejahtera',
    date: '5 Maret 2023',
    amount: 3500000,
    icon: Hospital,
  },
  {
    type: 'Rawat Inap',
    description: 'Rawat Inap - Andreas Bagaskoro',
    hospital: 'RS Harapan Bunda',
    date: '12 Februari 2023',
    amount: 12000000,
    icon: Hospital,
  },
  {
    type: 'Obat',
    description: 'Obat - Elgin Brian',
    hospital: 'Apotek Sehat',
    date: '28 Januari 2023',
    amount: 850000,
    icon: Pill,
  },
  {
    type: 'Konsultasi Spesialis',
    description: 'Konsultasi Spesialis - Rizqi Aditya',
    hospital: 'Klinik Spesialis Jantung',
    date: '15 Januari 2023',
    amount: 1200000,
    icon: Stethoscope,
  },
];

const PengeluaranTab = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Riwayat Pengeluaran</h3>
        <div className="ml-2 flex flex-col">
          <ChevronUp size={16} className="cursor-pointer text-gray-400 hover:text-gray-600" />
          <ChevronDown size={16} className="cursor-pointer text-gray-400 hover:text-gray-600" />
        </div>
      </div>

      <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar">
        {expenses.map((expense, index) => (
          <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full mr-4">
                <expense.icon size={24} className="text-gray-500" />
              </div>
              <div>
                <div className="text-base font-semibold text-gray-800">{expense.description}</div>
                <div className="text-sm text-gray-500">
                  {expense.hospital} • {expense.date}
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-[var(--color-p-300)]">
              Rp{expense.amount.toLocaleString('id-ID')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PengeluaranTab;