"use client";

import Sidebar from "@/components/sidebar/Page";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { IUser } from "@/types";
import toast from "react-hot-toast";
import ProfileCompletionModal from "@/components/dashboard/complete-profile-modal";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, loading, login } = useAuth();
  const [currentProfileStep, setCurrentProfileStep] = useState(1);
  const totalProfileSteps = 4;

  const [accumulatedProfileData, setAccumulatedProfileData] = useState<Partial<IUser & { ktpImage?: File | null }>>({});

  const isInitialProfileComplete = (currentUser: IUser | null): boolean => {
    if (!currentUser) return false;
    return !!(currentUser.name && currentUser.age && currentUser.gender);
  };

  const isKtpVerified = (currentUser: IUser | null): boolean => {
    if (!currentUser) return false;
    return !!currentUser.ktp_number;
  };

  useEffect(() => {
    if (!loading && user) {
      if (!isInitialProfileComplete(user)) {
        setCurrentProfileStep(1);
        setIsProfileModalOpen(true);
      } else if (!isKtpVerified(user)) {
        setCurrentProfileStep(2);
        setIsProfileModalOpen(true);
      }
    }
  }, [user, loading]);

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleGoToPreviousStep = () => {
    setCurrentProfileStep((prev) => Math.max(1, prev - 1));
  };

  const handleProfileFormSubmit = async (submission: { step: number; formData: any }) => {
    if (!user) {
      toast.error("Sesi tidak valid. Silakan login kembali.");
      return;
    }

    let currentData = { ...accumulatedProfileData, ...submission.formData };
    setAccumulatedProfileData(currentData);

    if (submission.step < totalProfileSteps) {
      setCurrentProfileStep((prev) => prev + 1);
      setIsProfileModalOpen(true);
    } else {
      const { ktpImage, ...jsonData } = currentData;

      try {
        const response = await api.patch<{ user: IUser; message: string }>("/api/users/profile", jsonData);
        toast.success(response.data.message || "Profil berhasil diperbarui!");

        if (ktpImage instanceof File) {
        }

        setIsProfileModalOpen(false);
        setAccumulatedProfileData({});
        setCurrentProfileStep(1);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Gagal memperbarui profil.");
      }
    }
  };

  const calculateAge = (dobString: string): number | undefined => {
    if (!dobString) return undefined;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return undefined;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : undefined;
  };

  return (
    <div className="h-full flex">
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-hidden">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>

      {!loading && user && isProfileModalOpen && (
        <ProfileCompletionModal
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          onSubmitForm={handleProfileFormSubmit}
          onGoToPreviousStep={handleGoToPreviousStep}
          currentStep={currentProfileStep}
          totalSteps={totalProfileSteps}
          initialEmail={user?.email || ""}
          initialNik={user?.ktp_number || ""}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
