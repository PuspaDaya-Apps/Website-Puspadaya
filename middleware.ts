import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const url = req.nextUrl.clone();
    if (url.pathname === '/') {
        url.pathname = '/auth/signin';
        return NextResponse.redirect(url);
    }

    const token = req.cookies.get('token');
    const loginUrl = new URL('/auth/signin', req.url);
    const homeUrl = new URL('/', req.url);

    // Redirect jika tidak ada token dan bukan ke halaman login
    if (!token && !loginUrl.pathname.includes('/auth/signin')) {
        return NextResponse.redirect(loginUrl);
    }

    // Redirect jika sudah login dan mencoba mengakses halaman login
    if (token && loginUrl.pathname.includes('/auth/signin')) {
        return NextResponse.redirect(homeUrl);
    }

    // CORS headers
    const res = NextResponse.next();
    res.headers.append('Access-Control-Allow-Credentials', 'true');
    res.headers.append('Access-Control-Allow-Origin', '*');
    res.headers.append('Access-Control-Allow-Methods', 'GET, DELETE, PATCH, POST, PUT');
    res.headers.append('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-version');

    return res;
}

export const config = {
    matcher: ['/api/:path*']
};
