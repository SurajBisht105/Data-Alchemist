import { NextRequest, NextResponse } from 'next/server';
import { convertNaturalLanguageToRule } from '@/lib/ai/rule-converter';
import { generateAIRules } from '@/lib/ai/rule-recommendations';
import { aiRateLimiter } from '@/lib/utils/rate-limiter';

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || 'anonymous';
  const { allowed, remaining } = aiRateLimiter.check(clientIp);
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'AI rate limit exceeded' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }

  try {
    const { action, input, data } = await request.json();
    
    if (action === 'convert') {
      const rule = await convertNaturalLanguageToRule(input);
      return NextResponse.json(
        { rule },
        { headers: { 'X-RateLimit-Remaining': remaining.toString() } }
      );
    } else if (action === 'recommend') {
      const rules = await generateAIRules(data);
      return NextResponse.json(
        { rules },
        { headers: { 'X-RateLimit-Remaining': remaining.toString() } }
      );
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('AI rules error:', error);
    return NextResponse.json(
      { error: 'Failed to process rules with AI' },
      { status: 500 }
    );
  }
}