import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const publicPaths = ['/login', '/api/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublic = publicPaths.some((path) => pathname.startsWith(path));

    if (isPublic) {
        // If already logged in, redirect to dashboard
        if (pathname === '/login') {
            const token = request.cookies.get('auth-token')?.value;
            if (token && (await verifyToken(token))) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
        return NextResponse.next();
    }

    // Protect all other routes (dashboard, settings, transactions, reports, etc.)
    const token = request.cookies.get('auth-token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token || !(await verifyToken(token))) {
        // If it's an API request, return 401
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Always redirect to login for any other protected route
        const loginUrl = new URL('/login', request.url);
        // Optionally add a redirect parameter to return after login
        // loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - robots.txt, sitemap.xml, manifest.json (SEO files)
         * - all files in public (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)',
    ],
};
