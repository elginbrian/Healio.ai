'use client';

import AIRecommendation from '@/components/expenses/ai_recommendation/page';
import ExpenseHeader from '@/components/expenses/expenses_header/page';
import RecentExpenses from '@/components/expenses/recent_expense/page';
import Timeline from '@/components/expenses/timeline/page';
import TotalExpenseCard from '@/components/expenses/total_expense/page';
import UploadReceipt from '@/components/expenses/upload_reciept/page';
import FooterDashboard from '@/components/landing_page/footer/footer_dashboard/page';
import React from 'react';
import SearchField from "@/components/search_field/page";
import FacilityCard from "@/components/facility_card/page";
import React from "react";

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    height: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-p-300);
    border-radius: 3px;
    transition: background 0.3s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--color-p-400, var(--color-p-300));
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--color-p-300) rgba(0, 0, 0, 0.1);
  }
`;

const Expense = () => {
  return (
    <div className='w-full min-h-screen flex flex-col p-8'>
      <ExpenseHeader />
      <div className='flex-grow flex flex-col md:flex-row gap-8 pb-8'>
        <div className='flex flex-col w-full md:w-5/12'>
          <TotalExpenseCard />
          <UploadReceipt />
          <AIRecommendation />
    <div className="w-full px-4 py-8 md:px-10">
      <SearchField />

      <div>
        <p className="text-[var(--color-p-300)] font-semibold text-3xl mt-8">Fasilitas untuk Anda</p>
        <div className="mt-6 -mx-4 md:-mx-10">
          <div className="overflow-x-auto pb-4 px-4 md:px-10 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-black/10 [&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-[var(--color-p-300)] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-[var(--color-p-400)] scrollbar-thin scrollbar-thumb-[var(--color-p-300)] scrollbar-track-black/10">
            <div className="flex gap-6 w-max">
              {facilitiesForYou.map((facility, index) => (
                <div key={index} className="flex-shrink-0">
                  <FacilityCard {...facility} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex flex-col w-7/12'>
          <Timeline />
          <RecentExpenses />
      </div>


      <div className="mt-12">
        <p className="text-[var(--color-p-300)] font-semibold text-3xl mt-8">Fasilitas di Sekitar Anda</p>
        <div className="mt-6 -mx-4 md:-mx-10">
          <div className="overflow-x-auto pb-4 px-4 md:px-10 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-black/10 [&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-[var(--color-p-300)] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-[var(--color-p-400)] scrollbar-thin scrollbar-thumb-[var(--color-p-300)] scrollbar-track-black/10">
            <div className="flex gap-6 w-max">
              {facilitiesForYou.map((facility, index) => (
                <div key={`nearby-${index}`} className="flex-shrink-0">
                  <FacilityCard {...facility} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterDashboard />
    </div>
  );
};

export default Expense;


