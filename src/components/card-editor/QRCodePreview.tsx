'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function QRCodePreview({ url }: { url: string }) {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#4F46E5', // Indigo-600
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrSrc(url))
      .catch((err) => console.error(err));
  }, [url]);

  if (!qrSrc) return <div className="w-48 h-48 bg-gray-100 rounded-lg animate-pulse" />;

  return (
    <div className="flex flex-col items-center gap-4">
      <img src={qrSrc} alt="Código QR" className="w-48 h-48 rounded-lg shadow-sm" />
      <a
        href={qrSrc}
        download="tarjeta-qr.png"
        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
      >
        Descargar QR
      </a>
    </div>
  );
}
