import BenefitItem from '@/components/benfit_item/page'
import React from 'react'

const Benefit = () => {
    return (
        <div className='flex flex-col justify-center items-center pb-48'>
            <p className="text-5xl text-[var(--color-p-300)] font-semibold mb-12 text-center">
                Fitur Healio.ai
            </p>
            <div className='flex'>
                <BenefitItem imageSrc={'img/personal_solution.svg'} title={'Solusi Personal'} description={'AI kami menyesuaikan rekomendasi dan analisis berdasarkan profil dan kebutuhan unik Anda.'} />
                <BenefitItem imageSrc={'img/eye.svg'} title={'Transparansi Tinggi'} description={'Verifikasi KTP untuk donatur dan penerima menjaga kepercayaan dalam setiap transaksi.'} />
                <BenefitItem imageSrc={'img/shield.svg'} title={'Kemanan Terjamin'} description={'Dashboard real-time dan laporan transaksi memastikan setiap dana dikelola dengan jelas dan adil.'} />
            </div>
        </div>
    )
}

export default Benefit
