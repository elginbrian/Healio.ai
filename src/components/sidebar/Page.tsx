"use client";

import React, { useEffect, useState } from "react";
import SidebarItem from "./sidebar_item/page";
import { usePathname, useRouter } from "next/navigation";
import { FaUserCircle, FaChevronRight, FaChevronLeft, FaUser, FaMoneyBill, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/lib/auth";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (pathname.includes("/dashboard/facilities")) {
      setActiveMenu("facilities");
    } else if (pathname.includes("/dashboard/microfunding")) {
      setActiveMenu("microfunding");
    } else if (pathname.includes("/dashboard/expenses")) {
      setActiveMenu("expenses");
    } else if (pathname.includes("/dashboard/profile")) {
      setActiveMenu("profile");
    } else if (pathname.includes("/dashboard/community")) {
      setActiveMenu("community");
    }
  }, [pathname]);

  const handleNavigation = (route: string) => {
    router.push(`/dashboard/${route}`);
    setActiveMenu(route);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className={`h-full flex flex-col shadow-md justify-between transition-all duration-300 relative ${expanded ? "w-80" : "w-[100px]"}`}>
      <div className="flex flex-col">
        <div className="p-6 flex items-center justify-center">
          <img src="/img/logo.svg" className="w-12 h-12" alt="logo" />
          {expanded && <span className="ml-3 text-lg font-semibold text-[var(--color-p-300)] truncate">Healio.ai</span>}
        </div>

        <div className="px-6 mt-8">
          <SidebarItem name="facilities" label="Fasilitas Kesehatan" active={activeMenu === "facilities"} onClick={() => handleNavigation("facilities")} activeSrc="/img/home_white.svg" inactiveSrc="/img/home_pink.svg" expanded={expanded} />

          <SidebarItem name="microfunding" label="Dana Komunal" active={activeMenu === "microfunding"} onClick={() => handleNavigation("microfunding")} icon={FaMoneyBill} expanded={expanded} />

          <SidebarItem name="expenses" label="Expense Tracker" active={activeMenu === "expenses"} onClick={() => handleNavigation("expenses")} activeSrc="/img/graph_white.svg" inactiveSrc="/img/graph_pink.svg" expanded={expanded} />

          <SidebarItem name="komunitas" label="Komunitas" active={activeMenu === "community"} onClick={() => handleNavigation("community")} icon={FaUser} expanded={expanded} />
        </div>
      </div>
      <div className="px-6 mb-4 flex flex-col">
        <SidebarItem name="profile" label="Profil" active={activeMenu === "profile"} onClick={() => handleNavigation("profile")} icon={FaUserCircle} expanded={expanded} />
        <SidebarItem name="logout" label="Keluar" active={false} onClick={handleLogout} icon={FaSignOutAlt} expanded={expanded} />
      </div>

      <div className="absolute top-[60%] right-0 transform -translate-y-1/2 flex items-center">
        <button onClick={toggleSidebar} className="bg-white hover:bg-gray-50 border border-gray-200 rounded-l-full h-20 w-7 flex items-center justify-center shadow-md">
          {expanded ? <FaChevronLeft size={16} className="text-[var(--color-p-300)]" /> : <FaChevronRight size={16} className="text-[var(--color-p-300)]" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
