import FooterDashboard from '@/components/landing_page/footer/footer_dashboard/page';
import PoolTabs from '@/components/microfunding/detail/pool_tabs/page';
import NotifProfile from '@/components/notification_profile/page';
import React from 'react'; // Import the PoolTabs component

const MicrofundingDetail = () => {
    return (
        <div className='h-full flex flex-col justify-between'>
            <div className="p-8 w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold text-[var(--color-p-300)]">
                        Dana Komunal
                    </h1>
                    <NotifProfile profileImageSrc="/img/hospital_dummy.png" />
                </div>

                <div className="flex flex-col w-full">
                    <div className="flex flex-row gap-8 mb-8"> 
                        <div className="w-1/2 h-80 shadow-md rounded-3xl p-8 bg-white flex flex-col">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold text-[var(--color-p-300)]">
                                        Keluarga Sehat
                                    </h2>
                                    <span className="text-green-500 font-medium">Aktif</span>
                                </div>
                                <p className="text-gray-600 mb-8">
                                    Pool kesehatan untuk keluarga dan kerabat dekat dengan perlindungan maksimal.
                                </p>
                            </div>

                            <div className="flex justify-evenly h-full items-center">
                                <div className='flex flex-col items-center'>
                                    <p className="text-black font-bold text-sm mb-4">ANGGOTA</p>
                                    <p className="text-3xl font-bold text-[var(--color-p-300)]">12</p>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <p className="text-black font-bold text-sm mb-4">DANA TERKUMPUL</p>
                                    <p className="text-3xl font-bold text-[var(--color-p-300)]">Rp 8.400.000</p>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <p className="text-black font-bold text-sm mb-4">KLAIM DISETUJUI</p>
                                    <p className="text-3xl font-bold text-[var(--color-p-300)]">4</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-1/2 h-80 shadow-md rounded-3xl p-8 bg-white">
                            <h2 className="text-2xl font-semibold text-[var(--color-p-300)] mb-4">
                                Kontribusi Bulanan Saya
                            </h2>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-600">Status</p>
                                <p className="text-green-500 font-medium">Lunas</p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-600">Jumlah</p>
                                <p className="text-lg font-bold text-[var(--color-p-300)]">Rp 200.000</p>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-gray-600">Total Kontribusi</p>
                                <p className="text-lg font-bold text-[var(--color-p-300)]">Rp 1.200.000</p>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-gray-600">Jatuh Tempo Berikutnya</p>
                                <p className="text-lg font-bold text-[var(--color-p-300)]">17 Juli 2025</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 py-3 px-6 rounded-full bg-[var(--color-p-300)] text-white font-semibold hover:bg-[var(--color-p-400)] transition-colors duration-300">
                                    Bayar Kontribusi
                                </button>
                                <button className="flex-1 py-3 px-6 rounded-full bg-[var(--color-p-300)] text-white font-semibold hover:bg-[var(--color-p-400)] transition-colors duration-300">
                                    Ajukan Klaim
                                </button>
                            </div>
                        </div>
                    </div>

                    <PoolTabs />

                </div>
            </div>
            <FooterDashboard />
        </div>
    );
};

export default MicrofundingDetail;