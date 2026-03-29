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
    const isPublicPage = pathname.startsWith('/auth/signin');

    // Redirect ke login jika tidak ada token dan bukan halaman publik
    if (!token && !isPublicPage) {
        return NextResponse.redirect(loginUrl);
    }

    // Redirect ke home jika sudah login tapi akses halaman login
    if (token && isPublicPage) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images|public).*)']
};
