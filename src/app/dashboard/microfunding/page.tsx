"use client";

import React, { useState } from "react";
import { PlusSquare, Globe } from "lucide-react";
import NotifProfile from "@/components/notification_profile/page";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CreatePoolForm from "@/components/dashboard/create-pool-form";
import JoinPoolForm from "@/components/dashboard/join-pool-form";
import PoolCard from "@/components/microfunding/pool_card/page";

const Microfunding = () => {
  const [showCreatePoolForm, setShowCreatePoolForm] = useState(false);
  const [showJoinPoolForm, setShowJoinPoolForm] = useState(false);
  const [showJoinPoolSuccess, setShowJoinPoolSuccess] = useState(false);
  const router = useRouter();

  const handleCreatePoolClick = () => {
    setShowCreatePoolForm(true);
  };
  const handleCloseCreatePoolForm = () => {
    setShowCreatePoolForm(false);
  };
  const handlePoolCreated = (newPool: any) => {
    setShowCreatePoolForm(false);
    toast.success(`Pool "${newPool.title}" berhasil dibuat! Kode Pool: ${newPool.pool_code}`);
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
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="w-full flex justify-end mt-8 mb-8 px-8">
        <NotifProfile profileImageSrc="/img/hospital_dummy.png" />
      </div>

      <div className="w-full flex flex-col items-center justify-center flex-grow px-4 md:px-0">
        <h1 className="text-3xl md:text-5xl font-semibold text-[var(--color-p-300)] text-center mb-6">Selamat Datang di Dana Komunal!</h1>
        <p className="text-base md:text-xl text-gray-700 text-center max-w-3xl mb-12 md:mb-16 leading-relaxed px-4">
          Buat atau gabung ke pool dana untuk saling membantu pendanaan kebutuhan medis. Bersama kita bisa memberikan dukungan finansial untuk kesehatan yang lebih baik.
        </p>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-xl md:max-w-5xl px-4 md:px-0">
          <PoolCard icon={PlusSquare} title="Buat Pool Dana" description="Mulai pool dana baru untuk kebutuhan medis dan undang anggota komunitas untuk berpartisipasi." buttonText="Buat Pool Dana" onClick={handleCreatePoolClick} />

          <PoolCard icon={Globe} title="Gabung ke Pool Dana" description="Masukkan kode undangan untuk bergabung dengan pool dana yang sudah ada." buttonText="Gabung ke Pool Dana" onClick={handleJoinPoolClick} />
        </div>
      </div>
      <div className="mt-auto">
        <FooterDashboard />
      </div>

      {showCreatePoolForm && <CreatePoolForm onClose={handleCloseCreatePoolForm} onPoolCreated={handlePoolCreated} />}

      {showJoinPoolForm && <JoinPoolForm onClose={handleCloseJoinPoolForm} onSuccess={handleJoinRequestSuccess} />}
    </div>
  );
};

export default Microfunding;
