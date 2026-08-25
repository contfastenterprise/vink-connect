import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

// next/font: carga Inter localmente — sin bloqueo de render, sin CLS, sin round-trip a Google
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vink Connect",
  description: "Tarjetas de presentación digitales y gestión de contactos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`bg-background ${inter.variable}`}>
      <head>
        {/* Preconnect para Material Symbols — reduce latencia aunque no elimina el bloqueo */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Material Symbols no está disponible en next/font, se carga con display=swap para no bloquear */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background transition-colors duration-300 font-sans">
        <ThemeProvider defaultTheme="dark">
          {children}
          <Toaster position="top-center" theme="dark" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
