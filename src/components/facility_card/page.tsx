"use client";

import React from "react";
import { Star, MapPin, Clock } from "lucide-react";

interface FacilityCardProps {
  imageSrc: string;
  name: string;
  address: string;
  isOpen: boolean;
  closeTime?: string;
  distance: string;
  rating: number;
  reviewCount: number;
  serviceType: string;
  priceRange: string;
}

const FacilityCard = ({ imageSrc, name, address, isOpen, closeTime, distance, rating, reviewCount, serviceType, priceRange }: FacilityCardProps) => {
  const renderStars = (currentRating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} size={12} fill={currentRating >= i ? "#FFD700" : "#d1d5db"} stroke={currentRating >= i ? "#FFD700" : "#d1d5db"} />);
    }
    return stars;
  };

  return (
    <div className="rounded-xl overflow-hidden flex flex-col h-full w-full bg-white">
      <div className="relative w-full h-36 md:h-40">
        <img src={imageSrc} className="w-full h-full object-cover" alt={name} onError={(e) => (e.currentTarget.src = "/img/hospital_dummy.png")} />
        <div className="absolute top-2 left-2 bg-white/90 text-xs py-0.5 px-1.5 rounded-full flex items-center shadow">
          <span className="text-green-700 font-semibold">{priceRange}</span>
        </div>
        <div className="absolute top-2 right-2 bg-[var(--color-p-300)] text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-full shadow">{serviceType}</div>
      </div>

      <div className="p-2.5 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1 mb-1 min-w-0">{name}</h3>

        <div className="flex items-start gap-1 mb-1 min-w-0">
          <MapPin size={12} className="text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600 line-clamp-2 leading-tight min-w-0">{address}</p>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-1.5">
          <span>{distance}</span>
        </div>



        <div className="mt-auto flex justify-between items-center text-xs space-x-2">
          {" "}



          <div className="flex items-center font-medium overflow-hidden min-w-0 flex-shrink">
            {" "}

            <Clock size={12} className="mr-1 flex-shrink-0" />
            <span className={`flex-shrink-0 ${isOpen ? "text-green-600" : "text-red-500"}`}>{isOpen ? "Buka" : "Tutup"}</span>
            {closeTime && <span className="ml-1 text-gray-500 truncate whitespace-nowrap min-w-0">• {closeTime}</span>}
          </div>


          <div className="flex items-center flex-shrink-0">
            <span className="text-gray-900 font-semibold mr-0.5">{rating % 1 === 0 ? rating.toString() : rating.toFixed(1)}</span>
            <div className="flex mr-0.5">{renderStars(rating)}</div>
            <span className="text-gray-500">({reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;

