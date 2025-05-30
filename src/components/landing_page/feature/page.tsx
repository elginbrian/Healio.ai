import FeatureCard from '@/components/feature_card/page'
import React from 'react'

const Features = () => {
    return (
        <div className='pb-48'>
            <p className="text-6xl text-[var(--color-p-300)] font-semibold mb-12 text-center">
                Fitur Healio.ai
            </p>

            <div className='flex flex-row justify-center'>
                <FeatureCard
                    imageSrc="img/ai_white.svg"
                    title="Rekomendasi Fasilitas AI"
                    description="AI merekomendasikan puskesmas, klinik, atau rumah sakit sesuai profil, anggaran, dan preferensi Anda, dengan data tarif dan rating real-time." />
                <FeatureCard
                    imageSrc="img/pouch_white.svg"
                    title="Dana Komunal"
                    description="Buat pool dana untuk kebutuhan medis dengan dashboard real-time, analisis kontribusi AI, dan transparansi pencairan dana." />
                <FeatureCard
                    imageSrc="img/graph_white.svg"
                    title="Pelacak Pengeluaran"
                    description="Lacak pengeluaran kesehatan otomatis via OCR struk, dengan grafik bulanan dan rekomendasi AI untuk penghematan." />

            </div>
        </div>
    )
}

export default Features
