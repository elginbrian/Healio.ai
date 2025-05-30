'use client';
import React, { useState } from 'react';
import FooterDashboard from '@/components/landing_page/footer/footer_dashboard/page';
import PersonalInfo from '@/components/profile/personal_info/page';
import HealthInfo from '@/components/profile/health_info/page';
import JobInfo from '@/components/profile/job_info/page';
import ProfileHeader from '@/components/profile/profile_header/page';
import ProfileTabs from '@/components/profile/profile_tabs/profile_tabs';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('pribadi');
  const [isEditMode, setIsEditMode] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'pribadi':
        return <PersonalInfo isEditMode={isEditMode} setIsEditMode={setIsEditMode} />;
      case 'kesehatan':
        return <HealthInfo isEditMode={isEditMode} setIsEditMode={setIsEditMode} />;
      case 'pekerjaan':
        return <JobInfo isEditMode={isEditMode} setIsEditMode={setIsEditMode} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <ProfileHeader isEditMode={isEditMode} setIsEditMode={setIsEditMode} />
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow px-12 py-4 bg-gray-50 overflow-y-auto">
        {renderContent()}
      </div>
      <FooterDashboard />
    </div>
  );
};

export default ProfilePage;
