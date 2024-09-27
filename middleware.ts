// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('isLogin');

    if (token) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/auth/login', request.url));
}

// Config to match the paths for the middleware
export const config = {
  matcher: '/profile',
};
