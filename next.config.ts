import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    defaultLocale: "ar",
    locales: ["ar", "fr"],
  },
  reactCompiler: true,
};

export default nextConfig;
