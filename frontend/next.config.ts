import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Enable React Compiler (optional, if you need React optimizations)
  reactCompiler: false,
  experimental: {
  },

  // Optional: if you want to silence Turbopack root warnings
  // turbopack: {
  //   root: __dirname,
  // },
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'https://javeria-nigar-full-stack-todo.hf.space/api/:path*',
      },
    ];
  },
};
export default nextConfig;
