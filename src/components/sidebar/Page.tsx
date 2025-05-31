"use client";

import React, { useEffect, useState } from "react";
import SidebarItem from "./sidebar_item/page";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronRight, FaChevronLeft, FaSignOutAlt } from "react-icons/fa";

// Define an interface for the props that SidebarItem expects
// This is crucial for TypeScript to understand what 'SidebarItem' is expecting
interface SidebarItemProps {
  name: string;
  label: string;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
  activeSrc?: string; // Optional if using custom icons
  inactiveSrc?: string; // Optional if using custom icons
  icon?: React.ElementType; // For Font Awesome icons or similar
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string>(""); // Explicitly type activeMenu as string
  const [expanded, setExpanded] = useState<boolean>(false); // Explicitly type expanded as boolean

  useEffect(() => {
    // Determine the active menu based on the current pathname
    if (pathname.includes("/dashboard/facilities")) {
      setActiveMenu("facilities");
    } else if (pathname.includes("/dashboard/microfunding")) {
      setActiveMenu("microfunding");
    } else if (pathname.includes("/dashboard/expenses")) {
      setActiveMenu("expenses");
    } else if (pathname.includes("/dashboard/community")) {
      // This will now correctly activate for /dashboard/community
      setActiveMenu("community");
    } else {
      setActiveMenu(""); // Reset if no matching path
    }
  }, [pathname]);

  const handleNavigation = (route: string) => {
    router.push(`/dashboard/${route}`);
    setActiveMenu(route); // Set active menu to the route string
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken'); 
      console.log('User logged out successfully.');
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
    }
  };

  return (
    <div className={`h-full flex flex-col shadow-md justify-between transition-all duration-300 relative ${expanded ? "w-80" : "w-[100px]"}`}>
      <div className="flex flex-col">
        <div className="p-6 flex items-center justify-center">
          <img src="/img/logo.svg" className="w-12 h-12" alt="logo" />
          {expanded && <span className="ml-3 text-lg font-semibold text-[var(--color-p-300)] truncate">Healio</span>}
        </div>

        <div className="px-6 mt-8">
          <SidebarItem
            name="facilities"
            label="Fasilitas Kesehatan"
            active={activeMenu === "facilities"}
            onClick={() => handleNavigation("facilities")}
            activeSrc="/img/home_white.svg"
            inactiveSrc="/img/home_pink.svg"
            expanded={expanded}
          />

          <SidebarItem
            name="microfunding"
            label="Microfunding"
            active={activeMenu === "microfunding"}
            onClick={() => handleNavigation("microfunding")}
            activeSrc="/img/pouch_white.svg"
            inactiveSrc="/img/pouch_pink.svg"
            expanded={expanded}
          />

          <SidebarItem
            name="expenses"
            label="Expense Tracker"
            active={activeMenu === "expenses"}
            onClick={() => handleNavigation("expenses")}
            activeSrc="/img/graph_white.svg"
            inactiveSrc="/img/graph_pink.svg"
            expanded={expanded}
          />

          <SidebarItem
            name="community"
            label="Consultation"
            active={activeMenu === "community"} 
            onClick={() => handleNavigation("community")}
            activeSrc="/img/people_white.svg"
            inactiveSrc="/img/people_pink.svg"
            expanded={expanded}
          />
        </div>
      </div>
      <div className="px-6 mb-6">
        <SidebarItem
          name="logout"
          label="Log Out"
          active={false}
          onClick={handleLogout}
          icon={FaSignOutAlt} 
          expanded={expanded}
        />
      </div>

      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 z-10">
        <button
          onClick={toggleSidebar}
          className="w-12 h-12 rounded-full bg-[var(--color-p-300)] flex items-center justify-center shadow-md hover:bg-[var(--color-p-400)] transition-colors duration-200"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? <FaChevronLeft size={16} className="text-white" /> : <FaChevronRight size={16} className="text-white" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;