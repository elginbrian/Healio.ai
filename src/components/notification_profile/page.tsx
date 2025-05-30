'use client';

import React from 'react';
import { Bell } from 'lucide-react';

interface NotifProfileProps {
  profileImageSrc: string;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

const NotifProfile = ({ profileImageSrc, onNotificationClick, onProfileClick }: NotifProfileProps) => {
  return (
    <div className='flex items-center space-x-4'>
      <button onClick={onNotificationClick} className='relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]' aria-label="Notifications">
        <Bell size={36} className='text-[var(--color-p-300)]' />
      </button>

      <button onClick={onProfileClick} className='w-14 h-14 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]' aria-label="Profile">
        <img src={profileImageSrc} className='w-full h-full object-cover' alt="Profile" />
      </button>
    </div>
  );
}

export default NotifProfile;