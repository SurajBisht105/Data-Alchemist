import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for API key in production
  if (process.env.NODE_ENV === 'production') {
    const apiKey = request.headers.get('x-api-key');
    
    // Skip API key check for public routes
    const publicPaths = ['/api/health', '/api/export'];
    const isPublicPath = publicPaths.some(path => 
      request.nextUrl.pathname.startsWith(path)
    );
    
    if (!isPublicPath && request.nextUrl.pathname.startsWith('/api/')) {
      if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
  }

  // Add CORS headers
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

export const config = {
  matcher: '/api/:path*',
};