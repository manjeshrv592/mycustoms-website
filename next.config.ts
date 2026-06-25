import type { NextConfig } from "next";
import { defaultLocale } from "./src/i18n";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false,
  // Redirect the locale-less root "/" to the default locale.
  // Previously handled by app/page.tsx, moved here so the app can use
  // per-segment root layouts (each renders its own <html lang>).
  async redirects() {
    return [
      {
        source: "/",
        destination: `/${defaultLocale}`,
        permanent: false,
      },
    ];
  },
  // Disable caching for development (helps with iPad/mobile testing)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
