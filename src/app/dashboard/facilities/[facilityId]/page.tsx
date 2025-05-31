"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  Phone,
  Globe,
  Info,
  User,
  Calendar,
  DollarSign,
  Stethoscope,
  Activity,
  Heart,
  Shield,
  MessageSquare,
  Award,
  Thermometer,
  Bookmark,
  Zap,
  Clock3,
  CalendarClock,
  Users,
  Building,
  CheckCircle,
  Share2,
} from "lucide-react";
import NotifProfile from "@/components/notification_profile/page";
import FooterDashboard from "@/components/landing_page/footer/footer_dashboard/page";
import api from "@/lib/api";
import { IFacility, FacilityType } from "@/types";
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
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "doctors">("overview");

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

  // Get facility type specific content
  const getFacilitySpecificContent = () => {
    if (!facility) return null;

    const facilityType = facility.type as FacilityType;

    switch (facilityType) {
      case FacilityType.HOSPITAL:
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <Building size={20} className="text-[var(--color-p-300)] mr-2" />
              Informasi Rumah Sakit
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Jenis Rumah Sakit</p>
                <p className="text-gray-600">Rumah Sakit Umum</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Kelas</p>
                <p className="text-gray-600">Tipe B</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Jumlah Tempat Tidur</p>
                <p className="text-gray-600">{Math.floor(Math.random() * 300) + 100} Bed</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Unit Gawat Darurat</p>
                <p className="text-green-600 font-medium">24 Jam</p>
              </div>
            </div>
          </div>
        );

      case FacilityType.CLINIC:
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <Activity size={20} className="text-[var(--color-p-300)] mr-2" />
              Informasi Klinik
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Jenis Klinik</p>
                <p className="text-gray-600">Klinik Pratama</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Layanan Utama</p>
                <p className="text-gray-600">Rawat Jalan</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Praktik Dokter</p>
                <p className="text-gray-600">{Math.floor(Math.random() * 10) + 5} Dokter</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Jam Praktik</p>
                <p className="text-gray-600">08.00 - 20.00 WIB</p>
              </div>
            </div>
          </div>
        );

      case FacilityType.PUSKESMAS:
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <Users size={20} className="text-[var(--color-p-300)] mr-2" />
              Informasi Puskesmas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Jenis Puskesmas</p>
                <p className="text-gray-600">Puskesmas Non-Rawat Inap</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Wilayah Pelayanan</p>
                <p className="text-gray-600">{facility.address?.split(",")[0] || "Kecamatan Setempat"}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Program Unggulan</p>
                <p className="text-gray-600">Kesehatan Ibu & Anak</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Status BPJS</p>
                <p className="text-green-600 font-medium">Provider BPJS</p>
              </div>
            </div>
          </div>
        );

      case FacilityType.LABORATORY:
        return (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <Thermometer size={20} className="text-[var(--color-p-300)] mr-2" />
              Informasi Laboratorium
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Jenis Lab</p>
                <p className="text-gray-600">Laboratorium Klinik</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Akreditasi</p>
                <p className="text-gray-600">Terakreditasi Kemenkes</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Jenis Tes</p>
                <p className="text-gray-600">Darah, Urin, Mikrobiologi, PCR</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Waktu Hasil</p>
                <p className="text-gray-600">1-3 Hari Kerja</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Get type-specific highlight features
  const getTypeSpecificHighlights = () => {
    if (!facility) return [];

    const facilityType = facility.type as FacilityType;

    switch (facilityType) {
      case FacilityType.HOSPITAL:
        return [
          { icon: Heart, text: "Unit Gawat Darurat 24 Jam", color: "text-red-500" },
          { icon: Stethoscope, text: "Dokter Spesialis Lengkap", color: "text-blue-500" },
          { icon: Award, text: "Terakreditasi Internasional", color: "text-amber-500" },
        ];
      case FacilityType.CLINIC:
        return [
          { icon: Clock3, text: "Waktu Tunggu Minimal", color: "text-green-500" },
          { icon: CheckCircle, text: "Dokter Spesialis Terjadwal", color: "text-blue-500" },
          { icon: Shield, text: "Sistem Booking Online", color: "text-purple-500" },
        ];
      case FacilityType.PUSKESMAS:
        return [
          { icon: Users, text: "Layanan Keluarga Berencana", color: "text-blue-500" },
          { icon: Shield, text: "Provider BPJS Kesehatan", color: "text-purple-500" },
          { icon: CalendarClock, text: "Posyandu Rutin", color: "text-green-500" },
        ];
      case FacilityType.LABORATORY:
        return [
          { icon: Zap, text: "Hasil Lab Online", color: "text-amber-500" },
          { icon: Thermometer, text: "Peralatan Modern", color: "text-blue-500" },
          { icon: CheckCircle, text: "Standar Internasional", color: "text-green-500" },
        ];
      default:
        return [
          { icon: CheckCircle, text: "Fasilitas Terjamin", color: "text-green-500" },
          { icon: Clock3, text: "Pelayanan Cepat", color: "text-blue-500" },
          { icon: Shield, text: "Kualitas Terpercaya", color: "text-purple-500" },
        ];
    }
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

  const typeSpecificHighlights = getTypeSpecificHighlights();

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

        {/* Facility Header - Enhanced with pink gradient */}
        <div className="relative w-full h-56 md:h-72 lg:h-80 rounded-2xl overflow-hidden mb-6 shadow-lg">
          <img src={facility.image_url || "/img/pink2.jpg"} alt={facility.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/img/pink2.jpg")} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF5E98]/90 via-[#FF5E98]/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <div className="flex items-center mb-2">
              <div className="inline-block bg-white text-[var(--color-p-300)] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">{facility.type}</div>
              <div className={`ml-2 inline-flex items-center ${isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs font-medium px-3 py-1.5 rounded-full`}>
                <Clock size={12} className="mr-1" />
                {isOpen ? "Buka" : "Tutup"}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-sm">{facility.name}</h1>
            <div className="flex items-center text-white/95">
              <MapPin size={16} className="mr-1 flex-shrink-0" />
              <p className="text-sm md:text-base">{facility.address}</p>
            </div>
            <div className="flex items-center mt-2">
              <div className="flex mr-1">{renderStars(facility.overall_rating || 0)}</div>
              <span className="text-white text-sm">({Math.floor(Math.random() * 500) + 50} ulasan)</span>
            </div>
          </div>
        </div>

        {/* Facility Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {typeSpecificHighlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            return (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-100`}>
                  <IconComponent size={20} className={highlight.color} />
                </div>
                <span className="font-medium text-gray-800">{highlight.text}</span>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-5 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap
              ${activeTab === "overview" ? "text-[var(--color-p-300)] border-[var(--color-p-300)]" : "text-gray-500 border-transparent hover:text-gray-700"}`}
          >
            Informasi Umum
          </button>
          {facility.type === FacilityType.HOSPITAL || facility.type === FacilityType.CLINIC ? (
            <button
              onClick={() => setActiveTab("doctors")}
              className={`py-3 px-5 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap
                ${activeTab === "doctors" ? "text-[var(--color-p-300)] border-[var(--color-p-300)]" : "text-gray-500 border-transparent hover:text-gray-700"}`}
            >
              Dokter
            </button>
          ) : null}
          <button
            onClick={() => setActiveTab("services")}
            className={`py-3 px-5 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap
              ${activeTab === "services" ? "text-[var(--color-p-300)] border-[var(--color-p-300)]" : "text-gray-500 border-transparent hover:text-gray-700"}`}
          >
            Layanan
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Main Info Card */}
            <div className="col-span-2 space-y-6">
              {/* Type-specific content */}
              {getFacilitySpecificContent()}

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
                  <Info size={20} className="text-[var(--color-p-300)] mr-2" />
                  Informasi Fasilitas
                </h2>

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
            </div>

            {/* Side Info Card */}
            <div className="col-span-1 space-y-6">
              {/* Price Range Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <DollarSign size={20} className="text-[var(--color-p-300)] mr-2" />
                  Informasi Harga
                </h3>

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
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                  <MapPin size={20} className="text-[var(--color-p-300)] mr-2" />
                  Lokasi
                </h3>

                <p className="text-sm text-gray-700 mb-4">{facility.address}</p>

                <button className="w-full border border-[var(--color-p-300)] text-[var(--color-p-300)] py-2 rounded-lg font-semibold hover:bg-[var(--color-p-300)] hover:text-white transition-colors">Petunjuk Arah</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "doctors" && (facility.type === FacilityType.HOSPITAL || facility.type === FacilityType.CLINIC) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <Stethoscope size={22} className="text-[var(--color-p-300)] mr-2" />
              Dokter Praktek
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center mr-3 overflow-hidden">
                    <img
                      src={`/img/doctor-${(index % 4) + 1}.jpg`}
                      alt="Doctor"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/img/pink2.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Dr. {["Andi", "Budi", "Cindy", "Dian", "Eko", "Fira"][index]} {["Santoso", "Wijaya", "Hartono", "Susanto", "Gunawan", "Hakim"][index]}
                    </p>
                    <p className="text-xs text-[var(--color-p-300)] font-medium">{["Dokter Umum", "Spesialis Jantung", "Spesialis Anak", "Dokter Gigi", "Spesialis Bedah", "Spesialis Penyakit Dalam"][index]}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Jadwal: {["Senin-Rabu", "Selasa-Kamis", "Rabu-Jumat", "Kamis-Sabtu", "Jumat-Minggu", "Senin-Kamis"][index]}, {["08:00-12:00", "13:00-17:00", "18:00-21:00", "09:00-15:00", "16:00-20:00", "07:00-11:00"][index]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="bg-white text-[var(--color-p-300)] border border-[var(--color-p-300)] px-6 py-2 rounded-lg font-medium hover:bg-[var(--color-p-50)] transition-colors">Lihat Semua Dokter</button>
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              <CheckCircle size={22} className="text-[var(--color-p-300)] mr-2" />
              Layanan yang Ditawarkan
            </h2>

            {facility.services_offered && (Array.isArray(facility.services_offered) ? facility.services_offered.length > 0 : facility.services_offered) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.isArray(facility.services_offered) ? (
                  facility.services_offered.map((service, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-[var(--color-p-50)] transition-colors group">
                      {getServiceIcon(service)}
                      <span className="ml-3 text-gray-700 group-hover:text-[var(--color-p-500)]">{service}</span>
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
      </div>

      <FooterDashboard />
    </div>
  );
};

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
