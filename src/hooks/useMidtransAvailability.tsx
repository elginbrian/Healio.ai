import { useState, useEffect } from "react";

export function useMidtransAvailability() {
  const [isMidtransAvailable, setIsMidtransAvailable] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 10;
    const checkInterval = 1000;

    const checkMidtransAvailability = () => {
      if (typeof window !== "undefined" && window.snap) {
        console.log("Midtrans Snap.js tersedia");
        setIsMidtransAvailable(true);
        setIsChecking(false);
        return true;
      }

      checkCount++;
      if (checkCount >= maxChecks) {
        console.error("Midtrans Snap.js tidak tersedia setelah beberapa kali percobaan");
        setIsChecking(false);
        return false;
      }

      return false;
    };

    const intervalId = setInterval(() => {
      if (checkMidtransAvailability()) {
        clearInterval(intervalId);
      }
    }, checkInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { isMidtransAvailable, isChecking };
}

