
'use client';
import React from 'react';

interface ProfileHeaderProps {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isEditMode, setIsEditMode }) => {
  return (
    <div className="bg-[var(--color-p-300)] px-16 py-16 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src="/img/hospital_dummy.png"
          alt="Profile Picture"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
        />
        <div className="ml-4">
          <h1 className="text-white text-2xl md:text-3xl font-bold">Johan Arizona</h1>
          <span className="inline-block mt-2 px-3 py-1 bg-white text-[var(--color-p-300)] text-xs font-semibold rounded-full">
            Terverifikasi
          </span>
        </div>
      </div>
      {!isEditMode && (
        <button
          onClick={() => setIsEditMode(true)}
          className="bg-white text-[var(--color-p-300)] font-semibold py-2 px-6 rounded-full hover:bg-[var(--color-w-100)] transition-colors duration-300"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileHeader;