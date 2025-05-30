"use client";
import React from "react";
import { useAuth } from "@/lib/auth";
import { User } from "lucide-react";

interface ProfileHeaderProps {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isEditMode, setIsEditMode }) => {
  const { user } = useAuth();

  return (
    <div className="bg-[var(--color-p-300)] px-16 py-16 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center bg-[var(--color-p-400)]">
          <User className="text-white h-16 w-16 md:h-20 md:w-20" />
        </div>
        <div className="ml-4">
          <h1 className="text-white text-2xl md:text-3xl font-bold">{user?.name || "Pengguna"}</h1>
          <span className="inline-block mt-2 px-3 py-1 bg-white text-[var(--color-p-300)] text-xs font-semibold rounded-full">Terverifikasi</span>
        </div>
      </div>
      {!isEditMode && (
        <button onClick={() => setIsEditMode(true)} className="bg-white text-[var(--color-p-300)] font-semibold py-2 px-6 rounded-full hover:bg-[var(--color-w-100)] transition-colors duration-300">
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileHeader;
