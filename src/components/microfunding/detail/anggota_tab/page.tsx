"use client";

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import api from "@/lib/api";
import toast from "react-hot-toast";
import { PoolMemberRole } from "@/types/enums";

interface Member {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
  role: PoolMemberRole;
  joined_date: string;
  total_contribution?: number;
  total_claims?: number;
}

interface AnggotaTabProps {
  poolId?: string;
}

const AnggotaTab = ({ poolId }: AnggotaTabProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (!poolId) return;
    
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/microfunding/pool/${poolId}/members`);
        if (response.data.success) {
          setMembers(response.data.members || []);
        } else {
          toast.error(response.data.message || "Gagal memuat daftar anggota");
        }
      } catch (error: any) {
        console.error("Error fetching members:", error);
        toast.error(error.response?.data?.message || "Terjadi kesalahan saat memuat daftar anggota");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [poolId]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    
    setMembers(prevMembers => [...prevMembers].sort((a, b) => {
      const dateA = new Date(a.joined_date).getTime();
      const dateB = new Date(b.joined_date).getTime();
      return sortOrder === 'asc' ? dateB - dateA : dateA - dateB;
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Daftar Anggota</h3>
        <div className="flex items-center text-gray-600">
          Total: <span className="font-bold ml-1">{members.length} Anggota</span>
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

      <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-p-300)]" />
          </div>
        ) : members.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bergabung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontribusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Klaim
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full" 
                          src={member.user_id.picture || "/img/hospital_dummy.png"} 
                          alt={`${member.user_id.name}'s profile`} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.user_id.name}</div>
                        <div className="text-sm text-gray-500">{member.role === PoolMemberRole.ADMIN ? 'Admin' : 'Member'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.joined_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp{(member.total_contribution || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.total_claims || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-10 text-gray-500">Belum ada anggota dalam pool ini.</p>
        )}
      </div>
    </div>
  );
};

export default AnggotaTab;

