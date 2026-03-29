import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip static files dan assets
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/public') ||
        pathname === '/favicon.ico'
    ) {
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
    // TAPI halaman '/' (home) juga redirect ke login tanpa cek token
    if (!token && !isPublicPage) {
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images|public).*)']
};
