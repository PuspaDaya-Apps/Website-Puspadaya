import { NextRequest, NextResponse } from 'next/server';

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
    
    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.ico|images|public).*)']
};
