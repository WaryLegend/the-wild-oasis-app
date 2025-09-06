/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [1, 10, 15, 20, 25, 50, 75, 80, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gfwbwubjxhammheefvsx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },

  experimental: {
    staleTimes: {
      // cache dynamic routes for 30s (default for nextjs v15 is 0s)
      dynamic: 30,
      // cache static routes for default 300s (5 min)
      static: 600,
    },
  },

  // static export in next.js ---> when build --> pure html + css...
  // output: "export",
};

export default nextConfig;
