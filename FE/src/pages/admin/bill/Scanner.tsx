import { Html5QrcodeScanner, Html5QrcodeResult } from "html5-qrcode";
import React, { useEffect, useRef } from "react";

interface ScannerProps {
  handleScan: (decodedText: string, result: Html5QrcodeResult) => void;
  setOpen: (open: boolean) => void;
}

const Scanner: React.FC<ScannerProps> = ({ handleScan, setOpen }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      /* verbose = */ false
    );

    const success = (decodedText: string, result: Html5QrcodeResult) => {
      handleScan(decodedText, result);
      setOpen(false);
    };

    const error = (err: string) => {
      console.error(`QR Code scan error: ${err}`);
    };

    scannerRef.current.render(success, error);
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [handleScan, setOpen]);

  return <div id="reader"></div>;
};

export default Scanner;
