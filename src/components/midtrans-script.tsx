"use client";

import Script from "next/script";
import { useEffect } from "react";

interface MidtransScriptProps {
  clientKey: string;
}

export default function MidtransScript({ clientKey }: MidtransScriptProps) {
  const handleError = (e: Error) => {
    console.error("Gagal memuat script Midtrans Snap.js:", e);
  };

  return <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={clientKey} strategy="afterInteractive" onError={handleError} />;
}
