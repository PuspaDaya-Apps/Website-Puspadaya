import { NextRequest, NextResponse } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Content-Security-Policy.
 *
 * Nilai tiap direktif diturunkan dari sumber yang benar-benar dimuat aplikasi:
 * Google Fonts (@import di src/css/style.css), tile OpenStreetMap (4 komponen
 * peta Leaflet), dan empat host gambar yang terdaftar di next.config.js.
 * Satoshi di-host sendiri, jadi tidak perlu izin keluar.
 *
 * 'unsafe-inline' pada script-src masih diperlukan: layout menyuntikkan satu
 * <script> inline dan Next.js menambahkan skrip bootstrap-nya sendiri. Meski
 * begitu direktif ini tetap bernilai -- justru inilah yang memblokir
 * <script src="https://situs-asing/spam.js"> yang disuntikkan penyerang, pola
 * yang dipakai injeksi judol. Menghapus 'unsafe-inline' butuh nonce per
 * request, dan itu perubahan tersendiri.
 */
const buildCsp = (): string => {
    const directives = [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "frame-src 'none'",
        "form-action 'self'",
        // 'unsafe-eval' hanya dibutuhkan React Refresh saat development.
        `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' data: https://fonts.gstatic.com",
        [
            "img-src 'self' data: blob:",
            'https://*.tile.openstreetmap.org',
            'https://cdn.sanity.io',
            'https://lh3.googleusercontent.com',
            'https://avatars.githubusercontent.com',
            'https://pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev',
        ].join(' '),
        // Panggilan API lewat /api/* yang di-rewrite server-side, jadi tetap
        // satu origin. ws: untuk hot reload saat development.
        `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
        "worker-src 'self' blob:",
        "manifest-src 'self'",
    ];

    return directives.join('; ');
};

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip static files dan assets
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/public') ||
        pathname === '/favicon.ico' ||
        pathname === '/icon.ico'
    ) {
        return NextResponse.next();
    }

    // Skip panggilan API. Rute /api/* di-rewrite ke backend (lihat
    // next.config.js) dan diautentikasi lewat header Authorization, bukan
    // cookie. Kalau ikut dijaga di sini, request login sendiri
    // (POST /api/v1/auth/login) akan ikut di-redirect ke /auth/signin
    // sehingga login tidak mungkin berhasil.
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const token = req.cookies.get('token');
    const loginUrl = new URL('/auth/signin', req.url);

    // Halaman publik yang tidak perlu token
    const publicPages = ['/auth/signin'];
    const isPublicPage = publicPages.some(page => pathname.startsWith(page));

    // Jika sudah login dan mencoba mengakses halaman login, redirect ke home
    if (token && isPublicPage) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Jika tidak ada token dan bukan halaman publik, redirect ke login
    if (!token && !isPublicPage) {
        return NextResponse.redirect(loginUrl);
    }

    // Add security headers for all responses
    const response = NextResponse.next();
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Sengaja Report-Only: mode ini tidak memblokir apa pun, hanya mencatat
    // pelanggaran di konsol browser. Buka tiap halaman (terutama yang berpeta),
    // pastikan tidak ada laporan, baru ganti nama header ini menjadi
    // 'Content-Security-Policy' untuk mulai benar-benar menegakkannya.
    response.headers.set('Content-Security-Policy-Report-Only', buildCsp());

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.ico|images|public).*)']
};
