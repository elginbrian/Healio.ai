import React from "react";
import { IconType } from "react-icons"; // Pastikan IconType diimport
import { FiLogOut } from "react-icons/fi"; // Tambahkan ini untuk contoh

interface SidebarItemProps {
  name: string;
  label?: string;
  active: boolean;
  onClick: () => void;
  activeSrc?: string;
  inactiveSrc?: string;
  icon?: IconType; // Type IconType, tidak perlu null secara eksplisit karena sudah opsional
  expanded?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, label, active, onClick, activeSrc, inactiveSrc, icon: Icon, expanded = false }) => {
  const textColorInactive = (name === "logout") ? "text-[var(--color-p-300)]" : "text-gray-700";
  const iconColorInactive = (name === "logout") ? "var(--color-p-300)" : "var(--color-p-300)";

  return (
    <div
      onClick={onClick}
      className={`mb-4 flex items-center rounded-xl cursor-pointer transition-all duration-300 ${active ? "bg-[var(--color-p-300)] text-white" : "bg-gray-100 text-[var(--color-p-300)]"} ${
        expanded ? "px-4 py-3.5 w-full" : "w-14 h-14 justify-center"
      }`}
    >
      {Icon ? (
        <Icon className="min-w-6 h-6 flex-shrink-0" color={active ? "white" : iconColorInactive} />
      ) : (
        <img src={active ? activeSrc : inactiveSrc} alt={name} className="min-w-6 h-6 flex-shrink-0" />
      )}

      {expanded && <span className={`ml-4 font-medium text-sm truncate ${active ? "text-white" : textColorInactive}`}>{label || name}</span>}
    </div>
  );
};

export default SidebarItem;