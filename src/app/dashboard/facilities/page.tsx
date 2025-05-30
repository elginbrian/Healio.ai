"use client";

import SearchField from "@/components/search_field/page";
import FacilityCard from "@/components/facility_card/page";
import React from "react";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import NotifProfile from "@/components/notification_profile/page";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Facilities = () => {
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

  const scrollContainer = (containerId: string, direction: "left" | "right") => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 350;
      const scrollPosition = direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow px-6 pt-8 md:px-10 pb-20 overflow-y-auto">

        <div className="flex justify-between items-center mb-8">
          <SearchField />
          <NotifProfile profileImageSrc={"/img/hospital_dummy.png"} />
        </div>


        <div className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[var(--color-p-300)] font-semibold text-3xl">Fasilitas untuk Anda</p>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scrollContainer("facilities-for-you", "left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <ChevronLeft className="w-5 h-5 text-[var(--color-p-300)]" />
              </button>
              <button onClick={() => scrollContainer("facilities-for-you", "right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <ChevronRight className="w-5 h-5 text-[var(--color-p-300)]" />
              </button>
            </div>
          </div>


          <div className="relative">
            <div id="facilities-for-you" className="flex overflow-x-auto pb-8 hide-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
              <div className="flex gap-6 pl-0.5 pr-6">
                {facilitiesForYou.map((facility, index) => (
                  <div key={index} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]" style={{ scrollSnapAlign: "start" }}>
                    <div className="bg-white rounded-xl shadow-md h-full overflow-hidden">
                      <FacilityCard {...facility} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


        <div className="mb-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[var(--color-p-300)] font-semibold text-3xl">Fasilitas di Sekitar Anda</p>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scrollContainer("facilities-nearby", "left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <ChevronLeft className="w-5 h-5 text-[var(--color-p-300)]" />
              </button>
              <button onClick={() => scrollContainer("facilities-nearby", "right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <ChevronRight className="w-5 h-5 text-[var(--color-p-300)]" />
              </button>
            </div>
          </div>


          <div className="relative">
            <div id="facilities-nearby" className="flex overflow-x-auto pb-8 hide-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
              <div className="flex gap-6 pl-0.5 pr-6">
                {facilitiesNearby.map((facility, index) => (
                  <div key={`nearby-${index}`} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]" style={{ scrollSnapAlign: "start" }}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm h-full">
                      <FacilityCard {...facility} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="mt-auto">
        <FooterDashboard />
      </div>
    </div>
  );
};

export default Facilities;

