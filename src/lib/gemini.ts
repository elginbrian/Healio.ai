import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExpenseCategory, IFacility, IUser } from "@/types";
import * as fs from "fs";

export interface ParsedReceiptData {
  items: Array<{
    medicine_name: string;
    quantity?: number;
    unit_price?: number;
    total_price: number;
    category: ExpenseCategory;
  }>;
  totalAmount?: number;
  facilityName?: string;
  transactionDate?: string;
}

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
        5. Untuk field 'image_url', cari gambar fasilitas dari sumber tepercaya (situs resmi, Google Maps, atau direktori kesehatan).

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
          image_url?: string;
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
          "services_offered": ["Instalasi Gawat Darurat", "Rawat Inap", "Poliklinik Spesialis", "Radiologi"],
          "image_url": "https://example.com/images/rsud-saiful-anwar.jpg"
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
      2.  Cari informasi untuk field yang mungkin masih kosong (misalnya \`tariff_min\`, \`tariff_max\`, atau \`image_url\`).
      3.  Untuk field \`image_url\`, cari gambar fasilitas dari sumber tepercaya (situs resmi, Google Maps, atau direktori kesehatan).
      4.  Kembalikan hasilnya sebagai **SATU OBJEK JSON TUNGGAL** yang valid dan sesuai dengan struktur interface TypeScript di bawah ini.
      5.  Jika sebuah field tidak dapat ditemukan atau diverifikasi, jangan sertakan field tersebut di dalam JSON balasan Anda.

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
        image_url?: string;
      }
      \`\`\`

      **Contoh Output JSON yang Sempurna:**
      \`\`\`json
      {
        "overall_rating": 4.7,
        "phone": "(0341) 362102",
        "services_offered": ["IGD", "Rawat Inap", "Poliklinik Spesialis", "Radiologi", "Bedah Sentral", "Farmasi", "Rehabilitasi Medik"],
        "image_url": "https://example.com/images/rsud-saiful-anwar.jpg"
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

export async function searchFacilitiesWithGemini(query: string, userLocation: { latitude: number; longitude: number }, maxDistanceKm: number, maxBudget: number): Promise<Partial<IFacility>[]> {
  const prompt = `
    **Task**: You are a healthcare facility search expert. Analyze the user's search query and find the most relevant healthcare facilities.
    
    **User Query**: "${query}"
    
    **User Location**: Latitude ${userLocation.latitude}, Longitude ${userLocation.longitude}
    **Maximum Distance**: ${maxDistanceKm} km
    **Maximum Budget**: Rp${maxBudget.toLocaleString()}
    
    **Instructions**:
    1. Interpret what the user is looking for (e.g., type of facility, service, specialty, location)
    2. Return 3-5 relevant healthcare facilities based on the query
    3. If the query mentions a specific condition or treatment, suggest appropriate facilities
    4. If the query is vague, suggest general healthcare facilities nearby
    5. Ensure results include appropriate facility details
    
    **Output Format**:
    Return a JSON array of facilities. Each facility should include these fields:
    - name: string (facility name)
    - type: "HOSPITAL" | "CLINIC" | "PUSKESMAS" (facility type)
    - address: string (complete address)
    - tariff_min: number (optional minimum cost in Rupiah)
    - tariff_max: number (optional maximum cost in Rupiah)
    - overall_rating: number (rating between 1-5)
    - latitude: number (facility latitude)
    - longitude: number (facility longitude)
    - phone: string (optional contact number)
    - services_offered: string (comma-separated list of services)
    - image_url: string (optional URL to facility image)
    
    Return ONLY the JSON array with no explanation or additional text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    text = text.replace(/```json|```/g, "").trim();

    if (!text.startsWith("[") || !text.endsWith("]")) {
      console.error("Unexpected Gemini response format:", text);
      return [];
    }

    try {
      const facilities = JSON.parse(text);

      const validFacilities = facilities.filter((facility: any) => facility && facility.name && facility.address && facility.latitude !== undefined && facility.longitude !== undefined);

      return validFacilities.map((facility: any, index: number) => ({
        ...facility,
        _id: `search-${Date.now()}-${index}`,
      }));
    } catch (parseError) {
      console.error("Error parsing Gemini search results:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error searching facilities with Gemini:", error);
    return [];
  }
}

interface GeminiExtractionResult {
  items: Array<{
    name: string;
    quantity?: number;
    unit_price?: number;
    total_price: number;
    category?: ExpenseCategory;
  }>;
  overall_total?: number;
  store_name?: string;
  transaction_date?: string;
}

