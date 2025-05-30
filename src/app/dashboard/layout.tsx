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
  const { user, loading, login, token } = useAuth();
  const [currentProfileStep, setCurrentProfileStep] = useState(1);
  const totalProfileSteps = 4;

  const [accumulatedProfileData, setAccumulatedProfileData] = useState<
    Partial<
      IUser & {
        ktpImage?: File | null;
        pekerjaan?: string;
        perusahaan?: string;
        lamaBekerjaJumlah?: string;
        lamaBekerjaSatuan?: string;
        pendapatanBulanan?: string;
        sumberPendapatanLain?: string;
        alamatLengkap?: string;
        kotaKabupaten?: string;
        kodePos?: string;
        provinsi?: string;
        riwayatKesehatan?: string;
        persetujuanAnalisisData?: boolean;
        dob?: string;
      }
    >
  >({});

  const isInitialProfileComplete = (currentUser: IUser | null): boolean => {
    if (!currentUser) return false;
    return !!(currentUser.name && currentUser.hasOwnProperty("age") && currentUser.age !== null && currentUser.gender);
  };

  const isKtpVerified = (currentUser: IUser | null): boolean => {
    if (!currentUser) return false;
    return !!(currentUser.ktp_number && currentUser.ktp_number.trim() !== "");
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
      const { ktpImage, dob, ...jsonDataToSubmit } = currentData;

      let finalJsonData: Partial<IUser> = { ...jsonDataToSubmit };

      if (dob && (!finalJsonData.age || finalJsonData.age === 0)) {
        const age = calculateAge(dob as string);
        if (age !== undefined) {
          finalJsonData.age = age;
        }
      }

      if (currentData.pekerjaan) {
        finalJsonData.employment_status = currentData.pekerjaan;
      }

      if (currentData.pendapatanBulanan) {
        finalJsonData.income_level = parseInt(currentData.pendapatanBulanan, 10) || 0;
      }

      if (currentData.alamatLengkap) {
        finalJsonData.address = currentData.alamatLengkap;
      }

      if (currentData.riwayatKesehatan) {
        finalJsonData.chronic_conditions = currentData.riwayatKesehatan;
      }

      if (!finalJsonData.education_level) {
        finalJsonData.education_level = "Tidak Diisi";
      }

      if (!finalJsonData.max_budget) {
        finalJsonData.max_budget = 0;
      }

      if (!finalJsonData.max_distance_km) {
        finalJsonData.max_distance_km = 10;
      }

      try {
        const response = await api.patch<{ user: IUser; message: string }>("/api/users/profile", finalJsonData);
        toast.success(response.data.message || "Profil berhasil diperbarui!");

        if (ktpImage instanceof File) {
        }

        if (token) {
          login(token);
        }

        setIsProfileModalOpen(false);
        setAccumulatedProfileData({});
        setCurrentProfileStep(1);
      } catch (error: any) {
        console.error("Profile update error:", error.response?.data || error.message);
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
    <div className="h-screen w-full flex overflow-hidden">
      <div className="h-full flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-hidden">
        <div className="h-screen overflow-y-auto">{children}</div>
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
          initialStep1Data={{
            fullName: accumulatedProfileData.name || user.name || "",
            email: accumulatedProfileData.email || user.email || "",
            phone: accumulatedProfileData.phone || user.phone || "",
            dob: accumulatedProfileData.dob || "",
            gender: accumulatedProfileData.gender || user.gender || "",
          }}
          initialStep2Data={{
            nik: accumulatedProfileData.ktp_number || user.ktp_number || "",
            ktpImage: (accumulatedProfileData as any).ktpImage || null,
          }}
          initialStep3Data={{
            pekerjaan: accumulatedProfileData.pekerjaan || user.employment_status || "",
            perusahaan: accumulatedProfileData.perusahaan || (user as any).perusahaan || "",
            lamaBekerjaJumlah: accumulatedProfileData.lamaBekerjaJumlah || (user as any).lamaBekerjaJumlah || "",
            lamaBekerjaSatuan: accumulatedProfileData.lamaBekerjaSatuan || (user as any).lamaBekerjaSatuan || "BULAN",
            pendapatanBulanan: accumulatedProfileData.pendapatanBulanan || (user.income_level ? String(user.income_level) : "") || "",
            sumberPendapatanLain: accumulatedProfileData.sumberPendapatanLain || (user as any).sumberPendapatanLain || "",
          }}
          initialStep4Data={{
            alamatLengkap: accumulatedProfileData.alamatLengkap || user.address || "",
            kotaKabupaten: accumulatedProfileData.kotaKabupaten || (user as any).kotaKabupaten || "",
            kodePos: accumulatedProfileData.kodePos || (user as any).kodePos || "",
            provinsi: accumulatedProfileData.provinsi || (user as any).provinsi || "",
            riwayatKesehatan: accumulatedProfileData.riwayatKesehatan || user.chronic_conditions || "",
            persetujuanAnalisisData:
              accumulatedProfileData.persetujuanAnalisisData !== undefined ? accumulatedProfileData.persetujuanAnalisisData : (user as any).persetujuanAnalisisData !== undefined ? (user as any).persetujuanAnalisisData : false,
          }}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

