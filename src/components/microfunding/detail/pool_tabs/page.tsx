'use client';

import React, { useState } from 'react';
import AnggotaTab from '../anggota_tab/page';
import PengeluaranTab from '../pengeluaran_tab/page';
import KontribusiSayaTab from '../my_contribution/page';
// Import the revised PoolSettingsForm
import PoolSettingsForm from '../pool_settings/page'; // Ensure this path is correct based on your file structure
import UndangAnggotaTab from '../invite_member/page';

interface PoolTabsProps {
  initialTab?: string;
}

const PoolTabs = ({ initialTab = 'Anggota' }: PoolTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    'Anggota',
    'Pengeluaran',
    'Kontribusi Saya',
    'Pengaturan Pool',
    'Undang Anggota',
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Anggota':
        return <AnggotaTab />;
      case 'Pengeluaran':
        return <PengeluaranTab />;
      case 'Kontribusi Saya':
        return <KontribusiSayaTab />;
      case 'Pengaturan Pool':
        // Now PoolSettingsForm does not expect an onClose prop
        return <PoolSettingsForm />;
      case 'Undang Anggota':
        return <UndangAnggotaTab />;
      default:
        return <AnggotaTab />;
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-md p-6">
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-3 px-6 text-lg font-semibold transition-colors duration-300
              ${activeTab === tab
                ? 'text-[var(--color-p-300)] border-b-2 border-[var(--color-p-300)]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default PoolTabs;