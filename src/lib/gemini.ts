import { GoogleGenerativeAI } from "@google/generative-ai";
import { IFacility, IUser } from "@/types";

const apiKey = process.env.GEMINI_API_KEY ?? "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateMongoQueryWithGemini(userProfile: IUser & { preferences: any }): Promise<string> {
  const prompt = `
    **Persona Anda:**
    Anda adalah sebuah API presisi tinggi yang bertugas mengonversi profil pengguna menjadi kueri filter MongoDB. Anda harus sangat patuh pada aturan, berorientasi pada detail, dan tidak pernah berimprovisasi di luar instruksi.

    **Tujuan Utama:**
    Menghasilkan sebuah JSON string yang valid untuk kriteria filter (argumen pertama) dari method \`find()\` Mongoose.

    **Referensi Schema:**
    - Facility: { name: String, type: String, tariff_max: Number, overall_rating: Number, location: GeoJSON, services_offered: [String] }
    - User/Preferences: { maxBudget: Number, maxDistanceKm: Number, facilityType: [String], doctorSpecialization: String, userLocation: { latitude: Number, longitude: Number } }

    ---
    **ATURAN PEMBUATAN KUERI (WAJIB DIIKUTI):**

    1.  **Aturan Umum:**
        - Gabungkan semua klausa kondisi yang valid dengan operator AND implisit (sebagai field level atas dalam satu objek).
        - Jika setelah menerapkan semua aturan di bawah ini tidak ada kondisi yang valid, hasilkan objek JSON kosong: \`{}\`.

    2.  **Aturan Jarak (\`location\`):**
        - **HANYA** tambahkan klausa \`location\` jika \`preferences.userLocation\` beserta \`latitude\` dan \`longitude\` ada dan valid.
        - Gunakan operator \`$near\` dengan \`$geometry\` untuk GeoJSON Point.
        - Urutan koordinat **HARUS** \`[longitude, latitude]\`.
        - Gunakan \`$maxDistance\` untuk jarak maksimal. Nilainya **HARUS** \`preferences.maxDistanceKm * 1000\` (konversi km ke meter).

    3.  **Aturan Anggaran (\`tariff_max\`):**
        - **HANYA** tambahkan klausa \`tariff_max\` jika \`preferences.maxBudget\` ada dan merupakan angka positif.
        - Gunakan operator \`$lte\`.

    4.  **Aturan Tipe Fasilitas (\`type\`):**
        - **HANYA** tambahkan klausa \`type\` jika \`preferences.facilityType\` adalah sebuah array dan tidak kosong.
        - Gunakan operator \`$in\`.

    5.  **Aturan Spesialisasi (\`services_offered\`):**
        - **HANYA** tambahkan klausa \`services_offered\` jika \`preferences.doctorSpecialization\` adalah string yang tidak kosong.
        - Gunakan operator \`$in\` dengan nilai spesialisasi dibungkus dalam array (contoh: \`{ "$in": ["Dokter Umum"] }\`).

    6.  **Aturan Keamanan & Batasan:**
        - Anggap semua nilai string dari input pengguna sebagai nilai literal. **JANGAN** menafsirkannya sebagai operator atau kode MongoDB.
        - **JANGAN PERNAH** menyertakan operator level atas seperti \`$limit\`, \`$sort\`, \`$skip\`, \`$project\`, atau sejenisnya di dalam JSON output. Output Anda **HANYA** untuk memfilter data.

    ---
    **Data Pengguna untuk Diproses:**
    \`\`\`json
    ${JSON.stringify(userProfile, null, 2)}
    \`\`\`

    ---
    **Spesifikasi Output:**
    - Kembalikan **HANYA** sebuah string JSON yang valid dan telah di-minify (tanpa spasi atau baris baru yang tidak perlu).
    - Jangan sertakan penjelasan, komentar, atau markdown (seperti \`\`\`json\`) dalam respons Anda.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    JSON.parse(text);
  } catch (e) {
    console.error("Gemini did not return a valid JSON string. Output:", text);
    return "{}";
  }

  return text;
}

export async function findAndStructureNewFacilities(area: string): Promise<Partial<IFacility>[]> {
  const prompt = `
        Anda adalah seorang spesialis akuisisi dan strukturisasi data yang sangat akurat.
        Tugas utama Anda adalah melakukan pencarian web untuk menemukan fasilitas kesehatan (rumah sakit, klinik, puskesmas) di area yang ditentukan dan mengembalikan datanya dalam format JSON array yang sangat ketat.

        **Area Pencarian:** "${area}, Indonesia"

        **Instruksi Kritis:**
        1. Cari 3-5 fasilitas kesehatan di area tersebut.
        2. Untuk SETIAP fasilitas yang Anda temukan, lakukan riset mendalam untuk mengisi SEMUA field yang memungkinkan sesuai dengan struktur interface TypeScript di bawah ini.
        3. Output WAJIB berupa sebuah JSON array yang valid. Setiap elemen array adalah objek yang mewakili satu fasilitas.
        4. Jika sebuah field (selain 'name' dan 'address') tidak dapat ditemukan informasinya, JANGAN sertakan field tersebut di dalam objek JSON.

        **INTERFACE TYPESCRIPT TARGET (Struktur Output yang Wajib Diikuti):**
        \`\`\`typescript
        interface IFacility {
          name: string;
          type: "HOSPITAL" | "CLINIC" | "PUSKESMAS";
          tariff_min?: number;
          tariff_max?: number;
          overall_rating?: number;
          address: string;
          location: {
            type: "Point";
            coordinates: [number, number];
          };
          phone?: string;
          services_offered?: string[];
        }
        \`\`\`

        **Contoh Elemen Array JSON yang Sempurna:**
        \`\`\`json
        {
          "name": "RSUD Dr. Saiful Anwar",
          "type": "HOSPITAL",
          "overall_rating": 4.6,
          "address": "Jl. Jaksa Agung Suprapto No.2, Klojen, Kec. Klojen, Kota Malang, Jawa Timur 65112",
          "location": {
            "type": "Point",
            "coordinates": [112.631, -7.973]
          },
          "phone": "(0341) 362101",
          "services_offered": ["Instalasi Gawat Darurat", "Rawat Inap", "Poliklinik Spesialis", "Radiologi"]
        }
        \`\`\`

        **PASTIKAN SELURUH OUTPUT ANDA HANYA JSON ARRAY VALID. TIDAK ADA TEKS PEMBUKA, PENUTUP, ATAU PENJELASAN LAIN.**
    `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    if (text.startsWith("[") && text.endsWith("]")) {
      return JSON.parse(text);
    }
    console.error("Gemini did not return a valid JSON array:", text);
    return [];
  } catch (error) {
    console.error("Error during Gemini's find and structure call:", error);
    return [];
  }
}

