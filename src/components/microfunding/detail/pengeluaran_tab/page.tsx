"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Hospital, Pill, Stethoscope } from 'lucide-react';
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Expense {
  _id: string;
  type: string;
  description: string;
  hospital?: string;
  date: Date | string;
  amount: number;
  status: string;
  claimant?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
}

interface PengeluaranTabProps {
  poolId?: string;
}

const PengeluaranTab = ({ poolId }: PengeluaranTabProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!poolId) return;
    
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/microfunding/pool/${poolId}/expenses`);
        if (response.data.success) {
          setExpenses(response.data.expenses || []);
        } else {
          toast.error(response.data.message || "Gagal memuat daftar pengeluaran");
        }
      } catch (error: any) {
        console.error("Error fetching expenses:", error);
        
        const placeholderExpenses = [
          {
            _id: "expense1",
            type: 'Rawat Inap',
            description: 'Rawat Inap - Johan Arizona',
            hospital: 'RS Medika Sejahtera',
            date: new Date('2023-03-05'),
            amount: 3500000,
            status: 'APPROVED',
            claimant: { _id: 'user1', name: 'Johan Arizona' }
          },
          {
            _id: "expense2",
            type: 'Rawat Inap',
            description: 'Rawat Inap - Andreas Bagaskoro',
            hospital: 'RS Harapan Bunda',
            date: new Date('2023-02-12'),
            amount: 12000000,
            status: 'APPROVED',
            claimant: { _id: 'user2', name: 'Andreas Bagaskoro' }
          },
          {
            _id: "expense3",
            type: 'Obat',
            description: 'Obat - Elgin Brian',
            hospital: 'Apotek Sehat',
            date: new Date('2023-01-28'),
            amount: 850000,
            status: 'APPROVED',
            claimant: { _id: 'user3', name: 'Elgin Brian' }
          },
          {
            _id: "expense4",
            type: 'Konsultasi Spesialis',
            description: 'Konsultasi Spesialis - Rizqi Aditya',
            hospital: 'Klinik Spesialis Jantung',
            date: new Date('2023-01-15'),
            amount: 1200000,
            status: 'APPROVED',
            claimant: { _id: 'user4', name: 'Rizqi Aditya' }
          },
        ];
        setExpenses(placeholderExpenses);
        console.warn("Using placeholder expense data", error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [poolId]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    
    setExpenses(prevExpenses => [...prevExpenses].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }));
  };

  const getExpenseIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'rawat inap':
        return Hospital;
      case 'obat':
        return Pill;
      case 'konsultasi':
      case 'konsultasi spesialis':
        return Stethoscope;
      default:
        return Hospital;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Riwayat Pengeluaran</h3>
        <div className="ml-2 flex flex-col">
          <ChevronUp 
            size={16} 
            className={`cursor-pointer ${sortOrder === 'asc' ? 'text-[var(--color-p-300)]' : 'text-gray-400'} hover:text-gray-600`} 
            onClick={toggleSortOrder}
          />
          <ChevronDown 
            size={16} 
            className={`cursor-pointer ${sortOrder === 'desc' ? 'text-[var(--color-p-300)]' : 'text-gray-400'} hover:text-gray-600`} 
            onClick={toggleSortOrder}
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-p-300)]" />
          </div>
        ) : expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense) => {
              const ExpenseIcon = getExpenseIcon(expense.type);
              return (
                <div key={expense._id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gray-100 rounded-full mr-4">
                      <ExpenseIcon size={24} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-800">{expense.description}</div>
                      <div className="text-sm text-gray-500">
                        {expense.hospital} • {formatDate(expense.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[var(--color-p-300)]">
                    Rp{expense.amount.toLocaleString('id-ID')}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">Belum ada pengeluaran yang tercatat.</p>
        )}
      </div>
    </div>
  );
};

export default PengeluaranTab;

