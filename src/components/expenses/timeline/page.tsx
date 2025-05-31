"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Loader2, AlertTriangle, CalendarRange, TrendingUp } from "lucide-react";
import { IExpenseRecordDocument } from "@/models/expense-record";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

interface TimelineProps {
  dataVersion: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-[var(--color-p-300)] font-medium mt-1">Total: Rp{payload[0].value.toLocaleString("id-ID")}</p>
      </div>
    );
  }
  return null;
};

const Timeline = ({ dataVersion }: TimelineProps) => {
  const [timelineData, setTimelineData] = useState<IExpenseRecordDocument[]>([]);
  const [chartData, setChartData] = useState<Array<{ date: string; amount: number; formattedDate: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [averagePerDay, setAveragePerDay] = useState<number>(0);

  useEffect(() => {
    const fetchTimelineData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const threeMothsAgo = new Date();
        threeMothsAgo.setDate(threeMothsAgo.getDate() - 90);

        const response = await api.get(`/api/expenses?limit=500&sortBy=transaction_date&sortOrder=asc&startDate=${threeMothsAgo.toISOString()}`);

        if (response.data.success) {
          setTimelineData(response.data.data);
          processChartData(response.data.data);
        } else {
          throw new Error(response.data.message || "Gagal mengambil data linimasa.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan.");
        setTimelineData([]);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimelineData();
  }, [dataVersion]);

  const processChartData = (data: IExpenseRecordDocument[]) => {
    if (!data.length) {
      setChartData([]);
      setTotalSpent(0);
      setAveragePerDay(0);
      return;
    }

    const expensesByDate: Record<string, number> = {};
    let totalAmount = 0;

    data.forEach((expense) => {
      const date = new Date(expense.transaction_date || expense.createdAt);
      const dateStr = date.toISOString().split("T")[0];

      if (!expensesByDate[dateStr]) {
        expensesByDate[dateStr] = 0;
      }
      expensesByDate[dateStr] += expense.total_price;
      totalAmount += expense.total_price;
    });

    const sortedDates = Object.keys(expensesByDate).sort();
    if (sortedDates.length > 1) {
      const startDate = new Date(sortedDates[0]);
      const endDate = new Date(sortedDates[sortedDates.length - 1]);

      const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setAveragePerDay(totalAmount / dayDiff);

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        if (!expensesByDate[dateStr]) {
          expensesByDate[dateStr] = 0;
        }
      }
    } else if (sortedDates.length === 1) {
      const singleDate = new Date(sortedDates[0]);

      const dayBefore = new Date(singleDate);
      dayBefore.setDate(dayBefore.getDate() - 1);
      const dayBeforeStr = dayBefore.toISOString().split("T")[0];
      expensesByDate[dayBeforeStr] = 0;

      const dayAfter = new Date(singleDate);
      dayAfter.setDate(dayAfter.getDate() + 1);
      const dayAfterStr = dayAfter.toISOString().split("T")[0];
      expensesByDate[dayAfterStr] = 0;

      setAveragePerDay(totalAmount);
    }

    setTotalSpent(totalAmount);

    const formattedChartData = Object.entries(expensesByDate)
      .map(([date, amount]) => ({
        date,
        amount,
        formattedDate: formatDateForDisplay(date),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setChartData(formattedChartData);
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  type TooltipFormatterReturn = [string, string];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[var(--color-p-300)] font-semibold text-xl">Linimasa Pengeluaran</p>
        {!isLoading && !error && timelineData.length > 0 && (
          <div className="flex gap-4 text-sm">
            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <TrendingUp size={14} className="mr-1 text-gray-500" />
              <span className="text-gray-700 font-medium">Total: Rp{totalSpent.toLocaleString("id-ID")}</span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
              <CalendarRange size={14} className="mr-1 text-gray-500" />
              <span className="text-gray-700 font-medium">Rata-rata: Rp{Math.round(averagePerDay).toLocaleString("id-ID")}/hari</span>
            </div>
          </div>
        )}
      </div>
      <div className="w-full min-h-[20rem] shadow-md rounded-2xl bg-white p-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-p-300)] mb-3" />
            <p className="text-gray-500">Memuat data linimasa...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-64 text-red-500">
            <AlertTriangle size={32} className="mb-3" />
            <p className="text-center">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Silakan coba muat ulang halaman</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-400">
            <CalendarRange size={48} className="mb-3" />
            <p className="text-center text-gray-500">Belum ada data pengeluaran untuk ditampilkan</p>
            <p className="text-sm text-gray-400 mt-2">Mulai catat pengeluaran kesehatan Anda</p>
          </div>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-p-300)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-p-300)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: "#666" }} tickMargin={10} tickLine={{ stroke: "#ccc" }} axisLine={{ stroke: "#ccc" }} interval={"preserveStartEnd"} />
                <YAxis tickFormatter={(value: number): string => `Rp${value.toLocaleString("id-ID")}`} tick={{ fontSize: 11, fill: "#666" }} tickLine={{ stroke: "#ccc" }} axisLine={{ stroke: "#ccc" }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={30} iconType="circle" iconSize={8} wrapperStyle={{ paddingBottom: "10px" }} />
                <ReferenceLine
                  y={averagePerDay}
                  stroke="#FF9800"
                  strokeDasharray="3 3"
                  label={{
                    value: "Rata-rata",
                    position: "insideBottomRight",
                    fill: "#FF9800",
                    fontSize: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Pengeluaran Harian"
                  stroke="var(--color-p-300)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--color-p-300)", strokeWidth: 1 }}
                  activeDot={{ r: 6, stroke: "var(--color-p-400)", strokeWidth: 2, fill: "white" }}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="text-xs text-center text-gray-500 mt-2">Data pengeluaran 90 hari terakhir</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;

