/** @type {import('next').NextConfig} */
const nextConfig = {
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
