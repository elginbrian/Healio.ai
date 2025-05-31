"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Clock, Star, Phone, Globe, Info, User, Calendar, DollarSign, Stethoscope, Activity, Heart, Shield, MessageSquare } from "lucide-react";
import NotifProfile from "@/components/notification_profile/page";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import api from "@/lib/api";
import { IFacility } from "@/types";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";

const FacilityDetail = () => {
  const params = useParams();
  const router = useRouter();
  const facilityId = params?.facilityId as string;
  const { user } = useAuth();

  const [facility, setFacility] = useState<IFacility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [closeTime, setCloseTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "reviews">("overview");

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      if (!facilityId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/facility/${facilityId}`);
        if (response.data.success) {
          setFacility(response.data.facility);

          // Simulate open/close status
          const randomIsOpen = Math.random() > 0.3;
          setIsOpen(randomIsOpen);
          setCloseTime(randomIsOpen ? `Tutup pukul ${Math.floor(Math.random() * 5) + 17}.00` : `Buka pukul 0${Math.floor(Math.random() * 2) + 7}.00`);
        } else {
          setError(response.data.message || "Gagal memuat detail fasilitas");
          toast.error(response.data.message || "Gagal memuat detail fasilitas");
        }
      } catch (err: any) {
        console.error("Error fetching facility details:", err);
        setError(err.response?.data?.message || "Terjadi kesalahan");
        toast.error(err.response?.data?.message || "Terjadi kesalahan saat memuat detail");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [facilityId]);

  const goBack = () => {
    router.back();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} size={16} fill={rating >= i ? "#FFD700" : "#d1d5db"} stroke={rating >= i ? "#FFD700" : "#d1d5db"} />);
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="flex-grow px-6 pt-8 md:px-10 pb-20">
          <div className="flex justify-between items-center mb-8">
            <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
              <ArrowLeft size={20} className="mr-2" />
              <span>Kembali</span>
            </button>
            <NotifProfile profileImageSrc={(user as any)?.picture || "/img/pink2.jpg"} />
          </div>
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-p-300)]"></div>
          </div>
        </div>
        <FooterDashboard />
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="flex-grow px-6 pt-8 md:px-10 pb-20">
          <div className="flex justify-between items-center mb-8">
            <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
              <ArrowLeft size={20} className="mr-2" />
              <span>Kembali</span>
            </button>
            <NotifProfile profileImageSrc={(user as any)?.picture || "/img/pink2.jpg"} />
          </div>
          <div className="flex flex-col justify-center items-center h-[60vh]">
            <Info size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
            <p className="text-gray-600">{error || "Fasilitas tidak ditemukan"}</p>
            <button onClick={goBack} className="mt-4 px-4 py-2 bg-[var(--color-p-300)] text-white rounded-lg hover:bg-[var(--color-p-400)] transition-colors">
              Kembali ke Daftar Fasilitas
            </button>
          </div>
        </div>
        <FooterDashboard />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex-grow px-6 pt-8 md:px-10 pb-20">
        <div className="flex justify-between items-center mb-8">
          <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
            <ArrowLeft size={20} className="mr-2" />
            <span>Kembali</span>
          </button>
          <NotifProfile profileImageSrc={(user as any)?.picture || "/img/pink2.jpg"} />
        </div>

        {/* Facility Header */}
        <div className="relative w-full h-48 md:h-64 lg:h-72 rounded-2xl overflow-hidden mb-6 shadow-md">
          <img src={facility.image_url || "/img/pink2.jpg"} alt={facility.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/img/pink2.jpg")} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <div className="inline-block bg-[var(--color-p-300)] text-white text-xs font-medium px-2 py-1 rounded-full mb-2 shadow-sm">{facility.type}</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{facility.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin size={16} className="mr-1 flex-shrink-0" />
              <p className="text-sm">{facility.address}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-5 font-semibold text-sm border-b-2 transition-colors ${activeTab === "overview" ? "text-[var(--color-p-300)] border-[var(--color-p-300)]" : "text-gray-500 border-transparent hover:text-gray-700"}`}
          >
            Informasi Umum
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`py-3 px-5 font-semibold text-sm border-b-2 transition-colors ${activeTab === "services" ? "text-[var(--color-p-300)] border-[var(--color-p-300)]" : "text-gray-500 border-transparent hover:text-gray-700"}`}
          >
            Layanan
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-3 px-5 font-semibold text-sm border-b-2 transition-colors ${activeTab === "reviews" ? "text-[var(--color-p-300)] border-[var(--color-p-300)]" : "text-gray-500 border-transparent hover:text-gray-700"}`}
          >
            Ulasan
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Main Info Card */}
            <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">Informasi Fasilitas</h2>

              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                    <Star size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold mr-2">{facility.overall_rating?.toFixed(1) || "N/A"}</span>
                      <div className="flex">{renderStars(facility.overall_rating || 0)}</div>
                      <span className="ml-2 text-sm text-gray-500">({Math.floor(Math.random() * 500) + 50} ulasan)</span>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Clock size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-semibold ${isOpen ? "text-green-600" : "text-red-500"}`}>
                      {isOpen ? "Buka" : "Tutup"}
                      {closeTime && <span className="text-gray-500 font-normal ml-2">{closeTime}</span>}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                {facility.phone && (
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Phone size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kontak</p>
                      <p className="font-semibold">{facility.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Side Info Card */}
            <div className="col-span-1 space-y-6">
              {/* Price Range Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Informasi Harga</h3>

                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <DollarSign size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rentang Harga</p>
                    <p className="font-semibold">
                      {facility.tariff_min && facility.tariff_max
                        ? `Rp${facility.tariff_min.toLocaleString()}-Rp${facility.tariff_max.toLocaleString()}`
                        : facility.tariff_max
                        ? `Hingga Rp${facility.tariff_max.toLocaleString()}`
                        : "Tidak tersedia"}
                    </p>
                  </div>
                </div>

                <button className="w-full bg-[var(--color-p-300)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--color-p-400)] transition-colors shadow-sm">Reservasi Sekarang</button>
              </div>

              {/* Location Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Lokasi</h3>

                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  {facility.location?.coordinates ? (
                    <iframe
                      title="Facility Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBHrAJL4jPxwxpDRVDJk4kUCzLgBGMSTSo&q=${facility.location.coordinates[1]},${facility.location.coordinates[0]}`}
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <MapPin size={24} className="text-gray-400" />
                      <span className="ml-2 text-gray-500">Peta Tidak Tersedia</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-4">
                  <MapPin size={16} className="inline mr-1" />
                  {facility.address}
                </p>

                <button className="w-full border border-[var(--color-p-300)] text-[var(--color-p-300)] py-2 rounded-lg font-semibold hover:bg-[var(--color-p-300)] hover:text-white transition-colors">Petunjuk Arah</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Layanan yang Ditawarkan</h2>

            {facility.services_offered && (Array.isArray(facility.services_offered) ? facility.services_offered.length > 0 : facility.services_offered) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(facility.services_offered) ? (
                  facility.services_offered.map((service, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      {getServiceIcon(service)}
                      <span className="ml-3 text-gray-700">{service}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    {getServiceIcon(facility.services_offered as string)}
                    <span className="ml-3 text-gray-700">{facility.services_offered}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">Tidak ada informasi layanan tersedia untuk fasilitas ini.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Ulasan Pengguna</h2>

            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <MessageSquare size={48} className="mb-3 text-gray-300" />
              <p>Belum ada ulasan untuk fasilitas ini</p>
              <button className="mt-4 px-4 py-2 bg-[var(--color-p-300)] text-white rounded-lg hover:bg-[var(--color-p-400)] transition-colors">Tulis Ulasan</button>
            </div>
          </div>
        )}

        {/* Similar Facilities */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Fasilitas Serupa di Sekitar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="h-32 mb-3 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-5 mb-2 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 mb-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterDashboard />
    </div>
  );
};

// Helper function to get an icon for each service type
function getServiceIcon(service: string) {
  const serviceType = service.toLowerCase();

  if (serviceType.includes("dokter") || serviceType.includes("konsultasi") || serviceType.includes("pemeriksaan")) {
    return <Stethoscope size={20} className="text-blue-500" />;
  } else if (serviceType.includes("obat") || serviceType.includes("farmasi") || serviceType.includes("apotek")) {
    return <Activity size={20} className="text-green-500" />;
  } else if (serviceType.includes("darurat") || serviceType.includes("emergency") || serviceType.includes("icu")) {
    return <Heart size={20} className="text-red-500" />;
  } else if (serviceType.includes("asuransi") || serviceType.includes("bpjs")) {
    return <Shield size={20} className="text-purple-500" />;
  } else {
    return <Stethoscope size={20} className="text-[var(--color-p-300)]" />;
  }
}

export default FacilityDetail;