export async function processReceiptWithGemini(imagePath: string): Promise<ParsedReceiptData | null> {
  const apiKey = process.env.GEMINI_API_KEY ?? "";
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
    throw new Error("Konfigurasi AI tidak lengkap.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString("base64");

  const prompt = `
    Anda adalah AI ahli dalam membaca struk pembelian, khususnya struk medis, apotek, atau rumah sakit.
    Tugas Anda adalah mengekstrak informasi detail dari gambar struk yang diberikan.

    Format Output yang DIHARAPKAN (WAJIB JSON VALID):
    {
      "items": [
        {
          "name": "NAMA_PRODUK_ATAU_LAYANAN",
          "quantity": JUMLAH_PRODUK (angka, jika ada, default 1),
          "unit_price": HARGA_SATUAN_PRODUK (angka, jika ada),
          "total_price": TOTAL_HARGA_PRODUK_INI (angka, wajib ada),
          "category": "KATEGORI_PENGELUARAN" (pilih dari: ${Object.values(ExpenseCategory).join(", ")}. Jika tidak yakin, gunakan 'OTHER'.)
        }
      ],
      "overall_total": TOTAL_KESELURUHAN_PEMBAYARAN (angka, jika tertera jelas),
      "store_name": "NAMA_TOKO_ATAU_FASILITAS_KESEHATAN" (jika tertera),
      "transaction_date": "YYYY-MM-DD" (TANGGAL_TRANSAKSI, jika tertera, format YYYY-MM-DD)
    }

    Aturan Penting:
    1.  Fokus pada item pembelian, harga, nama tempat, dan tanggal.
    2.  Jika kuantitas atau harga satuan tidak jelas, Anda boleh mengosongkannya, tetapi 'name' dan 'total_price' untuk setiap item HARUS ADA.
    3.  Jika ada beberapa item, pastikan semua tercatat dalam array "items".
    4.  Jika struk sangat tidak jelas atau bukan struk pembelian, kembalikan JSON dengan array "items" kosong.
    5.  Untuk 'category', cobalah untuk mengklasifikasikan berdasarkan nama item. Misalnya, jika ada kata "obat", "sirup", "tablet", gunakan "MEDICATION". Jika "konsultasi", "dokter", gunakan "CONSULTATION". Jika "lab", "tes darah", gunakan "LAB_FEE". Default ke "OTHER".
    6.  Pastikan output SELALU berupa string JSON yang valid. Jangan tambahkan penjelasan atau teks lain di luar JSON.

    Analisis gambar struk berikut dan berikan output JSON sesuai format di atas.
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);
    const responseText = result.response.text().trim();

    const cleanedText = responseText.replace(/^```json\s*|```$/g, "").trim();

    console.log("Gemini OCR Raw Response:", cleanedText);
    const parsed = JSON.parse(cleanedText) as GeminiExtractionResult;

    const transformedData: ParsedReceiptData = {
      items: parsed.items.map((item) => ({
        medicine_name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        category: item.category || ExpenseCategory.OTHER,
      })),
      totalAmount: parsed.overall_total,
      facilityName: parsed.store_name,
      transactionDate: parsed.transaction_date,
    };

    return transformedData;
  } catch (error) {
    console.error("Error processing receipt with Gemini:", error);
    throw new Error("AI gagal memproses gambar struk.");
  }
}

export async function generateSpendingRecommendations(expenses: any[], expenseCount: number = 0): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY ?? "";
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
    throw new Error("Konfigurasi AI tidak lengkap.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const hasExpenses = expenses && expenses.length > 0;
  const hasLimitedData = hasExpenses && expenses.length < 3;

  const simplifiedExpenses = hasExpenses
    ? expenses
        .map((expense) => ({
          category: expense.category,
          total_price: expense.total_price,
          medicine_name: expense.medicine_name,
          facility_name: expense.facility_name,
          transaction_date: expense.transaction_date,
        }))
        .slice(0, 50)
    : [];

  let prompt = "";

  if (!hasExpenses) {
    prompt = `
      Anda adalah seorang penasihat keuangan pribadi yang fokus pada pengeluaran kesehatan.
      
      Pengguna belum memiliki data pengeluaran kesehatan. Berikan 3 rekomendasi umum yang bermanfaat untuk pengelolaan keuangan kesehatan.
      
      Fokuskan pada:
      1. Cara merencanakan anggaran kesehatan
      2. Tips penghematan biaya kesehatan
      3. Pentingnya asuransi atau proteksi kesehatan
      
      Berikan rekomendasi dalam format array JSON dengan 3 string rekomendasi yang jelas, konkret, dan membantu.
      Setiap rekomendasi harus spesifik dan langsung diterapkan, misalnya "Alokasikan sekitar 10-15% dari pendapatan bulanan Anda untuk dana darurat kesehatan."
      
      Format output yang diharapkan:
      ["Rekomendasi pertama yang spesifik.", "Rekomendasi kedua yang jelas.", "Rekomendasi ketiga yang konkret."]
      
      Pastikan output HANYA berupa array JSON string tersebut tanpa komentar tambahan.
    `;
  } else if (hasLimitedData) {
    prompt = `
      Anda adalah seorang penasihat keuangan pribadi yang fokus pada pengeluaran kesehatan.
      
      Pengguna memiliki data pengeluaran kesehatan yang masih terbatas (kurang dari 3 transaksi). Berikan 3 rekomendasi yang menggabungkan wawasan dari data yang ada dengan saran umum yang bermanfaat.
      
      Data Pengeluaran Terbatas Pengguna:
      ${JSON.stringify(simplifiedExpenses, null, 2)}
      
      Fokuskan pada:
      1. Wawasan dari kategori pengeluaran yang sudah terlihat
      2. Tips pengelolaan keuangan kesehatan berdasarkan pola awal pengeluaran
      3. Saran umum untuk persiapan kesehatan di masa depan
      
      Berikan rekomendasi dalam format array JSON dengan 3 string rekomendasi yang jelas, konkret, dan membantu.
      Rekomendasi pertama harus dikaitkan dengan data pengguna, sedangkan yang lainnya dapat berupa saran umum yang relevan.
      
      Format output yang diharapkan:
      ["Rekomendasi pertama berdasarkan data yang ada.", "Rekomendasi kedua yang jelas dan relevan.", "Rekomendasi ketiga yang konkret."]
      
      Pastikan output HANYA berupa array JSON string tersebut tanpa komentar tambahan.
    `;
  } else {
    prompt = `
      Anda adalah seorang penasihat keuangan pribadi yang fokus pada pengeluaran kesehatan.
      Berdasarkan data riwayat pengeluaran kesehatan pengguna berikut, berikan 3 rekomendasi praktis dan spesifik untuk membantu pengguna mengelola keuangan kesehatannya dengan lebih baik.
      
      Fokuskan pada:
      1. Pola pengeluaran yang terlihat
      2. Potensi penghematan yang mungkin dilakukan
      3. Alokasi dana yang lebih efisien
      4. Tips konkret berdasarkan kategori pengeluaran terbesar

      Data Pengeluaran Pengguna:
      ${JSON.stringify(simplifiedExpenses, null, 2)}

      Berikan rekomendasi dalam format array JSON dengan 3 string rekomendasi yang jelas, konkret, dan membantu.
      Setiap rekomendasi harus langsung dan spesifik, misalnya "Pertimbangkan untuk mendaftar asuransi X yang cocok dengan pola pengeluaran Anda pada kategori Y."
      
      Format output yang diharapkan:
      ["Rekomendasi pertama yang spesifik.", "Rekomendasi kedua yang jelas.", "Rekomendasi ketiga yang konkret."]
      
      Pastikan output HANYA berupa array JSON string tersebut tanpa komentar tambahan.
    `;
  }

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanedText = responseText.replace(/^```json\s*|```$/g, "").trim();

    console.log("Gemini Spending Recommendation Raw Response:", cleanedText);

    try {
      const recommendations = JSON.parse(cleanedText);
      if (Array.isArray(recommendations) && recommendations.length > 0) {
        return recommendations.slice(0, 3);
      } else {
        console.error("Invalid recommendations format from Gemini:", recommendations);
        return generateFallbackRecommendations(hasExpenses, simplifiedExpenses);
      }
    } catch (parseError) {
      console.error("Error parsing Gemini recommendations:", parseError, "Raw text:", cleanedText);
      return generateFallbackRecommendations(hasExpenses, simplifiedExpenses);
    }
  } catch (error) {
    console.error("Error generating spending recommendations with Gemini:", error);
    return generateFallbackRecommendations(hasExpenses, simplifiedExpenses);
  }
}

function generateFallbackRecommendations(hasExpenses: boolean, expenses: any[]): string[] {
  if (!hasExpenses || expenses.length === 0) {
    return [
      "Alokasikan 5-10% dari pendapatan bulanan Anda untuk dana darurat kesehatan.",
      "Pertimbangkan untuk mendaftar asuransi kesehatan yang sesuai dengan kebutuhan Anda.",
      "Bandingkan harga obat di beberapa apotek untuk mendapatkan penawaran terbaik.",
    ];
  } else if (expenses.length < 3) {
    const categories = [...new Set(expenses.map((e) => e.category))];
    const categoryText = categories.length > 0 ? categories.join(", ") : "kesehatan";

    return [
      `Lanjutkan mencatat pengeluaran ${categoryText} Anda untuk mendapatkan rekomendasi yang lebih personal.`,
      "Pertimbangkan untuk menyiapkan dana darurat khusus untuk biaya kesehatan tidak terduga.",
      "Cek apakah asuransi atau BPJS Kesehatan dapat membantu mengurangi biaya pengobatan Anda.",
    ];
  } else {
    return [
      "Evaluasi pengeluaran kesehatan Anda secara berkala untuk mengidentifikasi area penghematan.",
      "Pertimbangkan apakah asuransi kesehatan tambahan diperlukan berdasarkan pola pengeluaran Anda.",
      "Bandingkan harga dan kualitas layanan kesehatan di beberapa fasilitas untuk mendapatkan nilai terbaik.",
    ];
  }
}

