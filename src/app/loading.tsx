export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <p className="font-label-md text-primary animate-pulse">Cargando...</p>
      </div>
    </div>
  );
}
