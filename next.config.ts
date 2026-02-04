import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  turbopack: {
    resolveAlias: {
      "pino-pretty": "",
      lokijs: "",
      encoding: "",
    },
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
