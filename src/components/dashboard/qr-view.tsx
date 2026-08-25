'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

interface QRViewProps {
  slug: string | undefined;
}

export function QRView({ slug }: QRViewProps) {
  const [origin, setOrigin] = useState('https://vink.com');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!slug) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center space-y-4">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">qr_code_scanner</span>
        </div>
        <h2 className="font-headline-md text-xl text-on-surface">No tienes una tarjeta</h2>
        <p className="font-body-md text-sm text-on-surface-variant">Crea tu tarjeta en la pestaña "Editor" para poder generar tu código QR.</p>
      </div>
    );
  }

  const cardUrl = `${origin}/c/${slug}`;

  const downloadQR = () => {
    const svg = document.getElementById("QRCode");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `VinkQR-${slug}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[340px] mx-auto flex flex-col items-center">
      <div className="text-center space-y-1 mb-6">
        <h2 className="font-headline-md text-xl text-on-surface">Tu Código QR</h2>
        <p className="font-body-sm text-[13px] text-on-surface-variant">Escanea para compartir tu tarjeta</p>
      </div>

      {/* Ticket / Card Container */}
      <div className="w-full neon-card rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative border border-primary/40">
        {/* Glow behind QR */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/15 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="p-8 flex flex-col items-center">
          <div className="bg-white p-5 rounded-3xl shadow-[0_0_25px_rgba(224,64,251,0.5)] relative z-10 transition duration-150 ease-out hover:scale-[1.02]">
            <QRCode 
              id="QRCode"
              value={cardUrl}
              size={220}
              level="H"
              bgColor="#ffffff"
              fgColor="#050510"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        {/* Dashed divider */}
        <div className="w-full h-0 border-t-2 border-dashed border-primary/30 relative">
          <div className="absolute -left-3 -top-[12px] w-6 h-6 bg-background rounded-full border border-primary/30"></div>
          <div className="absolute -right-3 -top-[12px] w-6 h-6 bg-background rounded-full border border-primary/30"></div>
        </div>

        <div className="p-6 bg-card/80">
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleCopy}
              className="w-full flex items-center justify-between bg-muted border border-border rounded-xl p-3 relative z-10 hover:border-accent transition duration-150 ease-out active:scale-[0.97]"
            >
              <span className="font-mono text-xs text-accent truncate mr-2">{cardUrl}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ease-out ${copied ? 'bg-primary/20 text-primary' : 'bg-secondary text-accent'}`}>
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </div>
            </button>

            <button 
              onClick={downloadQR}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold transition duration-150 ease-out active:scale-[0.97] hover:bg-primary/90 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(224,64,251,0.4)] border border-primary/40"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Guardar Imagen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
