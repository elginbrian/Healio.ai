import { useState, useEffect } from "react";

export const useMidtransAvailability = () => {
  const [isMidtransAvailable, setIsMidtransAvailable] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadMidtransScript = () => {
    const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY_SANDBOX;
    const MIDTRANS_URL = "https://app.sandbox.midtrans.com/snap/snap.js";

    setIsChecking(true);
    setErrorMessage(null);

    const existingScript = document.querySelector(`script[src^="${MIDTRANS_URL}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    try {
      const script = document.createElement("script");
      script.src = `${MIDTRANS_URL}?client-key=${MIDTRANS_CLIENT_KEY}`;
      script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY || "");
      script.async = true;
      script.onload = () => {
        console.log("Midtrans script loaded successfully");
        if (window.snap) {
          setIsMidtransAvailable(true);
          setErrorMessage(null);
        } else {
          console.error("Midtrans loaded but window.snap is not available");
          setIsMidtransAvailable(false);
          setErrorMessage("Midtrans script loaded but snap object not initialized");
        }
        setIsChecking(false);
      };
      script.onerror = (error) => {
        console.error("Error loading Midtrans script:", error);
        setIsMidtransAvailable(false);
        setErrorMessage("Failed to load Midtrans script");
        setIsChecking(false);
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error("Exception during Midtrans script loading:", error);
      setIsMidtransAvailable(false);
      setErrorMessage(`Exception: ${error instanceof Error ? error.message : String(error)}`);
      setIsChecking(false);
    }
  };

  const retryLoading = () => {
    setRetryCount((prev) => prev + 1);
    loadMidtransScript();
  };

  useEffect(() => {
    loadMidtransScript();

    const checkInterval = setInterval(() => {
      if (window.snap) {
        setIsMidtransAvailable(true);
        setErrorMessage(null);
        setIsChecking(false);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => {
      clearInterval(checkInterval);
    };
  }, [retryCount]);

  return { isMidtransAvailable, isChecking, errorMessage, retryLoading };
};

