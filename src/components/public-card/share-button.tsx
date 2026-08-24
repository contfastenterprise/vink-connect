'use client';

export function ShareButton({ title, url }: { title: string, url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('¡Enlace copiado al portapapeles!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-primary text-primary font-label-md text-[13px] px-6 py-3 rounded-xl hover:bg-primary/10 transition duration-150 ease-out active:scale-[0.97] glass-border"
    >
      <span className="material-symbols-outlined text-[18px]">share</span>
      Compartir Tarjeta
    </button>
  );
}