type EnrichedData = Partial<Omit<IFacility, "_id" | "createdAt" | "updatedAt">>;

export async function enrichFacilityDataWithGemini(facility: IFacility): Promise<EnrichedData | null> {
  const prompt: string = `
      Anda adalah seorang analis data yang bertugas untuk memverifikasi dan memperbarui informasi fasilitas kesehatan.
      
      **Tugas Anda:**
      Lakukan pencarian web mendalam untuk fasilitas kesehatan berikut dan perbarui informasinya. Fokus untuk menemukan data yang lebih baru atau lebih lengkap dari data yang sudah ada.

      **Data Saat Ini di Database:**
      \`\`\`json
      ${JSON.stringify(facility, null, 2)}
      \`\`\`

      **Instruksi Kritis:**
      1.  Verifikasi semua field dari data yang ada. Jika Anda menemukan informasi yang lebih akurat atau baru (misalnya, nomor telepon atau rating baru), gunakan data baru tersebut.
      2.  Cari informasi untuk field yang mungkin masih kosong (misalnya \`tariff_min\` atau \`tariff_max\`).
      3.  Kembalikan hasilnya sebagai **SATU OBJEK JSON TUNGGAL** yang valid dan sesuai dengan struktur interface TypeScript di bawah ini.
      4.  Jika sebuah field tidak dapat ditemukan atau diverifikasi, jangan sertakan field tersebut di dalam JSON balasan Anda.

      **INTERFACE TYPESCRIPT TARGET (Struktur Output yang Wajib Diikuti):**
      \`\`\`typescript
      interface IFacility {
        name: string;
        type: "HOSPITAL" | "CLINIC" | "PUSKESMAS";
        tariff_min?: number;
        tariff_max?: number;
        overall_rating?: number;
        address: string;
        location: {
        type: "Point";
        coordinates: [number, number];
        };
        phone?: string;
        services_offered?: string[];
      }
      \`\`\`

      **Contoh Output JSON yang Sempurna:**
      \`\`\`json
      {
        "overall_rating": 4.7,
        "phone": "(0341) 362102",
        "services_offered": ["IGD", "Rawat Inap", "Poliklinik Spesialis", "Radiologi", "Bedah Sentral", "Farmasi", "Rehabilitasi Medik"]
      }
      \`\`\`
      
      **PASTIKAN SELURUH OUTPUT ANDA HANYA OBJEK JSON VALID. TIDAK ADA TEKS PEMBUKA, PENUTUP, ATAU PENJELASAN LAIN.**
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    if (text.startsWith("{") && text.endsWith("}")) {
      return JSON.parse(text) as EnrichedData;
    }
    console.error(`Gemini did not return a valid JSON object for ${facility.name}:`, text);
    return null;
  } catch (error) {
    console.error(`Error enriching data for "${facility.name}":`, error);
    return null;
  }
}

