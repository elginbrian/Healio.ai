'use client'

import NotifProfile from '@/components/notification_profile/page'
import React, { useState } from 'react'

const Payment = () => {
    const [selectedPayment, setSelectedPayment] = useState('BCA Virtual Account')
    const [paymentPeriod, setPaymentPeriod] = useState('Juni, 2025')

    const paymentMethods = [
        { id: 'dana', name: 'DANA', logo: '💳' },
        { id: 'ovo', name: 'OVO', logo: '🟡' },
        { id: 'gopay', name: 'Gopay', logo: '🟢' },
        { id: 'shopee', name: 'ShopeePay / Spaylater', logo: '🟠' },
        { id: 'bca', name: 'BCA Virtual Account', logo: '🏦' },
        { id: 'mandiri', name: 'Mandiri Virtual Account', logo: '🏛️' },
        { id: 'credit', name: 'Credit Card / Debit Online', logo: '💳' }
    ]

    const paymentHistory = [
        {
            id: 1,
            title: 'Kontribusi Bulanan',
            date: '15 Juni 2023',
            method: 'Bank BCA',
            amount: 'Rp200.000'
        },
        {
            id: 2,
            title: 'Kontribusi Bulanan',
            date: '15 Mei 2023',
            method: 'Bank BCA',
            amount: 'Rp200.000'
        },
        {
            id: 3,
            title: 'Kontribusi Bulanan',
            date: '15 April 2023',
            method: 'Gopay',
            amount: 'Rp200.000'
        },
        {
            id: 4,
            title: 'Kontribusi Bulanan',
            date: '15 Maret 2023',
            method: 'OVO',
            amount: 'Rp200.000'
        }
    ]

    return (
        <div className='p-8'>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-[#E91E63]">
                    Pembayaran Kontribusi Pool
                </h1>
                <NotifProfile profileImageSrc="/img/hospital_dummy.png" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>

                <h2 className="text-xl font-semibold text-[#E91E63] mb-6">Detail Pembayaran</h2>
                <div className=" rounded-xl shadow-md p-6">

                    {/* Periode Pembayaran */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Periode Pembayaran
                        </label>
                        <select
                            value={paymentPeriod}
                            onChange={(e) => setPaymentPeriod(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E91E63] focus:border-transparent"
                        >
                            <option value="Juni, 2025">Juni, 2025</option>
                            <option value="Juli, 2025">Juli, 2025</option>
                            <option value="Agustus, 2025">Agustus, 2025</option>
                        </select>
                    </div>

                    {/* Jumlah Pembayaran */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Kontribusi Bulanan Pool</span>
                            <span className="text-lg font-semibold">Rp200.000</span>
                        </div>
                    </div>

                    {/* Metode Pembayaran */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Jumlah Pembayaran
                        </label>
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <label key={method.id} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"> {/* Changed border to border-gray-300 */}
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={method.name}
                                        checked={selectedPayment === method.name}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="w-4 h-4 text-[#E91E63] border-gray-300 focus:ring-[#E91E63]"
                                    />
                                    <span className="ml-3 text-2xl">{method.logo}</span>
                                    <span className="ml-3 text-gray-900">{method.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tombol Bayar */}
                    <button className="w-full bg-[#E91E63] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#C2185B] transition-colors">
                        Bayar Sekarang
                    </button>
                </div>
                </div>

                {/* Ringkasan Pembayaran & Riwayat */}
                <div className="space-y-6">
                    {/* Ringkasan Pembayaran */}
                    <h2 className="text-xl font-semibold text-[#E91E63] mb-6">Ringkasan Pembayaran</h2>
                    <div className="rounded-xl shadow-md p-6">

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pool</span>
                                <span className="font-medium">Keluarga Sehat</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Periode</span>
                                <span className="font-medium">Juli 2023</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Jenis</span>
                                <span className="font-medium">Kontribusi Bulanan</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Jumlah</span>
                                <span className="font-medium">Rp200.000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Biaya Admin</span>
                                <span className="font-medium">Rp1500</span>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total Pembayaran</span>
                                <span className="text-[#E91E63]">Rp201.500</span>
                            </div>
                        </div>
                    </div>

                    {/* Riwayat Pembayaran */}
                    <h2 className="text-xl font-semibold text-[#E91E63] mb-6">Riwayat Pembayaran</h2>
                    <div className="rounded-xl shadow-md p-6">

                        <div className="space-y-4">
                            {paymentHistory.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-[#E91E63] rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm">💳</span>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-medium">{payment.title}</h3>
                                            <p className="text-sm text-gray-600">{payment.date} • {payment.method}</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-[#E91E63]">{payment.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment