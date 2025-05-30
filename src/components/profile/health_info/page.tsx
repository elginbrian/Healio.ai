"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface HealthInfoProps {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

const HealthInfo: React.FC<HealthInfoProps> = ({ isEditMode, setIsEditMode }) => {
  const { user, login, token } = useAuth();
  const [healthText, setHealthText] = useState(user?.chronic_conditions || "");

  useEffect(() => {
    if (user) {
      setHealthText(user.chronic_conditions || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const response = await api.patch("/api/users/profile", {
        chronic_conditions: healthText,
      });

      if (response.status === 200) {
        toast.success("Informasi kesehatan berhasil diperbarui");
        setIsEditMode(false);

        if (token) {
          login(token);
        }
      }
    } catch (error) {
      console.error("Error updating health info:", error);
      toast.error("Gagal memperbarui informasi kesehatan");
    }
  };

  const handleCancel = () => {
    if (user) {
      setHealthText(user.chronic_conditions || "");
    }
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Kesehatan</h2>
          <div className="mb-4">
            <label className="text-gray-500 text-sm mb-2 block">Informasi Kesehatan</label>
            <textarea
              value={healthText}
              onChange={(e) => setHealthText(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] focus:border-transparent resize-none"
              placeholder="Masukkan informasi kesehatan Anda..."
            />
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
      <h2 className="text-[var(--color-p-300)] text-xl md:text-2xl font-bold mb-6">Informasi Kesehatan</h2>
      <p className="text-gray-800 leading-relaxed">{healthText || "Tidak ada informasi kesehatan yang tersedia."}</p>
    </div>
  );
};

export default HealthInfo;

