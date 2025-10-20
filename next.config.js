/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://ssc80wssow48gsgwwg8888s4.103.109.210.102.sslip.io/api/:path*',
            },

        ];
    }
};

module.exports = nextConfig;
