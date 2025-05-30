"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface JobInfoProps {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

interface JobData {
  employment_status: string;
  perusahaan: string;
  lamaBekerja: string;
  income_level: number;
  sumberPendapatanLain: string;
}

const JobInfo: React.FC<JobInfoProps> = ({ isEditMode, setIsEditMode }) => {
  const { user, login, token } = useAuth();

  const [jobData, setJobData] = useState<JobData>({
    employment_status: user?.employment_status || "",
    perusahaan: user?.perusahaan || "",
    lamaBekerja: `${user?.lamaBekerjaJumlah || ""} ${user?.lamaBekerjaSatuan || ""}`,
    income_level: user?.income_level || 0,
    sumberPendapatanLain: user?.sumberPendapatanLain || "",
  });

  useEffect(() => {
    if (user) {
      setJobData({
        employment_status: user.employment_status || "",
        perusahaan: user.perusahaan || "",
        lamaBekerja: `${user.lamaBekerjaJumlah || ""} ${user.lamaBekerjaSatuan || ""}`,
        income_level: user.income_level || 0,
        sumberPendapatanLain: user.sumberPendapatanLain || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof JobData, value: string | number) => {
    setJobData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const lamaBekerjaParts = jobData.lamaBekerja.split(" ");
      const lamaBekerjaJumlah = lamaBekerjaParts[0] || "";
      const lamaBekerjaSatuan = lamaBekerjaParts[1]?.toUpperCase() || "TAHUN";

      const dataToSend = {
        employment_status: jobData.employment_status,
        perusahaan: jobData.perusahaan,
        lamaBekerjaJumlah,
        lamaBekerjaSatuan,
        income_level: jobData.income_level,
        sumberPendapatanLain: jobData.sumberPendapatanLain,
      };

      const response = await api.patch("/api/users/profile", dataToSend);

      if (response.status === 200) {
        toast.success("Informasi pekerjaan berhasil diperbarui");
        setIsEditMode(false);

        if (token) {
          login(token);
        }
      }
    } catch (error) {
      console.error("Error updating job info:", error);
      toast.error("Gagal memperbarui informasi pekerjaan");
    }
  };

  const handleCancel = () => {
    if (user) {
      setJobData({
        employment_status: user.employment_status || "",
        perusahaan: user.perusahaan || "",
        lamaBekerja: `${user.lamaBekerjaJumlah || ""} ${user.lamaBekerjaSatuan || ""}`,
        income_level: user.income_level || 0,
        sumberPendapatanLain: user.sumberPendapatanLain || "",
      });
    }
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Pekerjaan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <InputField label="Pekerjaan" value={jobData.employment_status} onChange={(value) => handleInputChange("employment_status", value)} />
            <InputField label="Perusahaan/Instansi" value={jobData.perusahaan} onChange={(value) => handleInputChange("perusahaan", value)} />
            <InputField label="Lama Bekerja" value={jobData.lamaBekerja} onChange={(value) => handleInputChange("lamaBekerja", value)} placeholder="Contoh: 5 Tahun" />
            <InputField label="Pendapatan Bulanan" value={jobData.income_level.toString()} onChange={(value) => handleInputChange("income_level", parseInt(value) || 0)} type="number" />
            <InputField label="Sumber Pendapatan Lain" value={jobData.sumberPendapatanLain} onChange={(value) => handleInputChange("sumberPendapatanLain", value)} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={handleCancel} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-200">
            Batal
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-[var(--color-p-300)] text-white rounded-full hover:bg-[var(--color-p-400)] transition-colors duration-200">
            Simpan
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Pekerjaan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
        <Info label="Pekerjaan" value={jobData.employment_status || "-"} />
        <Info label="Perusahaan/Instansi" value={jobData.perusahaan || "-"} />
        <Info label="Lama Bekerja" value={jobData.lamaBekerja || "-"} />
        <Info label="Pendapatan Bulanan" value={`Rp${jobData.income_level.toLocaleString("id-ID")}` || "-"} />
        <Info label="Sumber Pendapatan Lain" value={jobData.sumberPendapatanLain || "-"} />
      </div>
    </div>
  );
};

interface InfoProps {
  label: string;
  value: string;
}

const Info: React.FC<InfoProps> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-800 font-medium text-lg">{value}</span>
  </div>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div className="flex flex-col">
    <label className="text-gray-500 text-sm mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] focus:border-transparent"
    />
  </div>
);

export default JobInfo;

