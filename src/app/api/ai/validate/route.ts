import { NextRequest, NextResponse } from 'next/server';
import { runAIValidation } from '@/lib/validators/ai-validators';
// import { aiRateLimiter } from '@/lib/utils/rate-limiter';

export async function POST(request: NextRequest) {
  // const clientIp = request.headers.get('x-forwarded-for') || 'anonymous';
  // const { allowed, remaining } = aiRateLimiter.check(clientIp);
  
  // if (!allowed) {
  //   return NextResponse.json(
  //     { error: 'AI rate limit exceeded' },
  //     { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
  //   );
  // }

  try {
    const data = await request.json();
    
    const validationResults = await runAIValidation(data);
    
    return NextResponse.json(
      { results: validationResults },
      // { headers: { 'X-RateLimit-Remaining': remaining.toString() } }
    );
  } catch (error) {
    console.error('AI validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate with AI' },
      { status: 500 }
    );
  }
}
