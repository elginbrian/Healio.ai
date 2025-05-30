"use client";
import React, { useState } from "react";
import TestimonyCard from "@/components/testimony_card/page";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonies = [
  {
    quote:
      "Platform microfunding Healio.ai memungkinkan komunitas kami menggalang dana untuk operasi tetangga dengan sangat efisien. Dashboard real-time dan laporan transparansi membuat semua anggota merasa percaya diri dengan pengelolaan dana.",
    authorName: "Djoko Pramono",
    authorTitle: "Ketua RT",
    imageSrc: "img/profile_1.svg",
  },
  {
    quote: "Saya sangat terbantu dengan rekomendasi rumah sakit dari Healio.ai. Prosesnya cepat dan akurat sesuai kondisi saya.",
    authorName: "Siti Rahma",
    authorTitle: "Ibu Rumah Tangga",
    imageSrc: "img/profile_2.svg",
  },
  {
    quote: "Integrasi antara sistem JKN dan data Google benar-benar inovatif. Menjadikan pencarian layanan kesehatan lebih efisien.",
    authorName: "Budi Santoso",
    authorTitle: "Pekerja Swasta",
    imageSrc: "img/profile_3.svg",
  },
];

const Testimony = () => {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const handlePrev = () => {
    setTransitioning(true);
    setTimeout(() => {
      setIndex((prev) => (prev === 0 ? testimonies.length - 1 : prev - 1));
      setTransitioning(false);
    }, 300);
  };

  const handleNext = () => {
    setTransitioning(true);
    setTimeout(() => {
      setIndex((prev) => (prev === testimonies.length - 1 ? 0 : prev + 1));
      setTransitioning(false);
    }, 300);
  };

  return (
    <div className="w-full pb-48 px-4 md:px-72">
      <p className="text-5xl text-[var(--color-p-300)] font-semibold mb-12 text-center">Apa Kata Mereka</p>


      <div className={`transition-opacity duration-300 ease-in-out ${transitioning ? "opacity-0" : "opacity-100"}`}>
        <TestimonyCard quote={testimonies[index].quote} authorName={testimonies[index].authorName} authorTitle={testimonies[index].authorTitle} imageSrc={testimonies[index].imageSrc} />
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button onClick={handlePrev} className="p-3 bg-[var(--color-p-300)] rounded-full hover:bg-[var(--color-p-400)] transition">
          <ArrowLeft size={24} color="white" />
        </button>
        <button onClick={handleNext} className="p-3 bg-[var(--color-p-300)] rounded-full hover:bg-[var(--color-p-400)] transition">
          <ArrowRight size={24} color="white" />
        </button>
      </div>
    </div>
  );
};

export default Testimony;

