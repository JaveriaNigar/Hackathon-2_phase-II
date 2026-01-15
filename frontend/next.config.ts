import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: "export",

  // Set base path and asset prefix for GitHub Pages repo
  basePath: isProd ? "/Hackathon-2_phase-II" : "",
  assetPrefix: isProd ? "/Hackathon-2_phase-II/" : "", // <- note the trailing slash

  // Enable React Compiler (optional, if you need React optimizations)
  reactCompiler: true,

  // Optional: if you want to silence Turbopack root warnings
  turbopack: {
    root: __dirname, // Sets the correct root directory
  },

};

export default nextConfig;
