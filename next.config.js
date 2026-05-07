/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
                port: ""
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: ""
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: ""
            },
            {
                protocol: "https",
                hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
                port: ""
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://gsg4k8os8gwsc4ksk4kkgg48.103.109.210.102.sslip.io/api/:path*',
            },

        ];
    }
};

module.exports = nextConfig;
