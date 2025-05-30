"use client";
import React from "react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "pribadi", label: "Informasi Pribadi" },
    { id: "kesehatan", label: "Informasi Kesehatan" },
    { id: "pekerjaan", label: "Informasi Pekerjaan" },
  ];

  return (
    <div className="w-full bg-white px-12 shadow-sm -mt-2 z-10">
      <div className="flex justify-start border-b border-gray-200 px-6 md:px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`relative py-4 px-6 text-lg font-semibold focus:outline-none transition-all duration-300 ease-in-out
              ${activeTab === tab.id ? "text-[var(--color-p-300)]" : "text-gray-600 hover:text-[var(--color-p-300)]"}
            `}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300 ${activeTab === tab.id ? "bg-[var(--color-p-300)]" : "bg-transparent"}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
