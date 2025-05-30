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
      stars.push(<Star key={i} size={14} fill={currentRating >= i ? "#FFD700" : "#d1d5db"} stroke={currentRating >= i ? "#FFD700" : "#d1d5db"} />);
    }
    return stars;
  };

  return (
    <div className="rounded-xl overflow-hidden flex flex-col h-full w-full">

      <div className="relative w-full h-40">
        <img src={imageSrc} className="w-full h-full object-cover" alt={name} />


        <div className="absolute top-3 left-3 bg-white/90 text-sm py-0.5 px-2 rounded-full flex items-center">
          <span className="text-green-600 font-medium">{priceRange}</span>
        </div>


        <div className="absolute top-3 right-3 bg-[var(--color-p-300)] text-white text-xs font-medium px-2 py-1 rounded-full">{serviceType}</div>
      </div>


      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-1">{name}</h3>

        <div className="flex items-start gap-1 mb-1.5">
          <MapPin size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600 line-clamp-2">{address}</p>
        </div>

        <div className="flex items-center text-xs text-gray-600 mb-2">
          <span className="text-gray-500">{distance}</span>
        </div>

        <div className="mt-auto flex justify-between items-center">

          <div className="flex items-center text-xs font-medium max-w-[60%] overflow-hidden">
            <Clock size={12} className="mr-1 flex-shrink-0" />
            <span className={`flex-shrink-0 ${isOpen ? "text-green-600" : "text-red-600"}`}>{isOpen ? "Buka" : "Tutup"}</span>
            {closeTime && <span className="ml-1 text-gray-600 truncate whitespace-nowrap">• {closeTime}</span>}
          </div>


          <div className="flex items-center flex-shrink-0">
            <span className="text-gray-900 font-semibold text-xs mr-1">{rating.toFixed(1)}</span>
            <div className="flex mr-1">{renderStars(rating)}</div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;

