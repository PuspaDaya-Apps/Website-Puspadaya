/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://now4kswkgo4owoks884o0wc0.103.109.210.102.sslip.io/api/:path*',
            },
           
        ];
    }
};

module.exports = nextConfig;
