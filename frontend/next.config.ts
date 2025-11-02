import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  reactStrictMode: false, // bổ sung vì bị React Strict Mode sẽ chạy useEffect 2 lần để phát hiện bug tiềm ẩn, tắt đi vì không cần thiết
};

export default nextConfig;
