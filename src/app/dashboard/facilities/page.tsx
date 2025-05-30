import SearchField from '@/components/search_field/page';
import FacilityCard from '@/components/facility_card/page';
import React from 'react';
import FooterDashboard from '@/components/landing_page/footer/footer_dashboard/page';
import NotifProfile from '@/components/notification_profile/page';

const Expense = () => {
  const facilitiesForYou = [
    {
      imageSrc: "/img/hospital_dummy.png",
      name: "Puskesmas Dinoyo",
      address: "Jalan Mayjend Jl. Mt Haryono 9 No.13",
      isOpen: true,
      closeTime: "Tutup pukul 15.00",
      distance: "3,7km",
      rating: 4.1,
      reviewCount: 586,
      serviceType: "Rawat Inap",
      priceRange: "Rp15.000-99.000",
    },
    {
      imageSrc: "/img/hospital_dummy.png",
      name: "Klinik Bahagia",
      address: "Jl. Damai Sejahtera No. 10",
      isOpen: true,
      closeTime: "Tutup pukul 17.00",
      distance: "1,5km",
      rating: 4.5,
      reviewCount: 320,
      serviceType: "Rawat Jalan",
      priceRange: "Rp20.000-80.000",
    },
    {
      imageSrc: "/img/hospital_dummy.png",
      name: "RSUD Kota",
      address: "Jl. Kesehatan Raya No. 1",
      isOpen: false,
      closeTime: "Buka pukul 07.00",
      distance: "5,0km",
      rating: 4.8,
      reviewCount: 1200,
      serviceType: "Gawat Darurat",
      priceRange: "Rp50.000-500.000",
    },
    {
      imageSrc: "/img/hospital_dummy.png",
      name: "Puskesmas Maju",
      address: "Jl. Industri No. 20",
      isOpen: true,
      closeTime: "Tutup pukul 16.00",
      distance: "2,1km",
      rating: 3.9,
      reviewCount: 450,
      serviceType: "Imunisasi",
      priceRange: "Gratis",
    },
    {
      imageSrc: "/img/hospital_dummy.png",
      name: "Klinik Gigi Senyum",
      address: "Jl. Dokter Gigi No. 5",
      isOpen: true,
      closeTime: "Tutup pukul 18.00",
      distance: "0,8km",
      rating: 4.7,
      reviewCount: 150,
      serviceType: "Gigi",
      priceRange: "Rp30.000-150.000",
    },
  ];

  const facilitiesNearby = [...facilitiesForYou]; 

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <div className='flex-grow px-4 pt-8 md:px-10 overflow-y-auto'> 
        <div className='flex justify-between items-center'>
          <SearchField />
          <NotifProfile profileImageSrc={'/img/hospital_dummy.png'} />
        </div>
        <div>
          <p className="text-[var(--color-p-300)] font-semibold text-3xl mt-8">
            Fasilitas untuk Anda
          </p>
          <div className="mt-6 -mx-4 md:-mx-10">
            <div className="overflow-x-auto pb-4 px-4 md:px-10 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-black/10 [&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-[var(--color-p-300)] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-[var(--color-p-400)] scrollbar-thin scrollbar-thumb-[var(--color-p-300)] scrollbar-track-black/10">
              <div className="flex gap-6 w-max">
                {facilitiesForYou.map((facility, index) => (
                  <div key={index} className="flex-shrink-0">
                    <FacilityCard {...facility} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <p className="text-[var(--color-p-300)] font-semibold text-3xl mt-8">
            Fasilitas di Sekitar Anda
          </p>
          <div className="mt-6 -mx-4 md:-mx-10">
            <div className="overflow-x-auto pb-4 px-4 md:px-10 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-black/10 [&::-webkit-scrollbar-track]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-[var(--color-p-300)] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb:hover]:bg-[var(--color-p-400)] scrollbar-thin scrollbar-thumb-[var(--color-p-300)] scrollbar-track-black/10">
              <div className="flex gap-6 w-max">
                {facilitiesNearby.map((facility, index) => (
                  <div key={`nearby-${index}`} className="flex-shrink-0">
                    <FacilityCard {...facility} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FooterDashboard />
    </div>
  );
};

export default Expense;