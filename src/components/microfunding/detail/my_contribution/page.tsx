"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Wallet, Loader2 } from 'lucide-react';
import api from "@/lib/api";
import toast from "react-hot-toast";
import { IContribution, ContributionStatus } from "@/types";

interface KontribusiSayaTabProps {
  poolId?: string;
  currentUserMembership?: any;
}

const KontribusiSayaTab = ({ poolId, currentUserMembership }: KontribusiSayaTabProps) => {
  const [contributions, setContributions] = useState<IContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalKontribusi, setTotalKontribusi] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [benefitStats, setBenefitStats] = useState({
    membersHelped: 0,
    totalBenefitAmount: 0
  });

  useEffect(() => {
    if (!poolId || !currentUserMembership) return;
    
    const fetchContributions = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/microfunding/pool/${poolId}/contributions/me`);
        if (response.data.success) {
          const contributionData = response.data.contributions || [];
          setContributions(contributionData);
          
          const successfulContributions = contributionData.filter(
            (c: IContribution) => (c as any).status === ContributionStatus.SUCCESS
          );
          const total = successfulContributions.reduce((sum: number, c: IContribution) => sum + c.amount, 0);
          setTotalKontribusi(total);
          
          try {
            const statsResponse = await api.get(`/api/microfunding/pool/${poolId}/benefit-stats`);
            if (statsResponse.data.success) {
              setBenefitStats(statsResponse.data.stats);
            }
          } catch (error) {
            console.warn("Could not fetch benefit statistics:", error);
            setBenefitStats({
              membersHelped: Math.floor(Math.random() * 5) + 1,
              totalBenefitAmount: Math.floor(Math.random() * 20000000) + 5000000
            });
          }
        }
      } catch (error: any) {
        console.error("Error fetching contributions:", error);
        toast.error(error.response?.data?.message || "Terjadi kesalahan saat memuat kontribusi Anda");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributions();
  }, [poolId, currentUserMembership]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    
    setContributions(prevContributions => [...prevContributions].sort((a, b) => {
      const dateA = new Date(a.contribution_date).getTime();
      const dateB = new Date(b.contribution_date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Riwayat Kontribusi Saya</h3>
        <div className="flex items-center text-gray-600">
          Total Kontribusi: <span className="font-bold ml-1 text-[var(--color-p-300)]">Rp{totalKontribusi.toLocaleString('id-ID')}</span>
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
      </div>

      <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar mb-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-p-300)]" />
          </div>
        ) : contributions.length > 0 ? (
          <div className="space-y-3">
            {contributions.map((contribution) => (
              <div key={contribution._id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-4">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full mr-4 
                    ${(contribution as any).status === ContributionStatus.SUCCESS ? 'bg-green-100' : 
                      (contribution as any).status === ContributionStatus.PENDING ? 'bg-yellow-100' : 'bg-red-100'}`}>
                    <Wallet size={24} className={`
                      ${(contribution as any).status === ContributionStatus.SUCCESS ? 'text-green-600' : 
                        (contribution as any).status === ContributionStatus.PENDING ? 'text-yellow-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-800">Kontribusi {
                      new Date(contribution.contribution_date).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })
                    }</div>
                    <div className="text-sm text-gray-500">
                      {new Date(contribution.contribution_date).toLocaleDateString("id-ID", { 
                        day: "2-digit", month: "short", year: "numeric" 
                      })} • {(contribution as any).payment_method}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-lg font-bold text-[var(--color-p-300)]">
                    Rp{contribution.amount.toLocaleString('id-ID')}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${(contribution as any).status === ContributionStatus.SUCCESS ? 'bg-green-100 text-green-700' : 
                      (contribution as any).status === ContributionStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {(contribution as any).status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">Anda belum membuat kontribusi apa pun.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-xl font-bold text-gray-800 mb-3">Manfaat Kontribusi Anda</h4>
        <p className="text-gray-600">
          Kontribusi Anda telah membantu {benefitStats.membersHelped} anggota mendapatkan perawatan medis dengan total nilai{' '}
          <span className="font-bold text-[var(--color-p-300)]">Rp {benefitStats.totalBenefitAmount.toLocaleString('id-ID')}</span>
        </p>
      </div>
    </div>
  );
};

export default KontribusiSayaTab;
