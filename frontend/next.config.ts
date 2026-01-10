import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/Hackathon-2_phase-II" : "",
  assetPrefix: isProd ? "/Hackathon-2_phase-II/" : "",
  reactCompiler: true,
};

export default nextConfig;
