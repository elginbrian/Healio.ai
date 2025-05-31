"use client";

import React, { useState, useEffect } from "react";
import { PlusSquare, Globe, ListChecks, Loader2, PlusCircle, LogIn } from "lucide-react";
import PoolCard from "@/components/microfunding/pool_card/page";
import NotifProfile from "@/components/notification_profile/page";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import CreatePoolForm, { CreatePoolFormProps } from "@/components/dashboard/create-pool-form";
import JoinPoolForm from "@/components/microfunding/join_pool_form/page";
import JoinPoolSuccess from "@/components/microfunding/success_join/page";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { IMicrofundingPool } from "@/types";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const Microfunding = () => {
  const [showCreatePoolForm, setShowCreatePoolForm] = useState(false);
  const [showJoinPoolForm, setShowJoinPoolForm] = useState(false);
  const [showJoinPoolSuccess, setShowJoinPoolSuccess] = useState(false);
  const [myPools, setMyPools] = useState<IMicrofundingPool[]>([]);
  const [isLoadingPools, setIsLoadingPools] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const fetchMyPools = async () => {
    if (!user && !authLoading) {
      setIsLoadingPools(false);
      setMyPools([]);
      return;
    }
    if (authLoading || !user) return;

    setIsLoadingPools(true);
    try {
      const response = await api.get<{ success: boolean; pools: IMicrofundingPool[]; message?: string }>("/api/microfunding/pool/my-pool");
      if (response.data.success) {
        setMyPools(response.data.pools || []);
      } else {
        toast.error(response.data.message || "Gagal memuat daftar pool Anda.");
        setMyPools([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat memuat daftar pool.");
      console.error("Fetch my pools error:", error);
      setMyPools([]);
    } finally {
      setIsLoadingPools(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchMyPools();
    }
  }, [user, authLoading]);

  const handleCreatePoolClick = () => {
    setShowCreatePoolForm(true);
  };
  const handleCloseCreatePoolForm = () => {
    setShowCreatePoolForm(false);
  };

  const handlePoolCreated = (newPool: IMicrofundingPool) => {
    setShowCreatePoolForm(false);
    toast.success(`Pool "${newPool.title}" berhasil dibuat! Kode Pool: ${newPool.pool_code}`);
    if (newPool && newPool._id) {
      router.push(`/dashboard/microfunding/detail?poolId=${newPool._id}`);
    }
    fetchMyPools();
  };

  const handleJoinPoolClick = () => {
    setShowJoinPoolForm(true);
  };
  const handleCloseJoinPoolForm = () => {
    setShowJoinPoolForm(false);
  };
  const handleJoinRequestSuccess = () => {
    setShowJoinPoolForm(false);
    setShowJoinPoolSuccess(true);
  };
  const handleCloseJoinSuccessModal = () => {
    setShowJoinPoolSuccess(false);
    fetchMyPools();
  };

  const ActionButton = ({ icon: Icon, text, onClick }: { icon: React.ElementType; text: string; onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto min-w-[200px] h-full">
      <Icon size={40} className="text-[var(--color-p-300)] mb-3" />
      <span className="text-lg font-semibold text-gray-700">{text}</span>
    </button>
  );

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <div className="w-full flex justify-end mt-8 mb-8 px-4 sm:px-8">
        <NotifProfile profileImageSrc="/img/hospital_dummy.png" />
      </div>

      <div className="w-full flex flex-col items-center flex-grow px-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-p-300)] text-center mb-4">Selamat Datang di Dana Komunal!</h1>
        <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mb-10 md:mb-12 leading-relaxed">
          Buat atau gabung ke pool dana untuk saling membantu pendanaan kebutuhan medis. Bersama kita bisa memberikan dukungan finansial untuk kesehatan yang lebih baik.
        </p>

        {isLoadingPools ? (
          <div className="flex-grow flex flex-col justify-center items-center py-10">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--color-p-300)]" />
            <p className="mt-4 text-gray-500">Memuat data pool Anda...</p>
          </div>
        ) : myPools.length === 0 ? (
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-xl md:max-w-4xl mb-16">
            <PoolCard icon={PlusSquare} title="Buat Pool Dana" description="Mulai pool dana baru untuk kebutuhan medis dan undang anggota komunitas untuk berpartisipasi." buttonText="Buat Pool Dana" onClick={handleCreatePoolClick} />
            <PoolCard icon={Globe} title="Gabung ke Pool Dana" description="Masukkan kode undangan untuk bergabung dengan pool dana yang sudah ada." buttonText="Gabung ke Pool Dana" onClick={handleJoinPoolClick} />
          </div>
        ) : (
          <div className="w-full max-w-5xl mb-10">
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
              <ActionButton icon={PlusCircle} text="Buat Pool Baru" onClick={handleCreatePoolClick} />
              <ActionButton icon={LogIn} text="Gabung Pool Lain" onClick={handleJoinPoolClick} />
            </div>
          </div>
        )}

        {!isLoadingPools && (
          <div className="w-full max-w-5xl mb-16">
            <div className="flex items-center mb-6">
              <ListChecks size={28} className="text-[var(--color-p-300)] mr-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Pool Dana Saya</h2>
            </div>
            {myPools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPools.map((pool) => (
                  <Link key={pool._id} href={`/dashboard/microfunding/detail?poolId=${pool._id}`} passHref>
                    <div className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 h-full flex flex-col justify-between min-h-[200px]">
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--color-p-300)] mb-2 truncate" title={pool.title}>
                          {pool.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          Kode: <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{pool.pool_code}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3 h-[60px] overflow-hidden">{pool.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>
                            Anggota: <span className="font-semibold text-gray-700">{pool.max_members} Maks</span>
                          </span>{" "}
                          <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${pool.status === "OPEN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{pool.status === "OPEN" ? "Terbuka" : "Ditutup"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10 bg-white rounded-xl shadow">Anda belum bergabung atau membuat pool dana.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <FooterDashboard />
      </div>

      {showCreatePoolForm && <CreatePoolForm onClose={handleCloseCreatePoolForm} onPoolCreated={handlePoolCreated} />}
      {showJoinPoolForm && <JoinPoolForm onClose={handleCloseJoinPoolForm} onSuccess={handleJoinRequestSuccess} />}
      {showJoinPoolSuccess && <JoinPoolSuccess onClose={handleCloseJoinSuccessModal} />}
    </div>
  );
};

export default Microfunding;
