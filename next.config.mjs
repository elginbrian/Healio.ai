/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  webpack: (config) => {
    // Only disable minimization in development
    if (process.env.NODE_ENV !== "production") {
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default nextConfig;
