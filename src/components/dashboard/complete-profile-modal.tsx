"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Info, X } from "lucide-react";

import Step1InformasiDasar from "./step-1-modal";
import Step2VerifikasiKTP from "./step-2-modal";
import Step3PekerjaanPendapatan from "./step-3-modal";
import Step4AlamatKesehatan from "./step-4-modal";

interface Step1Data {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
}

interface Step2Data {
  nik: string;
  ktpImage: File | null;
}

interface Step3Data {
  pekerjaan: string;
  perusahaan: string;
  lamaBekerjaJumlah: string;
  lamaBekerjaSatuan: string;
  pendapatanBulanan: string;
  sumberPendapatanLain: string;
}

interface Step4Data {
  alamatLengkap: string;
  kotaKabupaten: string;
  kodePos: string;
  provinsi: string;
  riwayatKesehatan: string;
  persetujuanAnalisisData: boolean;
  bpjs_status: boolean;
  education_level: string;
  max_budget: string;
  max_distance_km: string;
}

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitForm: (data: { step: number; formData: any; isFinalStep: boolean }) => void;
  onGoToPreviousStep?: () => void;
  currentStep?: number;
  totalSteps?: number;
  initialEmail?: string;
  initialNik?: string;
  initialStep1Data?: Partial<Step1Data>;
  initialStep2Data?: Partial<Step2Data>;
  initialStep3Data?: Partial<Step3Data>;
  initialStep4Data?: Partial<Step4Data>;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  onClose,
  onSubmitForm,
  onGoToPreviousStep,
  currentStep = 1,
  totalSteps = 4,
  initialEmail = "johanariz@gmail.com",
  initialNik = "",
  initialStep1Data,
  initialStep2Data,
  initialStep3Data,
  initialStep4Data,
}) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(currentStep);

  const [step1Data, setStep1Data] = useState<Step1Data>({
    fullName: initialStep1Data?.fullName || "",
    email: initialStep1Data?.email || initialEmail,
    phone: initialStep1Data?.phone || "",
    dob: initialStep1Data?.dob || "",
    gender: initialStep1Data?.gender || "",
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    nik: initialStep2Data?.nik || initialNik,
    ktpImage: initialStep2Data?.ktpImage || null,
  });
  const [ktpImagePreview, setKtpImagePreview] = useState<string | null>(null);

  const [step3Data, setStep3Data] = useState<Step3Data>({
    pekerjaan: initialStep3Data?.pekerjaan || "",
    perusahaan: initialStep3Data?.perusahaan || "",
    lamaBekerjaJumlah: initialStep3Data?.lamaBekerjaJumlah || "",
    lamaBekerjaSatuan: initialStep3Data?.lamaBekerjaSatuan || "BULAN",
    pendapatanBulanan: initialStep3Data?.pendapatanBulanan || "",
    sumberPendapatanLain: initialStep3Data?.sumberPendapatanLain || "",
  });

  const [step4Data, setStep4Data] = useState<Step4Data>({
    alamatLengkap: initialStep4Data?.alamatLengkap || "",
    kotaKabupaten: initialStep4Data?.kotaKabupaten || "",
    kodePos: initialStep4Data?.kodePos || "",
    provinsi: initialStep4Data?.provinsi || "",
    riwayatKesehatan: initialStep4Data?.riwayatKesehatan || "",
    persetujuanAnalisisData: initialStep4Data?.persetujuanAnalisisData || false,
    bpjs_status: initialStep4Data?.bpjs_status || false,
    education_level: initialStep4Data?.education_level || "",
    max_budget: initialStep4Data?.max_budget || "0",
    max_distance_km: initialStep4Data?.max_distance_km || "10",
  });

  const [isLoading, setIsLoading] = useState(false);

  const isStep1Complete = () => {
    return !!step1Data.fullName && !!step1Data.email && !!step1Data.phone && !!step1Data.dob && !!step1Data.gender;
  };

  const isStep2Complete = () => {
    return !!step2Data.nik && step2Data.nik.length === 16;
  };

  const isStep3Complete = () => {
    return !!step3Data.pekerjaan && !!step3Data.perusahaan && !!step3Data.lamaBekerjaJumlah && !!step3Data.pendapatanBulanan;
  };

  const isStep4Complete = () => {
    return !!step4Data.alamatLengkap && !!step4Data.kotaKabupaten && !!step4Data.kodePos && !!step4Data.provinsi && step4Data.persetujuanAnalisisData;
  };

  useEffect(() => {
    let startStep = 1;
    if (!isStep1Complete()) {
      startStep = 1;
    } else if (!isStep2Complete()) {
      startStep = 2;
    } else if (!isStep3Complete()) {
      startStep = 3;
    } else if (!isStep4Complete()) {
      startStep = 4;
    }

    if (startStep > 1) {
      startStep = 1;
    }

    setInternalCurrentStep(startStep);
  }, [isOpen]);

  useEffect(() => {
    setStep1Data({
      fullName: initialStep1Data?.fullName || "",
      email: initialStep1Data?.email || initialEmail,
      phone: initialStep1Data?.phone || "",
      dob: initialStep1Data?.dob || "",
      gender: initialStep1Data?.gender || "",
    });
  }, [initialStep1Data, initialEmail]);

  useEffect(() => {
    setStep2Data({
      nik: initialStep2Data?.nik || initialNik,
      ktpImage: initialStep2Data?.ktpImage || null,
    });
    if (initialStep2Data?.ktpImage) {
    } else {
      setKtpImagePreview(null);
    }
  }, [initialStep2Data, initialNik]);

  useEffect(() => {
    setStep3Data({
      pekerjaan: initialStep3Data?.pekerjaan || "",
      perusahaan: initialStep3Data?.perusahaan || "",
      lamaBekerjaJumlah: initialStep3Data?.lamaBekerjaJumlah || "",
      lamaBekerjaSatuan: initialStep3Data?.lamaBekerjaSatuan || "BULAN",
      pendapatanBulanan: initialStep3Data?.pendapatanBulanan || "",
      sumberPendapatanLain: initialStep3Data?.sumberPendapatanLain || "",
    });
  }, [initialStep3Data]);

  useEffect(() => {
    setStep4Data({
      alamatLengkap: initialStep4Data?.alamatLengkap || "",
      kotaKabupaten: initialStep4Data?.kotaKabupaten || "",
      kodePos: initialStep4Data?.kodePos || "",
      provinsi: initialStep4Data?.provinsi || "",
      riwayatKesehatan: initialStep4Data?.riwayatKesehatan || "",
      persetujuanAnalisisData: initialStep4Data?.persetujuanAnalisisData || false,
      bpjs_status: initialStep4Data?.bpjs_status || false,
      education_level: initialStep4Data?.education_level || "",
      max_budget: initialStep4Data?.max_budget || "0",
      max_distance_km: initialStep4Data?.max_distance_km || "10",
    });
  }, [initialStep4Data]);

  const progressPercentage = Math.round((internalCurrentStep / totalSteps) * 100);

  const handleStepDataChange = (step: number, field: string, value: string | File | null | boolean) => {
    if (step === 1) {
      setStep1Data((prev) => ({ ...prev, [field]: value as string }));
    } else if (step === 2) {
      if (field !== "ktpImage") {
        setStep2Data((prev) => ({ ...prev, [field]: value as string }));
      }
    } else if (step === 3) {
      setStep3Data((prev) => ({ ...prev, [field]: value as string }));
    } else if (step === 4) {
      setStep4Data((prev) => ({ ...prev, [field]: value as string | boolean | number }));
    }
  };

  const handleKtpFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file KTP terlalu besar. Maksimal 2MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("Format file KTP tidak didukung. Gunakan JPG, PNG, atau WEBP.");
        return;
      }

      if (!step2Data.nik || step2Data.nik.length !== 16) {
        const fakeNik = generateFakeNik();
        setStep2Data((prev) => ({
          ktpImage: file,
          nik: fakeNik,
        }));
      } else {
        setStep2Data((prev) => ({ ...prev, ktpImage: file }));
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setStep2Data((prev) => ({ ...prev, ktpImage: null }));
      setKtpImagePreview(null);
    }
  };

  const generateFakeNik = () => {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join("");
  };

  const handleSubmitCurrentStepOrProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let formDataForCurrentStep;
    if (internalCurrentStep === 1) {
      formDataForCurrentStep = step1Data;
      setInternalCurrentStep(2);
    } else if (internalCurrentStep === 2) {
      formDataForCurrentStep = step2Data;
      if (!step2Data.nik || step2Data.nik.length !== 16) {
        const fakeNik = generateFakeNik();
        setStep2Data((prev) => ({ ...prev, nik: fakeNik }));
        formDataForCurrentStep = { ...step2Data, nik: fakeNik };
      }
      setInternalCurrentStep(3);
    } else if (internalCurrentStep === 3) {
      formDataForCurrentStep = step3Data;
      setInternalCurrentStep(4);
    } else if (internalCurrentStep === 4) {
      formDataForCurrentStep = {
        ...step4Data,
        max_budget: parseInt(step4Data.max_budget, 10) || 0,
        max_distance_km: parseInt(step4Data.max_distance_km, 10) || 0,
      };
    }

    const isFinal = internalCurrentStep === totalSteps;
    onSubmitForm({ step: internalCurrentStep, formData: formDataForCurrentStep, isFinalStep: isFinal });
    if (!isFinal) {
      setIsLoading(false);
    }
  };

  const handleGoToPreviousStep = () => {
    if (internalCurrentStep > 1) {
      setInternalCurrentStep(internalCurrentStep - 1);
    }
    if (onGoToPreviousStep) {
      onGoToPreviousStep();
    }
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    if (internalCurrentStep === 1) {
      return <Step1InformasiDasar formData={step1Data} onFormDataChange={(field, value) => handleStepDataChange(1, field, value)} onSubmitStep={handleSubmitCurrentStepOrProfile} isLoading={isLoading} />;
    } else if (internalCurrentStep === 2) {
      return (
        <Step2VerifikasiKTP
          formData={step2Data}
          ktpImagePreview={ktpImagePreview}
          onFormDataChange={(field, value) => handleStepDataChange(2, field, value)}
          onKtpFileChange={handleKtpFileChange}
          onSubmitStep={handleSubmitCurrentStepOrProfile}
          onGoToPreviousStep={handleGoToPreviousStep}
          isLoading={isLoading}
        />
      );
    } else if (internalCurrentStep === 3) {
      return (
        <Step3PekerjaanPendapatan
          formData={step3Data}
          onFormDataChange={(field, value) => handleStepDataChange(3, field, value)}
          onSubmitStep={handleSubmitCurrentStepOrProfile}
          onGoToPreviousStep={handleGoToPreviousStep}
          isLoading={isLoading}
        />
      );
    } else if (internalCurrentStep === 4) {
      return (
        <Step4AlamatKesehatan
          formData={step4Data}
          onFormDataChange={(field, value) => handleStepDataChange(4, field, value)}
          onSubmitProfile={handleSubmitCurrentStepOrProfile}
          onGoToPreviousStep={handleGoToPreviousStep}
          isLoading={isLoading}
        />
      );
    }
    return <p>Step tidak diketahui atau belum diimplementasikan.</p>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-[var(--color-p-300)] text-white p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold">Lengkapi Profil Anda</h2>
            <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-full transition-colors" aria-label="Tutup modal">
              <X size={24} />
            </button>
          </div>
          <div className="flex items-start text-sm">
            <Info size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>Data Anda akan dianalisis oleh AI untuk memberikan rekomendasi fasilitas kesehatan yang sesuai dengan profil Anda.</p>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>
                Langkah {internalCurrentStep} dari {totalSteps}
              </span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[var(--color-p-300)] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;

