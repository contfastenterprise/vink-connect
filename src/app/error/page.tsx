export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-on-background px-4">
      <div className="text-center flex flex-col gap-4">
        <span className="material-symbols-outlined text-error text-[64px]">error</span>
        <h1 className="text-headline-md font-headline-md text-error">Lo sentimos, algo salió mal</h1>
        <p className="text-body-md text-on-surface-variant">Hubo un problema al procesar tu solicitud de autenticación.</p>
        <a href="/auth/login" className="text-primary hover:underline font-label-md mt-4">Volver al login</a>
      </div>
    </div>
  )
}
