import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // DiceBear avatars (fallback de logos)
      { protocol: "https", hostname: "api.dicebear.com" },
      // Supabase Storage (para logos cuando se migre de Base64 a Storage)
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
    ],
  },
};

export default nextConfig;
