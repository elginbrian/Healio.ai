"use client";

import React, { useState } from "react";
import AnggotaTab from "../anggota_tab/page";
import PengeluaranTab from "../pengeluaran_tab/page";
import KontribusiSayaTab from "../my_contribution/page";
import PoolSettingsForm from "../pool_settings/page";
import UndangAnggotaTab from "../invite_member/page";
import { IMicrofundingPool, IPoolMember } from "@/types";

interface PoolTabsProps {
  initialTab?: string;
  poolDetails?: IMicrofundingPool;
  currentUserMembership?: IPoolMember | null;
}

interface AnggotaTabProps {
  poolId?: string;
}

interface PengeluaranTabProps {
  poolId?: string;
}

interface KontribusiSayaTabProps {
  poolId?: string;
  currentUserMembership?: IPoolMember | null;
}

interface PoolSettingsFormProps {
  poolDetails?: IMicrofundingPool;
  isAdmin?: boolean;
}

interface UndangAnggotaTabProps {
  poolId?: string;
  poolCode?: string;
  isCurrentUserAdmin?: boolean;
}

const AnggotaTabWithProps = AnggotaTab as React.FC<AnggotaTabProps>;
const PengeluaranTabWithProps = PengeluaranTab as React.FC<PengeluaranTabProps>;
const KontribusiSayaTabWithProps = KontribusiSayaTab as React.FC<KontribusiSayaTabProps>;
const PoolSettingsFormWithProps = PoolSettingsForm as React.FC<PoolSettingsFormProps>;
const UndangAnggotaTabWithProps = UndangAnggotaTab as React.FC<UndangAnggotaTabProps>;

const PoolTabs = ({ initialTab = "Anggota", poolDetails, currentUserMembership }: PoolTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const isCurrentUserAdmin = currentUserMembership?.role === "ADMIN";

  const tabs = ["Anggota", "Pengeluaran", "Kontribusi Saya", "Pengaturan Pool", "Undang Anggota"];

  const filteredTabs = tabs.filter((tab) => {
    if ((tab === "Pengaturan Pool" || tab === "Undang Anggota") && !isCurrentUserAdmin) {
      return false;
    }
    if (tab === "Kontribusi Saya" && !currentUserMembership) {
      return false;
    }
    return true;
  });

  const renderContent = () => {
    switch (activeTab) {
      case "Anggota":
        return <AnggotaTabWithProps poolId={poolDetails?._id} />;
      case "Pengeluaran":
        return <PengeluaranTabWithProps poolId={poolDetails?._id} />;
      case "Kontribusi Saya":
        return <KontribusiSayaTabWithProps poolId={poolDetails?._id} currentUserMembership={currentUserMembership} />;
      case "Pengaturan Pool":
        return <PoolSettingsFormWithProps poolDetails={poolDetails} isAdmin={isCurrentUserAdmin} />;
      case "Undang Anggota":
        return <UndangAnggotaTabWithProps poolId={poolDetails?._id} poolCode={poolDetails?.pool_code} isCurrentUserAdmin={isCurrentUserAdmin} />;
      default:
        return <AnggotaTabWithProps poolId={poolDetails?._id} />;
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-md p-6">
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
        {filteredTabs.map((tab) => (
          <button
            key={tab}
            className={`py-3 px-6 text-lg font-semibold transition-colors duration-300 whitespace-nowrap
              ${activeTab === tab ? "text-[var(--color-p-300)] border-b-2 border-[var(--color-p-300)]" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">{renderContent()}</div>
    </div>
  );
};

export default PoolTabs;

