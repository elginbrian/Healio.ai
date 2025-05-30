"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Gender } from "@/types/enums";

export interface PersonalInfoProps {
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ isEditMode, setIsEditMode }) => {
  const { user, login, token } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || 0,
    gender: user?.gender || Gender.MALE,
    ktp_number: user?.ktp_number || "",
    address: user?.address || "",
    bpjs_status: user?.bpjs_status || false,
    education_level: user?.education_level || "",
    chronic_conditions: user?.chronic_conditions || "",
    max_budget: user?.max_budget || 0,
    max_distance_km: user?.max_distance_km || 10,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age || 0,
        gender: user.gender || Gender.MALE,
        ktp_number: user.ktp_number || "",
        address: user.address || "",
        bpjs_status: user.bpjs_status || false,
        education_level: user.education_level || "",
        chronic_conditions: user.chronic_conditions || "",
        max_budget: user.max_budget || 0,
        max_distance_km: user.max_distance_km || 10,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.patch("/api/users/profile", formData);

      if (response.status === 200) {
        toast.success("Informasi pribadi berhasil diperbarui");
        setIsEditMode(false);

        if (token) {
          login(token);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui informasi pribadi");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age || 0,
        gender: user.gender || Gender.MALE,
        ktp_number: user.ktp_number || "",
        address: user.address || "",
        bpjs_status: user.bpjs_status || false,
        education_level: user.education_level || "",
        chronic_conditions: user.chronic_conditions || "",
        max_budget: user.max_budget || 0,
        max_distance_km: user.max_distance_km || 10,
      });
    }
    setIsEditMode(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Informasi Pribadi</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          {isEditMode ? <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required /> : <p className="text-gray-800">{user?.name || "-"}</p>}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-gray-800">{user?.email || "-"}</p>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
          {isEditMode ? <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" /> : <p className="text-gray-800">{user?.phone || "-"}</p>}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usia</label>
          {isEditMode ? <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" min="0" required /> : <p className="text-gray-800">{user?.age || "-"}</p>}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
          {isEditMode ? (
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
              <option value={Gender.MALE}>Laki-laki</option>
              <option value={Gender.FEMALE}>Perempuan</option>
            </select>
          ) : (
            <p className="text-gray-800">{user?.gender === Gender.MALE ? "Laki-laki" : user?.gender === Gender.FEMALE ? "Perempuan" : "-"}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor KTP</label>
          {isEditMode ? (
            <input type="text" name="ktp_number" value={formData.ktp_number} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" maxLength={16} pattern="[0-9]{16}" required />
          ) : (
            <p className="text-gray-800">{user?.ktp_number || "-"}</p>
          )}
        </div>


        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
          {isEditMode ? <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} required /> : <p className="text-gray-800">{user?.address || "-"}</p>}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status BPJS</label>
          {isEditMode ? (
            <select
              name="bpjs_status"
              value={formData.bpjs_status ? "true" : "false"}
              onChange={(e) => setFormData({ ...formData, bpjs_status: e.target.value === "true" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="false">Tidak Memiliki</option>
              <option value="true">Memiliki</option>
            </select>
          ) : (
            <p className="text-gray-800">{user?.bpjs_status ? "Memiliki" : "Tidak Memiliki"}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Pendidikan</label>
          {isEditMode ? (
            <select name="education_level" value={formData.education_level} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
              <option value="">Pilih Tingkat Pendidikan</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="Diploma">Diploma</option>
              <option value="Sarjana">Sarjana</option>
              <option value="Magister">Magister</option>
              <option value="Doktor">Doktor</option>
            </select>
          ) : (
            <p className="text-gray-800">{user?.education_level || "-"}</p>
          )}
        </div>


        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Kesehatan Kronis</label>
          {isEditMode ? (
            <textarea
              name="chronic_conditions"
              value={formData.chronic_conditions}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Tuliskan kondisi kesehatan kronis atau 'Tidak ada' jika tidak memiliki"
              required
            />
          ) : (
            <p className="text-gray-800">{user?.chronic_conditions || "-"}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Budget (Rp)</label>
          {isEditMode ? (
            <input type="number" name="max_budget" value={formData.max_budget} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" min="0" required />
          ) : (
            <p className="text-gray-800">{user?.max_budget?.toLocaleString("id-ID") || "-"}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Jarak (km)</label>
          {isEditMode ? (
            <input type="number" name="max_distance_km" value={formData.max_distance_km} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" min="0" required />
          ) : (
            <p className="text-gray-800">{user?.max_distance_km || "-"}</p>
          )}
        </div>
      </div>

      {isEditMode ? (
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-[var(--color-p-300)] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[var(--color-p-400)]">
            Simpan
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default PersonalInfo;

