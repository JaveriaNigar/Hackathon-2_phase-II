import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Enable React Compiler (optional, if you need React optimizations)
  experimental: {
    reactCompiler: true,
  },
  
  // Optional: if you want to silence Turbopack root warnings
  // turbopack: {
  //   root: __dirname,
  // },
};

export default nextConfig;
