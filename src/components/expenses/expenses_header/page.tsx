import React from 'react';
import NotifProfile from '@/components/notification_profile/page';

const ExpenseHeader = () => (
  <div className='flex justify-between items-center mb-8'>
    <h1 className="text-3xl font-semibold text-[var(--color-p-300)]">
      Pelacakan Pengeluaran
    </h1>
    <NotifProfile profileImageSrc={'/img/hospital_dummy.png'} />
  </div>
);

export default ExpenseHeader;
