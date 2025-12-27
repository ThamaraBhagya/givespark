import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // This is the core configuration object for image optimization
    images: {
        // Use remotePatterns to whitelist external image hosts securely
        remotePatterns: [
            {
                protocol: 'https',
                // This hostname matches all files stored in your Vercel Blob storage
                hostname: '**.public.blob.vercel-storage.com', 
                port: '',
                pathname: '/**', // Allows any path
            },
        ],
    },
    
    // Add any other configuration options here
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete 
        // even if your project has type errors.
        ignoreBuildErrors: true,
    },

    
};

export default nextConfig;