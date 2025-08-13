import { NextRequest, NextResponse } from 'next/server';
import { generateAIRules } from '@/lib/ai/rule-recommendations';
// import { aiRateLimiter } from '@/lib/utils/rate-limiter';

export async function POST(request: NextRequest) {
  // Rate limiting
  // const clientIp = request.headers.get('x-forwarded-for') || 
  //                 request.headers.get('x-real-ip') || 
  //                 'anonymous';
  // const { allowed, remaining, resetTime } = aiRateLimiter.check(clientIp);
  
  // if (!allowed) {
  //   return NextResponse.json(
  //     { 
  //       error: 'AI rate limit exceeded. Please try again later.',
  //       retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
  //     },
  //     { 
  //       status: 429,
  //       headers: {
  //         'X-RateLimit-Limit': '10',
  //         'X-RateLimit-Remaining': '0',
  //         'X-RateLimit-Reset': new Date(resetTime).toISOString(),
  //         'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
  //       }
  //     }
  //   );
  // }

  try {
    const { data } = await request.json();
    
    if (!data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    // Validate data structure
    if (!data.clients && !data.workers && !data.tasks) {
      return NextResponse.json(
        { error: 'Invalid data structure' },
        { status: 400 }
      );
    }

    // Generate AI rule suggestions
    const suggestions = await generateAIRules(data);
    
    return NextResponse.json(
      { 
        suggestions,
        count: suggestions.length 
      },
      // {
      //   headers: {
      //     'X-RateLimit-Limit': '10',
      //     'X-RateLimit-Remaining': remaining.toString(),
      //     'X-RateLimit-Reset': new Date(resetTime).toISOString()
      //   }
      // }
    );
  } catch (error) {
    console.error('AI suggestions error:', error);
    
    // Check if it's a Gemini API error
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid or missing Gemini API key' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Gemini API quota exceeded' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    );
  }
}

// Also support GET for checking status
export async function GET(request: NextRequest) {
  // const clientIp = request.headers.get('x-forwarded-for') || 
  //                 request.headers.get('x-real-ip') || 
  //                 'anonymous';
  // const status = aiRateLimiter.getStatus(clientIp);
  
  return NextResponse.json({
    service: 'AI Suggestions',
    status: 'operational',
    // rateLimit: status
  });
}


