import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "react-hot-toast";
import MidtransScript from "@/components/midtrans-script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Healio.ai",
  description: "Solusi Kesehatan Terintegrasi Untukmu!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_SANDBOX || "";

  return (
    <html lang="id">
      <head>{midtransClientKey && <MidtransScript clientKey={midtransClientKey} />}</head>
      <body className={`${poppins.variable} font-poppins antialiased bg-gray-50 text-gray-900`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "white",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#f87171",
                secondary: "white",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
