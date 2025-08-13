import { NextRequest, NextResponse } from 'next/server';
import { parseWithAI } from '@/lib/ai/ai-parser';
// import { apiRateLimiter } from '@/lib/utils/rate-limiter';

export async function POST(request: NextRequest) {
  // Rate limiting
  // const clientIp = request.headers.get('x-forwarded-for') || 'anonymous';
  // const { allowed, remaining } = apiRateLimiter.check(clientIp);
  
  // if (!allowed) {
  //   return NextResponse.json(
  //     { error: 'Rate limit exceeded' },
  //     { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
  //   );
  // }

  try {
    const { data, entityType } = await request.json();
    
    if (!data || !entityType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const parsedData = await parseWithAI(data, entityType);
    
    return NextResponse.json(
      { data: parsedData },
      // { headers: { 'X-RateLimit-Remaining': remaining.toString() } }
    );
  } catch (error) {
    console.error('AI parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse data with AI' },
      { status: 500 }
    );
  }
}
