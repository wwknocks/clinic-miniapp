/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow screenshots served from Supabase Storage signed URLs
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
