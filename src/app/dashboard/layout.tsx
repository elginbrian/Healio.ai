"use client";

import Sidebar from "@/components/sidebar/Page";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { IUser } from "@/types";
import toast from "react-hot-toast";
import ProfileCompletionModal from "@/components/dashboard/complete-profile-modal";
import ProtectedRoute from "@/components/auth/protected-route";

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
    return !!(currentUser.name && currentUser.hasOwnProperty("age") && currentUser.age !== null && currentUser.age !== 0 && currentUser.gender);
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

  const handleProfileFormSubmit = async (submission: { step: number; formData: any /* isFinalStep: boolean; */ }) => {
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
      const { ktpImage, dob, fullName, pekerjaan, pendapatanBulanan, alamatLengkap, riwayatKesehatan, ...restOfData } = currentData;

      let finalJsonData: Partial<IUser> = { ...restOfData };

      if (fullName) finalJsonData.name = fullName;
      if (pekerjaan) finalJsonData.employment_status = pekerjaan;
      if (pendapatanBulanan) finalJsonData.income_level = parseInt(pendapatanBulanan, 10) || 0;
      if (alamatLengkap) finalJsonData.address = alamatLengkap;
      if (riwayatKesehatan) finalJsonData.chronic_conditions = riwayatKesehatan;

      if (dob && (!finalJsonData.age || finalJsonData.age === 0)) {
        const age = calculateAge(dob as string);
        if (age !== undefined) {
          finalJsonData.age = age;
        }
      }

      delete (finalJsonData as any).ktpImage;
      delete (finalJsonData as any).dob;
      delete (finalJsonData as any).pekerjaan;
      delete (finalJsonData as any).pendapatanBulanan;
      delete (finalJsonData as any).alamatLengkap;
      delete (finalJsonData as any).riwayatKesehatan;

      if (finalJsonData.education_level === undefined || finalJsonData.education_level === "") {
        finalJsonData.education_level = "Belum diisi";
      }
      if (finalJsonData.chronic_conditions === undefined || finalJsonData.chronic_conditions === "") {
        finalJsonData.chronic_conditions = "Tidak ada";
      }
      if (finalJsonData.max_budget === undefined) {
        finalJsonData.max_budget = 0;
      }
      if (finalJsonData.max_distance_km === undefined) {
        finalJsonData.max_distance_km = 10;
      }
      if (finalJsonData.employment_status === undefined || finalJsonData.employment_status === "") {
        finalJsonData.employment_status = "Belum diisi";
      }
      if (finalJsonData.income_level === undefined) {
        finalJsonData.income_level = 0;
      }

      try {
        const response = await api.patch<{ user: IUser; message: string }>("/api/users/profile", finalJsonData);
        toast.success(response.data.message || "Profil berhasil diperbarui!");

        if (ktpImage instanceof File) {
          console.log("TODO: Implement KTP image upload", ktpImage.name);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-p-300)]"></div>
        <p className="ml-4 text-lg text-gray-700">Memuat sesi Anda...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {" "}
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
              dob: (accumulatedProfileData as any).dob || "",
              gender: accumulatedProfileData.gender || user.gender || "",
            }}
            initialStep2Data={{
              nik: accumulatedProfileData.ktp_number || user.ktp_number || "",
              ktpImage: (accumulatedProfileData as any).ktpImage || null,
            }}
            initialStep3Data={{
              pekerjaan: (accumulatedProfileData as any).pekerjaan || user.employment_status || "",
              perusahaan: (accumulatedProfileData as any).perusahaan || "",
              lamaBekerjaJumlah: (accumulatedProfileData as any).lamaBekerjaJumlah || "",
              lamaBekerjaSatuan: (accumulatedProfileData as any).lamaBekerjaSatuan || "BULAN",
              pendapatanBulanan: (accumulatedProfileData as any).pendapatanBulanan || (user.income_level ? String(user.income_level) : ""),
              sumberPendapatanLain: (accumulatedProfileData as any).sumberPendapatanLain || "",
            }}
            initialStep4Data={{
              alamatLengkap: (accumulatedProfileData as any).alamatLengkap || user.address || "",
              kotaKabupaten: (accumulatedProfileData as any).kotaKabupaten || "",
              kodePos: (accumulatedProfileData as any).kodePos || "",
              provinsi: (accumulatedProfileData as any).provinsi || "",
              riwayatKesehatan: (accumulatedProfileData as any).riwayatKesehatan || user.chronic_conditions || "",
              persetujuanAnalisisData:
                (accumulatedProfileData as any).persetujuanAnalisisData !== undefined
                  ? (accumulatedProfileData as any).persetujuanAnalisisData
                  : (user as any).persetujuanAnalisisData !== undefined
                  ? (user as any).persetujuanAnalisisData
                  : false,
              bpjs_status: (accumulatedProfileData as any).bpjs_status !== undefined ? (accumulatedProfileData as any).bpjs_status : user.bpjs_status || false,
              education_level: (accumulatedProfileData as any).education_level || user.education_level || "",
              max_budget: (accumulatedProfileData as any).max_budget || (user.max_budget ? String(user.max_budget) : "0"),
              max_distance_km: (accumulatedProfileData as any).max_distance_km || (user.max_distance_km ? String(user.max_distance_km) : "10"),
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
