/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use standalone output in production mode
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  // Add development-specific settings
  webpack: (config, { dev }) => {
    // Add any development-specific webpack configurations here
    return config;
  },
};

export default nextConfig;
