import React from "react";
import NotifProfile from "@/components/notification_profile/page";
import { Calendar } from "lucide-react";

const ExpenseHeader = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 className="text-3xl font-semibold text-[var(--color-p-300)]">Pelacakan Pengeluaran</h1>
      <p className="text-sm text-gray-600 mt-1">Pantau dan kelola semua pengeluaran kesehatan Anda</p>
    </div>

    <div className="flex items-center gap-4">
      <div className="hidden md:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg px-3 py-2 cursor-pointer">
        <Calendar size={18} className="text-[var(--color-p-300)]" />
        <span className="text-sm font-medium">Februari 2024</span>
      </div>
      <NotifProfile profileImageSrc={"/img/hospital_dummy.png"} />
    </div>
  </div>
);

export default ExpenseHeader;
