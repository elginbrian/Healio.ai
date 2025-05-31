"use client";

import React, { useState, useEffect, useCallback } from "react";
import SearchField from "@/components/search_field/page";
import FacilityCard from "@/components/facility_card/page";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import NotifProfile from "@/components/notification_profile/page";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import api from "@/lib/api";
import { IFacility, FacilityType } from "@/types";
import toast from "react-hot-toast";

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface FacilityCardDisplayProps {
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

const Facilities = () => {
  const { user, loading: authLoading } = useAuth();
  const [facilitiesForYou, setFacilitiesForYou] = useState<IFacility[]>([]);
  const [nearbyFacilities, setNearbyFacilities] = useState<IFacility[]>([]);
  const [searchResults, setSearchResults] = useState<IFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNearby, setIsLoadingNearby] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyError, setNearbyError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationDetails, setLocationDetails] = useState<string>("lokasi Anda saat ini");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(coords);
          setError(null);

          fetchLocationDetails(coords.latitude, coords.longitude);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Tidak dapat mengambil lokasi Anda. Pastikan izin lokasi diberikan dan coba lagi. Rekomendasi mungkin kurang akurat.");
          toast.error("Gagal mendapatkan lokasi. Periksa izin lokasi Anda.");
          setIsLoading(false);
        },
        { timeout: 10000 }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
      toast.error("Browser tidak mendukung geolocation.");
      setIsLoading(false);
    }
  }, []);

  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
      const data = await response.json();

      if (data && data.address) {
        const district = data.address.suburb || data.address.district || data.address.neighbourhood || "";
        const city = data.address.city || data.address.town || data.address.village || "";
        const state = data.address.state || "";

        let locationText = "";

        if (district) locationText += district;
        if (city && city !== district) locationText += (locationText ? ", " : "") + city;
        if (state && state !== city) locationText += (locationText ? ", " : "") + state;

        if (locationText) {
          setLocationDetails(locationText);
        }
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const fetchFacilities = useCallback(async () => {
    if (!userLocation || !user) {
      if (!authLoading && !user) {
        setError("Pengguna tidak terautentikasi. Silakan login kembali.");
        setIsLoading(false);
      }
      if (user && !userLocation && !error) {
        setIsLoading(true);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const preferences = {
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        maxDistanceKm: user.max_distance_km || 20,
        maxBudget: user.max_budget || 500000,
        facilityType: [],
        doctorSpecialization: "",
      };

      const response = await api.post<{ data: IFacility[]; source: string }>("/api/facility", { preferences });

      console.log("Received facilities:", response.data);

      const processedFacilities = (response.data.data || []).map((facility, index) => ({
        ...facility,
        _id: facility._id || `temp-id-${index}`,
        services_offered: Array.isArray(facility.services_offered) ? facility.services_offered : typeof facility.services_offered === "string" ? facility.services_offered.split(", ") : [],
      }));

      console.log("Processed facilities:", processedFacilities);
      setFacilitiesForYou(processedFacilities);

      if (!processedFacilities.length) {
        toast.success("Pencarian selesai, namun tidak ada fasilitas yang cocok saat ini.");
      } else {
        toast.success(`Menampilkan ${processedFacilities.length} fasilitas (AI Gemini)`);
      }
    } catch (err: any) {
      console.error("Error fetching facilities:", err);
      const errorMessage = err.response?.data?.message || "Gagal mengambil data fasilitas.";
      setError(errorMessage);
      toast.error(errorMessage);
      setFacilitiesForYou([]);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, user, authLoading, error]);

  const fetchNearbyFacilities = useCallback(async () => {
    if (!userLocation) {
      return;
    }

    setIsLoadingNearby(true);
    setNearbyError(null);

    try {
      const nearbyPreferences = {
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        maxDistanceKm: 20,
        maxBudget: 1000000,
        facilityType: [],
        doctorSpecialization: "",
        nearbyOnly: true,
      };

      const response = await api.post<{ data: IFacility[]; source: string }>("/api/facility/nearby", { preferences: nearbyPreferences });

      setNearbyFacilities(response.data.data || []);
      if (!response.data.data || response.data.data.length === 0) {
        console.log("No nearby facilities found");
      } else {
        console.log(`Found ${response.data.data.length} nearby facilities (location-based)`);
      }
    } catch (err: any) {
      console.error("Error fetching nearby facilities:", err);
      const errorMessage = err.response?.data?.message || "Gagal mengambil data fasilitas di sekitar.";
      setNearbyError(errorMessage);
      setNearbyFacilities([]);
    } finally {
      setIsLoadingNearby(false);
    }
  }, [userLocation]);

  useEffect(() => {
    if (!authLoading) {
      fetchFacilities();
    }
  }, [fetchFacilities, authLoading]);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyFacilities();
    }
  }, [fetchNearbyFacilities, userLocation]);

  const mapFacilityToDisplayProps = (facility: IFacility): FacilityCardDisplayProps & { facilityId: string } => {
    console.log("Mapping facility to display:", facility);

    const reviewCount = facility.overall_rating ? Math.floor(Math.random() * 500) + 50 : 0;
    const isOpen = Math.random() > 0.3;

    let distance = "N/A";
    if (facility.distanceText) {
      distance = facility.distanceText;
    } else if (facility.distanceKm) {
      distance = `${facility.distanceKm} km`;
    } else if (userLocation) {
      if (facility.location?.coordinates && facility.location.coordinates.length === 2) {
        const facilityLon = facility.location.coordinates[0];
        const facilityLat = facility.location.coordinates[1];

        const distanceKm = calculateDistance(userLocation.latitude, userLocation.longitude, facilityLat, facilityLon);
        distance = `${distanceKm.toFixed(1)} km`;
      } else if (facility.latitude && facility.longitude) {
        const distanceKm = calculateDistance(userLocation.latitude, userLocation.longitude, facility.latitude, facility.longitude);
        distance = `${distanceKm.toFixed(1)} km`;
      }
    }

    let serviceTypeDisplay = "Lainnya";
    if (typeof facility.type === "string") {
      serviceTypeDisplay = facility.type;
    } else if (facility.type) {
      serviceTypeDisplay = String(facility.type);
    }

    let priceRange = "N/A";
    if (facility.tariff_min && facility.tariff_max) {
      priceRange = `Rp${facility.tariff_min.toLocaleString()}-Rp${facility.tariff_max.toLocaleString()}`;
    } else if (facility.tariff_max) {
      priceRange = `Hingga Rp${facility.tariff_max.toLocaleString()}`;
    }

    return {
      imageSrc: facility.image_url || "/img/pink2.jpg",
      name: facility.name,
      address: facility.address,
      isOpen: isOpen,
      closeTime: isOpen ? `Tutup pukul ${Math.floor(Math.random() * 5) + 17}.00` : `Buka pukul 0${Math.floor(Math.random() * 2) + 7}.00`,
      distance: distance,
      rating: facility.overall_rating || 0,
      reviewCount: reviewCount,
      serviceType: serviceTypeDisplay,
      priceRange: priceRange,
      facilityId: facility._id?.toString() || `facility-${Math.random().toString(36).substring(2, 11)}`,
    };
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const lat1Rad = lat1 * (Math.PI / 180);
    const lat2Rad = lat2 * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

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

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery("");
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setSearchError(null);
    setSearchQuery(query);

    try {
      if (!userLocation) {
        throw new Error("Lokasi Anda diperlukan untuk melakukan pencarian");
      }

      const searchData = {
        query: query,
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        maxDistanceKm: user?.max_distance_km || 20,
        maxBudget: user?.max_budget || 500000,
      };

      const response = await api.post<{ data: IFacility[]; source: string }>("/api/facility/search", searchData);

      const processedResults = (response.data.data || []).map((facility, index) => ({
        ...facility,
        _id: facility._id || `search-result-${index}`,
        services_offered: Array.isArray(facility.services_offered) ? facility.services_offered : typeof facility.services_offered === "string" ? facility.services_offered.split(", ") : [],
      }));

      setSearchResults(processedResults);

      if (!processedResults.length) {
        toast(`Tidak ada hasil untuk pencarian "${query}"`);
      } else {
        toast.success(`Ditemukan ${processedResults.length} fasilitas untuk pencarian "${query}"`);
      }
    } catch (err: any) {
      console.error("Error searching facilities:", err);
      const errorMessage = err.response?.data?.message || err.message || "Gagal melakukan pencarian fasilitas";
      setSearchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow px-6 pt-8 md:px-10 pb-20 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <SearchField onSearch={handleSearch} />

          <NotifProfile profileImageSrc={(user as any)?.picture || "/img/pink2.jpg"} />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
            <AlertTriangle size={24} className="mr-3 flex-shrink-0" />
            <div>
              <p className="font-bold">Terjadi Kesalahan</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {searchQuery && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[var(--color-p-300)] font-semibold text-3xl">Hasil Pencarian</p>
                <p className="text-sm text-gray-600">Hasil untuk "{searchQuery}"</p>
              </div>
            </div>

            {isSearching ? (
              <div className="flex justify-center items-center h-60">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-p-300)]"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {searchResults.map((facility, index) => (
                  <div key={`search-${facility._id || index}`} className="w-full">
                    <FacilityCard {...mapFacilityToDisplayProps(facility)} />
                  </div>
                ))}
              </div>
            ) : (
              !searchError && <p className="text-gray-600 text-center py-10">Tidak ada fasilitas yang ditemukan untuk pencarian "{searchQuery}"</p>
            )}

            {searchError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md mb-6">
                <p>{searchError}</p>
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[var(--color-p-300)] font-semibold text-3xl">Fasilitas untuk Anda</p>
                  <p className="text-sm text-gray-600">Rekomendasi AI berdasarkan profil dan preferensi Anda</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={() => scrollContainer("facilities-for-you", "left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-[var(--color-p-300)]" />
                  </button>
                  <button onClick={() => scrollContainer("facilities-for-you", "right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <ChevronRight className="w-5 h-5 text-[var(--color-p-300)]" />
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-p-300)]"></div>
                </div>
              ) : facilitiesForYou && facilitiesForYou.length > 0 ? (
                <div className="relative">
                  <div id="facilities-for-you" className="flex overflow-x-auto pb-8 hide-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
                    <div className="flex gap-6 pl-0.5 pr-6">
                      {facilitiesForYou.map((facility, index) => (
                        <div key={facility._id || `facility-${index}`} className="flex-shrink-0 w-auto" style={{ scrollSnapAlign: "start" }}>
                          <FacilityCard {...mapFacilityToDisplayProps(facility)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                !error && <p className="text-gray-600 text-center py-10">Tidak ada fasilitas yang cocok dengan preferensi Anda saat ini.</p>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[var(--color-p-300)] font-semibold text-3xl">Fasilitas di Sekitar</p>
                  <p className="text-sm text-gray-600">Berdasarkan jarak dari {locationDetails}</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <button onClick={() => scrollContainer("facilities-nearby", "left")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <ChevronLeft className="w-5 h-5 text-[var(--color-p-300)]" />
                  </button>
                  <button onClick={() => scrollContainer("facilities-nearby", "right")} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <ChevronRight className="w-5 h-5 text-[var(--color-p-300)]" />
                  </button>
                </div>
              </div>

              {isLoadingNearby ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-p-300)]"></div>
                </div>
              ) : nearbyFacilities.length > 0 ? (
                <div className="relative">
                  <div id="facilities-nearby" className="flex overflow-x-auto pb-8 hide-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
                    <div className="flex gap-6 pl-0.5 pr-6">
                      {nearbyFacilities.map((facility, index) => (
                        <div key={`nearby-${facility._id}-${index}`} className="flex-shrink-0 w-auto" style={{ scrollSnapAlign: "start" }}>
                          <FacilityCard {...mapFacilityToDisplayProps(facility)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                !nearbyError && <p className="text-gray-600 text-center py-10">Tidak ada fasilitas di sekitar yang ditemukan.</p>
              )}

              {nearbyError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  <p>{nearbyError}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-auto">
        <FooterDashboard />
      </div>
    </div>
  );
};

export default Facilities;
