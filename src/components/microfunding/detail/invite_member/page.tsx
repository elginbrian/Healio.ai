'use client';

import React, { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';

interface JoinRequest {
    name: string;
    email: string;
    profileImage: string;
    status: 'Menunggu' | 'Diterima' | 'Ditolak';
    requestDate: string;
}

const joinRequests: JoinRequest[] = [
    {
        name: 'Johan Arizona',
        email: 'johan1234@gmail.com',
        profileImage: '/img/hospital_dummy.png',
        status: 'Menunggu',
        requestDate: '10 Jan 2025',
    },
    {
        name: 'Johan Arizona',
        email: 'johan1234@gmail.com',
        profileImage: '/img/hospital_dummy.png',
        status: 'Diterima',
        requestDate: '10 Jan 2025',
    },
    {
        name: 'Johan Arizona',
        email: 'johan1234@gmail.com',
        profileImage: '/img/hospital_dummy.png',
        status: 'Ditolak',
        requestDate: '10 Jan 2025',
    },
];

const UndangAnggotaTab = () => {
    const inviteCode = '#HELAIO2LQX';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAccept = (email: string) => {
        alert(`Menerima permintaan dari ${email}`);
    };

    const handleReject = (email: string) => {
        alert(`Menolak permintaan dari ${email}`);
    };

    return (
        <div className="p-6 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Undang Anggota Baru</h3>
            <p className="text-gray-600 mb-6">
                Bagikan kode undangan untuk mengundang anggota baru ke pool Anda:
            </p>
            <div className='flex w-full justify-between gap-16'>
                <div className="flex items-center flex-grow bg-gray-50 rounded-xl p-4 mb-6">
                    <span className="text-xl font-bold text-gray-800 flex-1 mr-4">
                        {inviteCode}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="bg-[var(--color-p-300)] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-[var(--color-p-400)] transition-colors duration-300"
                    >
                        <Copy size={20} />
                        {copied ? 'Tersalin!' : 'Salin'}
                    </button>
                </div>

                <div className="mb-8">
                    <h4 className="text-base font-semibold text-gray-700 mb-4">Bagikan melalui:</h4>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-[var(--color-w-300)] text-gray-800 border border-[var(--color-p-300)] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[var(--color-p-300)] hover:text-white transition-colors duration-300">
                            <Share2 size={16} />
                            WhatsApp
                        </button>
                        <button className="flex items-center gap-2 bg-[var(--color-w-300)] text-gray-800 border border-[var(--color-p-300)] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[var(--color-p-300)] hover:text-white transition-colors duration-300">
                            <Share2 size={16} />
                            Email
                        </button>
                        <button className="flex items-center gap-2 bg-[var(--color-w-300)] text-gray-800 border border-[var(--color-p-300)] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[var(--color-p-300)] hover:text-white transition-colors duration-300">
                            <Share2 size={16} />
                            Salin Tautan
                        </button>
                    </div>
                </div>
            </div>


            <h3 className="text-xl font-bold text-gray-900 mb-6">Permintaan Bergabung</h3>
      
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 text-sm font-medium text-gray-700 border-b">
          <div>Nama</div>
          <div>Status</div>
          <div>Tanggal Permintaan</div>
          <div>Aksi</div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {joinRequests.map((request, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 px-6 py-4 items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 mr-3">
                  <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {request.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{request.name}</div>
                  <div className="text-sm text-gray-500">{request.email}</div>
                </div>
              </div>
              
              <div>
                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full
                  ${request.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                     request.status === 'Diterima' ? 'bg-green-100 text-green-800' :
                     'bg-red-100 text-red-800'}
                `}>
                  {request.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                {request.requestDate}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(request.email)}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300
                    ${request.status === 'Menunggu' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                  `}
                  disabled={request.status !== 'Menunggu'}
                >
                  Tolak
                </button>
                <button
                  onClick={() => handleAccept(request.email)}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-300
                    ${request.status === 'Menunggu' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                  `}
                  disabled={request.status !== 'Menunggu'}
                >
                  Terima
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UndangAnggotaTab;