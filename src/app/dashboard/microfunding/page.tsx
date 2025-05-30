// app/microfunding/page.jsx
"use client";

import React, { useState } from "react";
import { PlusSquare, Globe } from "lucide-react";
import NotifProfile from "@/components/notification_profile/page";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import PoolCard from "@/components/microfunding/pool_card/page";
import JoinPoolForm from "@/components/microfunding/join_pool_form/page";
import CreatePoolForm from "@/components/microfunding/create_pool_form/page";
import JoinPoolSuccess from "@/components/microfunding/success_join/page";

const Microfunding = () => {
  const [showCreatePoolForm, setShowCreatePoolForm] = useState(false); // State to control create pool form visibility
  const [showJoinPoolForm, setShowJoinPoolForm] = useState(false); // State to control join pool form visibility
  const [showJoinPoolSuccess, setShowJoinPoolSuccess] = useState(false); // State to control join pool success popup

  const handleCreatePool = () => {
    console.log("Buat Pool Dana clicked!");
    setShowCreatePoolForm(true); // Show the create pool form
  };

  const handleJoinPool = () => {
    console.log("Gabung ke Pool Dana clicked!");
    setShowJoinPoolForm(true); // Show the join pool form
  };

  const handleJoinSuccess = () => {
    setShowJoinPoolForm(false); // Hide join form
    setShowJoinPoolSuccess(true); // Show success popup
  };

  const handleCloseSuccess = () => {
    setShowJoinPoolSuccess(false); // Hide success popup
  };

  return (
    <div className="w-full h-screen flex flex-col pt-8">
      <div className="w-full flex justify-end mb-8  px-8">
        <NotifProfile profileImageSrc="/img/hospital_dummy.png" />
      </div>

      <div className="w-full flex flex-col items-center justify-center flex-grow transform -translate-y-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-p-300)] text-center mb-6">Selamat Datang di Dana Komunal!</h1>
        <p className="text-lg md:text-xl text-gray-700 text-center max-w-3xl mb-16 leading-relaxed">
          Buat atau gabung ke pool dana untuk saling membantu pendanaan kebutuhan medis. Bersama kita bisa memberikan dukungan finansial untuk kesehatan yang lebih baik.
        </p>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
          <PoolCard icon={PlusSquare} title="Buat Pool Dana" description="Mulai pool dana baru untuk kebutuhan medis dan undang anggota komunitas untuk berpartisipasi." buttonText="Buat Pool Dana" onClick={handleCreatePool} />

          <PoolCard icon={Globe} title="Gabung ke Pool Dana" description="Masukkan kode undangan untuk bergabung dengan pool dana yang sudah ada." buttonText="Gabung ke Pool Dana" onClick={handleJoinPool} />
        </div>
      </div>
      <div>
        <FooterDashboard />
      </div>

      {/* Conditionally render the CreatePoolForm */}
      {showCreatePoolForm && <CreatePoolForm onClose={() => setShowCreatePoolForm(false)} />}

      {/* Conditionally render the JoinPoolForm */}
      {showJoinPoolForm && <JoinPoolForm onClose={() => setShowJoinPoolForm(false)} onSuccess={handleJoinSuccess} />}

      {/* Conditionally render the JoinPoolSuccess */}
      {showJoinPoolSuccess && <JoinPoolSuccess onClose={handleCloseSuccess} />}
    </div>
  );
};

export default Microfunding;
