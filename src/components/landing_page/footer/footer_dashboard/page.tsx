'use client'

import React from 'react'
import { Mail, Phone } from 'lucide-react'

const FooterDashboard = () => {
  return (
    <div className='px-6 md:px-24 w-full bg-[var(--color-w-300)] h-32 flex flex-col justify-center'>
      <div className='flex items-center justify-between'>
        {/* Asumsi Anda memiliki versi logo berwarna pink atau sesuaikan jika perlu */}
        <img src="/img/logo_title.svg" alt="Logo" className='h-12' />

        <p className='text-[var(--color-p-300)] text-center'>
          Hak Cipta © 2025 Raion Go Go
        </p>

        <div className='flex flex-col items-end text-[var(--color-p-300)]'>
          <p className='mb-2 font-medium'>Contact Us</p>
          <div className='flex flex-row gap-1 text-sm'>
            <div className='flex items-center gap-2'>
              <Phone size={22} />
            </div>
            <div className='flex items-center ml-3'>
              <Mail size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterDashboard