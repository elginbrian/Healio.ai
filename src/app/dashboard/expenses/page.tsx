'use client';

import AIRecommendation from '@/components/expenses/ai_recommendation/page';
import ExpenseHeader from '@/components/expenses/expenses_header/page';
import RecentExpenses from '@/components/expenses/recent_expense/page';
import Timeline from '@/components/expenses/timeline/page';
import TotalExpenseCard from '@/components/expenses/total_expense/page';
import UploadReceipt from '@/components/expenses/upload_reciept/page';
import FooterDashboard from '@/components/landing_page/footer/footer_dashboard/page';
import React from 'react';
const Expense = () => {
  return (
    <div className='w-full min-h-screen flex flex-col p-8'>
      <ExpenseHeader />
      <div className='flex-grow flex flex-col md:flex-row gap-8 pb-8'>
        <div className='flex flex-col w-full md:w-5/12'>
          <TotalExpenseCard />
          <UploadReceipt />
          <AIRecommendation />
        </div>
        <div className='flex flex-col w-7/12'>
          <Timeline />
          <RecentExpenses />
        </div>
      </div>
      <FooterDashboard />
    </div>
  );
};

export default Expense;