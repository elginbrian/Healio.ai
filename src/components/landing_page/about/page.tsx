import React from "react";

const About = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full items-center justify-center relative">
      <div className="w-full lg:w-5/12 flex items-center justify-center p-8 relative">
        {/* Gambar Dokter */}
        <img src="/img/doctor.svg" alt="Doctor" className="max-w-sm lg:max-w-md z-10 transition-transform duration-300 hover:scale-110" />

        {/* Tag hanya berupa ikon */}
        <img
          src="/img/tag_community.svg"
          alt="Komunitas Icon"
          className="h-10 absolute z-20 transition-transform duration-300 hover:scale-120"
          style={{ top: '10%', right: '15%' }}
        />
        <img
          src="/img/tag_personalize.svg"
          alt="Personalisasi AI Icon"
          className="h-10 absolute z-20 transition-transform duration-300 hover:scale-120"
          style={{ top: '25%', left: '10%' }}
        />
        <img
          src="/img/tag_pouch.svg"
          alt="Pelacak Pengeluaran Icon"
          className="h-10 absolute z-20 transition-transform duration-300 hover:scale-120"
          style={{ bottom: '20%', right: '10%' }}
        />
        <img
          src="/img/tag_track.svg"
          alt="Dana Komunal Icon"
          className="h-10 absolute z-20 transition-transform duration-300 hover:scale-120"
          style={{ bottom: '10%', left: '15%' }}
        />
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center">
        <div className="lg:mr-24 px-8 text-center lg:text-left">
          <h2 className="text-5xl text-[var(--color-p-300)] font-semibold mb-8">Apa itu Healio.ai?</h2>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            Healio.ai adalah platform digital berbasis kecerdasan buatan (AI) yang dirancang untuk membantu masyarakat Indonesia dalam merencanakan, melacak, dan membiayai kebutuhan kesehatan secara lebih cerdas, transparan, dan inklusif.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
