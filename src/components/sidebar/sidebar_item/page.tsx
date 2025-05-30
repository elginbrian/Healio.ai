import React from "react";
import { IconType } from "react-icons";

interface SidebarItemProps {
  name: string;
  label?: string;
  active: boolean;
  onClick: () => void;
  activeSrc?: string;
  inactiveSrc?: string;
  icon?: IconType;
  expanded?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, label, active, onClick, activeSrc, inactiveSrc, icon: Icon, expanded = false }) => {
  return (
    <div
      onClick={onClick}
      className={`mb-4 flex items-center rounded-xl cursor-pointer transition-all duration-300 ${active ? "bg-[var(--color-p-300)] text-white" : "bg-gray-100 text-[var(--color-p-300)]"} ${
        expanded ? "px-4 py-3.5 w-full" : "w-14 h-14 justify-center"
      }`}
    >
      {Icon ? <Icon className="min-w-6 h-6 flex-shrink-0" color={active ? "white" : "var(--color-p-300)"} /> : <img src={active ? activeSrc : inactiveSrc} alt={name} className="min-w-6 h-6 flex-shrink-0" />}

      {expanded && <span className={`ml-4 font-medium text-sm truncate ${active ? "text-white" : "text-gray-700"}`}>{label || name}</span>}
    </div>
  );
};

export default SidebarItem;
