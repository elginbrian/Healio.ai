"use client";

import AIRecommendation from "@/components/expenses/ai_recommendation/page";
import ExpenseHeader from "@/components/expenses/expenses_header/page";
import RecentExpenses from "@/components/expenses/recent_expense/page";
import Timeline from "@/components/expenses/timeline/page";
import TotalExpenseCard from "@/components/expenses/total_expense/page";
import UploadReceipt from "@/components/expenses/upload_reciept/page";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import React, { useState, useCallback } from "react";

const ExpensePage = () => {
  const [dataVersion, setDataVersion] = useState(0);

  const handleReceiptUploadSuccess = useCallback(() => {
    setDataVersion((prevVersion) => prevVersion + 1);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow px-6 pt-8 md:px-10 pb-20 overflow-y-auto">
        <ExpenseHeader />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <TotalExpenseCard dataVersion={dataVersion} />
            <UploadReceipt onUploadSuccess={handleReceiptUploadSuccess} />
            <AIRecommendation dataVersion={dataVersion} />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <Timeline dataVersion={dataVersion} />
            <RecentExpenses dataVersion={dataVersion} />
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <FooterDashboard />
      </div>
    </div>
  );
};

export default ExpensePage;


