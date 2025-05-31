"use client";
import React, { useState } from "react";
import CommunityHeader from "@/components/community/community_header/page";
import AskQuestionSection from "@/components/community/ask_question/page";
import CategoryFilter from "@/components/community/category_filter/page";
import QuestionCard from "@/components/community/question_card/page";
const Community = () => {
  const [activeTab, setActiveTab] = useState("public");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const publicQuestions = [
    {
      id: "1",
      userName: "D**n",
      userAvatar: "",
      timeAgo: "2 jam lalu",
      category: "Umum",
      isAnswered: true,
      title: "Nyeri Kepala Berkepanjangan Selama 3 Hari, Apakah Normal?",
      excerpt: "Saya mengalami nyeri kepala yang berkepanjangan selama tiga hari berturut-turut. Rasa sakitnya tidak terlalu tajam, tetapi cukup mengganggu aktivitas harian saya, terutama saat bekerja di depan layar dalam waktu lama...",
      fullQuestion:
        "Saya mengalami nyeri kepala yang berkepanjangan selama tiga hari berturut-turut. Rasa sakitnya tidak terlalu tajam, tetapi cukup mengganggu aktivitas harian saya, terutama saat bekerja di depan layar dalam waktu lama. Saya sudah mencoba mengurangi penggunaan gadget, tidur lebih awal, dan minum air putih yang cukup, tetapi kondisinya masih belum membaik. Saya ingin tahu, apakah ini kondisi yang masih tergolong normal, ataukah ada kemungkinan indikasi masalah kesehatan lain yang perlu saya waspadai? Juga, obat apa yang aman dikonsumsi untuk mengurangi nyeri ini, jika sewaktu-waktu kambuh kembali?",
      answer: {
        doctorName: "Rizqi Al-Madinah S.Kep",
        doctorAvatar: "/img/doctor_avatar.jpg",
        answerTimeAgo: "2 jam lalu",
        excerpt:
          "Nyeri kepala yang berlangsung 3 hari sebaiknya tidak diabaikan. Untuk sementara, Anda bisa mengonsumsi paracetamol sesuai dosis. Namun, saya sarankan untuk segera konsultasi ke dokter jika nyeri tidak berkurang dalam 24 jam ke depan...",
        fullAnswer:
          "Halo Selamat Siang, nyeri kepala yang berlangsung 3 hari tanpa perbaikan adalah gejala yang tidak boleh diabaikan, meskipun nyerinya tidak terasa tajam. Terutama jika disertai faktor pemicu seperti paparan layar berlebih, postur tubuh saat duduk, atau stres. Ini bisa jadi jenis tension-type headache atau migrain ringan. Sebagai langkah awal, Anda bisa mengonsumsi paracetamol 500mg setiap 6–8 jam jika diperlukan, maksimal 3 kali sehari. Pastikan Anda cukup istirahat, hindari paparan layar terlalu lama, dan jaga hidrasi tubuh. Namun, jika keluhan tidak membaik dalam 24 jam ke depan, atau jika muncul gejala tambahan seperti mual, muntah, penglihatan kabur, atau kelemahan anggota tubuh, segera periksakan diri ke dokter. Pemeriksaan langsung sangat penting untuk menyingkirkan kemungkinan gangguan neurologis yang lebih serius. Semoga lekas membaik, dan jangan ragu untuk kembali bertanya bila ada gejala lanjutan.",
      },
    },
    {
      id: "2",
      userName: "G**y",
      userAvatar: "",
      timeAgo: "1 hari lalu",
      category: "Gizi",
      isAnswered: false,
      title: "Anak Susah Makan Sayur, Bagaimana Cara Mengatasinya?",
      excerpt: "Anak saya berusia 4 tahun dan sangat sulit sekali makan sayur. Setiap kali disajikan, dia selalu menolak atau hanya memakannya sedikit...",
      fullQuestion:
        "Anak saya berusia 4 tahun dan sangat sulit sekali makan sayur. Setiap kali disajikan, dia selalu menolak atau hanya memakannya sedikit. Saya khawatir asupan nutrisinya kurang karena ini. Adakah tips atau trik khusus untuk membuat anak saya mau makan sayur?",
      answer: null,
    },
    {
      id: "3",
      userName: "S**a",
      userAvatar: "",
      timeAgo: "3 jam lalu",
      category: "Kehamilan",
      isAnswered: true,
      title: "Mual dan Muntah di Trimester Pertama, Normal Kah?",
      excerpt: "Saya sedang hamil 8 minggu dan mengalami mual muntah yang cukup parah setiap pagi. Bahkan kadang siang hari juga masih mual...",
      fullQuestion: "Saya sedang hamil 8 minggu dan mengalami mual muntah yang cukup parah setiap pagi. Bahkan kadang siang hari juga masih mual. Apakah ini normal? Dan bagaimana cara mengatasinya supaya tidak mengganggu aktivitas?",
      answer: {
        doctorName: "Dr. Maria Sari, Sp.OG",
        doctorAvatar: "/img/doctor_avatar2.jpg",
        answerTimeAgo: "2 jam lalu",
        excerpt: "Morning sickness adalah hal yang sangat normal dialami ibu hamil, terutama di trimester pertama. Biasanya akan berkurang setelah minggu ke-12...",
        fullAnswer:
          "Selamat atas kehamilannya! Morning sickness atau mual muntah di trimester pertama adalah hal yang sangat normal dan dialami sekitar 70-80% ibu hamil. Ini disebabkan oleh perubahan hormon HCG yang meningkat pesat. Beberapa tips yang bisa membantu: 1) Makan dalam porsi kecil tapi sering, 2) Hindari makanan berlemak dan berbau menyengat, 3) Konsumsi makanan kering seperti biskuit di pagi hari sebelum bangun tidur, 4) Minum air putih yang cukup untuk mencegah dehidrasi, 5) Istirahat yang cukup. Jika muntah sangat sering (lebih dari 3x sehari) dan tidak bisa makan sama sekali, segera konsultasi ke dokter kandungan untuk pemeriksaan lebih lanjut.",
      },
    },
    {
      id: "4",
      userName: "R**i",
      userAvatar: "",
      timeAgo: "5 jam lalu",
      category: "Anak",
      isAnswered: true,
      title: "Demam Tinggi pada Balita, Kapan Harus ke Dokter?",
      excerpt: "Anak saya umur 2 tahun demam 38.5°C sudah 2 hari. Sudah diberi paracetamol tapi masih naik turun...",
      fullQuestion: "Anak saya umur 2 tahun demam 38.5°C sudah 2 hari. Sudah diberi paracetamol tapi masih naik turun. Dia masih mau makan dan minum, tapi lebih rewel dari biasanya. Kapan sebaiknya saya bawa ke dokter?",
      answer: {
        doctorName: "Dr. Ahmad Pediatri, Sp.A",
        doctorAvatar: "/img/doctor_avatar3.jpg",
        answerTimeAgo: "4 jam lalu",
        excerpt: "Demam pada balita memang perlu perhatian khusus. Jika sudah berlangsung 2 hari dengan suhu di atas 38°C, sebaiknya segera konsultasi...",
        fullAnswer:
          "Untuk balita usia 2 tahun, demam di atas 38°C yang berlangsung lebih dari 2 hari perlu evaluasi dokter. Beberapa tanda yang mengharuskan segera ke dokter: 1) Demam di atas 39°C, 2) Anak tampak sangat lemas atau sulit dibangunkan, 3) Sesak napas atau napas cepat, 4) Muntah terus menerus, 5) Tidak mau minum sama sekali, 6) Ruam di kulit, 7) Kejang. Meskipun anak masih mau makan minum, mengingat demam sudah 2 hari, saya sarankan untuk membawa ke dokter anak untuk pemeriksaan fisik dan menentukan penyebab demam, apakah infeksi virus atau bakteri yang memerlukan pengobatan khusus.",
      },
    },
    {
      id: "5",
      userName: "L**a",
      userAvatar: "",
      timeAgo: "6 jam lalu",
      category: "Umum",
      isAnswered: false,
      title: "Susah Tidur dan Sering Terbangun Malam Hari",
      excerpt: "Beberapa minggu ini saya susah sekali tidur. Meskipun sudah mengantuk, tapi begitu berbaring mata jadi melek lagi...",
      fullQuestion:
        "Beberapa minggu ini saya susah sekali tidur. Meskipun sudah mengantuk, tapi begitu berbaring mata jadi melek lagi. Kalau sudah tertidur juga sering terbangun tengah malam dan susah tidur lagi. Ini mempengaruhi aktivitas saya di siang hari jadi sering ngantuk. Ada saran tidak?",
      answer: null,
    },
    {
      id: "6",
      userName: "F**r",
      userAvatar: "",
      timeAgo: "8 jam lalu",
      category: "Gizi",
      isAnswered: true,
      title: "Diet Sehat untuk Menurunkan Kolesterol",
      excerpt: "Hasil lab saya menunjukkan kolesterol total 250 mg/dL. Dokter bilang harus diet ketat. Makanan apa saja yang boleh dan tidak boleh?",
      fullQuestion:
        "Hasil lab saya menunjukkan kolesterol total 250 mg/dL, LDL 180 mg/dL. Dokter bilang harus diet ketat untuk menurunkan kolesterol. Saya bingung makanan apa saja yang boleh dan tidak boleh dikonsumsi. Bisa tolong dijelaskan?",
      answer: {
        doctorName: "Dr. Nutritionist Sinta, M.Gizi",
        doctorAvatar: "/img/doctor_avatar4.jpg",
        answerTimeAgo: "7 jam lalu",
        excerpt: "Dengan kadar kolesterol 250 mg/dL memang perlu diet khusus. Fokus pada makanan tinggi serat dan rendah lemak jenuh...",
        fullAnswer:
          "Dengan kadar kolesterol total 250 mg/dL dan LDL 180 mg/dL, memang perlu diet ketat. Makanan yang BOLEH: 1) Oatmeal, beras merah, roti gandum, 2) Ikan salmon, tuna, makarel (kaya omega-3), 3) Ayam tanpa kulit, 4) Sayuran hijau, brokoli, bayam, 5) Buah apel, pir, jeruk, alpukat, 6) Kacang-kacangan, almond, walnut, 7) Minyak zaitun, minyak kanola. Makanan yang HINDARI: 1) Daging berlemak, jeroan, 2) Kuning telur (maksimal 2-3 per minggu), 3) Makanan gorengan, 4) Santan kental, 5) Mentega, margarin, 6) Fast food, makanan olahan. Kombinasikan dengan olahraga rutin 30 menit/hari dan kontrol rutin setiap 3 bulan.",
      },
    },
    {
      id: "7",
      userName: "M**d",
      userAvatar: "",
      timeAgo: "12 jam lalu",
      category: "Umum",
      isAnswered: false,
      title: "Nyeri Punggung Bawah Setelah Kerja dari Rumah",
      excerpt: "Sejak WFH, saya sering mengalami nyeri punggung bawah. Terutama setelah duduk lama di depan laptop...",
      fullQuestion:
        "Sejak WFH, saya sering mengalami nyeri punggung bawah. Terutama setelah duduk lama di depan laptop. Kursi kerja saya juga tidak terlalu ergonomis. Ada tips untuk mengurangi nyeri dan mencegah agar tidak bertambah parah?",
      answer: null,
    },
    {
      id: "8",
      userName: "A**i",
      userAvatar: "",
      timeAgo: "1 hari lalu",
      category: "Anak",
      isAnswered: true,
      title: "Anak Terlambat Bicara Usia 2 Tahun",
      excerpt: "Anak saya usia 2 tahun masih belum bisa bicara dengan jelas. Hanya bisa beberapa kata sederhana seperti mama, papa...",
      fullQuestion:
        "Anak saya usia 2 tahun masih belum bisa bicara dengan jelas. Hanya bisa beberapa kata sederhana seperti mama, papa, mam (makan). Teman-teman seusianya sudah bisa bicara 2-3 kata dalam satu kalimat. Apakah ini normal atau perlu terapi wicara?",
      answer: {
        doctorName: "Dr. Lia Tumbuh Kembang, Sp.A",
        doctorAvatar: "/img/doctor_avatar5.jpg",
        answerTimeAgo: "20 jam lalu",
        excerpt: "Di usia 2 tahun, anak normalnya sudah bisa mengucapkan 50-100 kata dan mulai menggabungkan 2 kata. Perlu evaluasi lebih lanjut...",
        fullAnswer:
          "Perkembangan bicara setiap anak memang bervariasi, tapi ada patokan umum. Usia 2 tahun anak normalnya: 1) Bisa mengucapkan 50-100 kata, 2) Mulai menggabungkan 2 kata (mama pergi, mau makan), 3) Bisa mengikuti instruksi sederhana, 4) Menunjuk dan menyebutkan benda. Jika anak hanya bisa beberapa kata, perlu evaluasi: 1) Periksa pendengaran ke dokter THT, 2) Konsultasi ke dokter tumbuh kembang anak, 3) Evaluasi terapi wicara jika diperlukan. Stimulasi di rumah: sering ajak bicara, bacakan buku, nyanyikan lagu, batasi screen time, dan berikan respon positif setiap anak mencoba bicara. Jangan tunda konsultasi karena golden period perkembangan bahasa di usia 0-3 tahun.",
      },
    },
  ];

  const myQuestions = [
    {
      id: "my1",
      userName: "You",
      userAvatar: "",
      timeAgo: "3 hari lalu",
      category: "Umum",
      isAnswered: true,
      title: "Cara Mengatasi Stress Kerja yang Berlebihan",
      excerpt: "Akhir-akhir ini saya merasa stress berlebihan karena beban kerja yang menumpuk...",
      fullQuestion: "Akhir-akhir ini saya merasa stress berlebihan karena beban kerja yang menumpuk. Saya sering merasa cemas, susah konsentrasi, dan tidur jadi tidak nyenyak. Bagaimana cara mengatasi stress ini?",
      answer: {
        doctorName: "Dr. Psikolog Rina, M.Psi",
        doctorAvatar: "/img/doctor_avatar6.jpg",
        answerTimeAgo: "2 hari lalu",
        excerpt: "Stress kerja memang bisa sangat mengganggu kesehatan mental dan fisik. Beberapa strategi yang bisa membantu...",
        fullAnswer:
          "Stress kerja yang berkepanjangan memang berbahaya bagi kesehatan. Beberapa cara mengelola stress: 1) Time management yang baik - buat prioritas pekerjaan, 2) Teknik relaksasi seperti deep breathing atau meditasi 10-15 menit/hari, 3) Olahraga rutin untuk melepas endorfin, 4) Batasi waktu kerja, sisakan waktu untuk hobi, 5) Komunikasi dengan atasan tentang beban kerja, 6) Tidur cukup 7-8 jam/malam, 7) Hindari kafein berlebihan. Jika stress sudah mengganggu fungsi sehari-hari, pertimbangkan konseling psikologi. Ingat, kesehatan mental sama pentingnya dengan kesehatan fisik.",
      },
    },
    {
      id: "my2",
      userName: "You",
      userAvatar: "",
      timeAgo: "1 minggu lalu",
      category: "Gizi",
      isAnswered: false,
      title: "Program Diet yang Aman untuk Turun Berat Badan",
      excerpt: "Saya ingin menurunkan berat badan sekitar 10 kg dalam 3 bulan. Tinggi 165 cm, berat 75 kg...",
      fullQuestion: "Saya ingin menurunkan berat badan sekitar 10 kg dalam 3 bulan. Tinggi 165 cm, berat 75 kg. Sudah coba berbagai diet tapi selalu yoyo. Kira-kira program diet apa yang aman dan sustainable?",
      answer: null,
    },
  ];

  const categories = ["Semua", "Umum", "Anak", "Kehamilan", "Gizi"];

  const filteredQuestions = selectedCategory === "Semua" ? publicQuestions : publicQuestions.filter((q) => q.category === selectedCategory);

  return (
    <div className="bg-[var(--color-w-300)] min-h-screen pb-12">
      <div className="p-8">
        <CommunityHeader />
        <p className="text-xl font-semibold text-gray-800 mb-4">Ajukan Pertanyaan</p>
        <AskQuestionSection />

        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-8 py-3 text-lg font-semibold ${activeTab === "public" ? "text-[var(--color-p-300)] border-b-2 border-[var(--color-p-300)]" : "text-gray-600 hover:text-gray-800"} transition-colors duration-200`}
            onClick={() => setActiveTab("public")}
          >
            Pertanyaan Publik
          </button>
          <button
            className={`px-8 py-3 text-lg font-semibold ${activeTab === "myQuestions" ? "text-[var(--color-p-300)] border-b-2 border-[var(--color-p-300)]" : "text-gray-600 hover:text-gray-800"} transition-colors duration-200`}
            onClick={() => setActiveTab("myQuestions")}
          >
            Pertanyaan Saya
          </button>
        </div>

        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {activeTab === "public" && (
          <div className="space-y-6">
            {filteredQuestions.length > 0 ? filteredQuestions.map((question) => <QuestionCard key={question.id} question={question} />) : <p className="text-gray-500 text-center py-12">Tidak ada pertanyaan di kategori ini.</p>}
          </div>
        )}

        {activeTab === "myQuestions" && (
          <div className="space-y-6">
            {myQuestions.length > 0 ? myQuestions.map((question) => <QuestionCard key={question.id} question={question} />) : <p className="text-gray-500 text-center py-12">Belum ada pertanyaan yang Anda buat.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
