'use client';

import QRCode from 'react-qr-code';

interface QRViewProps {
  slug: string | undefined;
}

export function QRView({ slug }: QRViewProps) {
  if (!slug) {
    return (
      <div className="max-w-md mx-auto mt-12 text-center space-y-4">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant">qr_code_scanner</span>
        </div>
        <h2 className="font-headline-md text-xl text-on-surface">No tienes una tarjeta</h2>
        <p className="font-body-md text-on-surface-variant">Crea tu tarjeta en la pestaña "My Card" para poder generar tu código QR.</p>
      </div>
    );
  }

  // Obtenemos la URL actual para el QR, asumiendo que el componente se monta en el cliente
  const cardUrl = typeof window !== 'undefined' ? `${window.location.origin}/c/${slug}` : `https://vink.com/c/${slug}`;

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

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-headline-md text-xl text-on-surface">Tu Código QR</h2>
        <p className="font-body-sm text-on-surface-variant">Muestra este código para compartir tu tarjeta rápidamente.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[64px] pointer-events-none"></div>
        
        <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(109,59,215,0.3)] relative z-10 transition duration-150 ease-out hover:scale-[1.02]">
          <QRCode 
            id="QRCode"
            value={cardUrl}
            size={200}
            level="H" // Alta corrección de errores para poder ponerle un logo en medio futuro
            bgColor="#ffffff"
            fgColor="#011230" // Midnight color
          />
        </div>

        <button 
          onClick={downloadQR}
          className="w-full py-4 rounded-xl bg-surface-container-high border border-white/10 text-on-surface font-label-md transition duration-150 ease-out active:scale-[0.97] hover:bg-surface-container-highest flex justify-center items-center gap-2 relative z-10"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          Descargar QR (PNG)
        </button>

        <div className="w-full flex items-center justify-between bg-surface-container-lowest border border-white/5 rounded-lg p-3 relative z-10">
          <span className="font-mono text-xs text-on-surface-variant truncate mr-2">{cardUrl}</span>
          <button 
            onClick={() => navigator.clipboard.writeText(cardUrl)}
            className="w-8 h-8 rounded-md bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition duration-150 ease-out active:scale-[0.97]"
            title="Copiar link"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">content_copy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
