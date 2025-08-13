// interface RateLimitStore {
//   [key: string]: {
//     count: number;
//     resetTime: number;
//   };
// }

// interface RateLimitResult {
//   allowed: boolean;
//   remaining: number;
//   resetTime: number;
// }

// class RateLimiter {
//   private store: RateLimitStore = {};
//   private readonly windowMs: number;
//   private readonly maxRequests: number;

//   constructor(windowMs: number = 60000, maxRequests: number = 10) {
//     this.windowMs = windowMs;
//     this.maxRequests = maxRequests;
//   }

//   check(identifier: string): RateLimitResult {
//     const now = Date.now();
//     const userLimit = this.store[identifier];

//     // Clean up expired entries periodically
//     this.cleanup();

//     if (!userLimit || now > userLimit.resetTime) {
//       // First request or window expired
//       this.store[identifier] = {
//         count: 1,
//         resetTime: now + this.windowMs
//       };
//       return { 
//         allowed: true, 
//         remaining: this.maxRequests - 1, 
//         resetTime: now + this.windowMs 
//       };
//     }

//     if (userLimit.count >= this.maxRequests) {
//       // Rate limit exceeded
//       return { 
//         allowed: false, 
//         remaining: 0, 
//         resetTime: userLimit.resetTime 
//       };
//     }

//     // Increment count
//     userLimit.count++;
//     return { 
//       allowed: true, 
//       remaining: this.maxRequests - userLimit.count, 
//       resetTime: userLimit.resetTime 
//     };
//   }

//   reset(identifier: string): void {
//     delete this.store[identifier];
//   }

//   resetAll(): void {
//     this.store = {};
//   }

//   private cleanup(): void {
//     const now = Date.now();
//     const expiredKeys: string[] = [];

//     // Find expired entries
//     for (const [key, value] of Object.entries(this.store)) {
//       if (now > value.resetTime) {
//         expiredKeys.push(key);
//       }
//     }

//     // Remove expired entries
//     expiredKeys.forEach(key => delete this.store[key]);
//   }

//   getStatus(identifier: string): RateLimitResult | null {
//     const now = Date.now();
//     const userLimit = this.store[identifier];

//     if (!userLimit || now > userLimit.resetTime) {
//       return {
//         allowed: true,
//         remaining: this.maxRequests,
//         resetTime: now + this.windowMs
//       };
//     }

//     return {
//       allowed: userLimit.count < this.maxRequests,
//       remaining: Math.max(0, this.maxRequests - userLimit.count),
//       resetTime: userLimit.resetTime
//     };
//   }
// }

// // Create instances for different rate limit tiers
// export const apiRateLimiter = new RateLimiter(60000, 30); // 30 requests per minute for general API
// export const aiRateLimiter = new RateLimiter(60000, 10); // 10 AI requests per minute
// export const uploadRateLimiter = new RateLimiter(300000, 10); // 10 uploads per 5 minutes

// // Middleware helper for Next.js API routes
// export function withRateLimit(
//   limiter: RateLimiter,
//   getIdentifier: (req: Request) => string = (req) => {
//     // Default to IP-based rate limiting
//     return req.headers.get('x-forwarded-for') || 
//            req.headers.get('x-real-ip') || 
//            'anonymous';
//   }
// ) {
//   return async function rateLimitMiddleware(req: Request) {
//     const identifier = getIdentifier(req);
//     const { allowed, remaining, resetTime } = limiter.check(identifier);

//     if (!allowed) {
//       return new Response(
//         JSON.stringify({ 
//           error: 'Too many requests. Please try again later.',
//           retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
//         }),
//         {
//           status: 429,
//           headers: {
//             'Content-Type': 'application/json',
//             'X-RateLimit-Limit': limiter['maxRequests'].toString(),
//             'X-RateLimit-Remaining': '0',
//             'X-RateLimit-Reset': new Date(resetTime).toISOString(),
//             'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
//           }
//         }
//       );
//     }

//     // Return headers for successful requests
//     return {
//       headers: {
//         'X-RateLimit-Limit': limiter['maxRequests'].toString(),
//         'X-RateLimit-Remaining': remaining.toString(),
//         'X-RateLimit-Reset': new Date(resetTime).toISOString()
//       }
//     };
//   };
// }

// // Rate limit configurations for different scenarios
// export const RATE_LIMITS = {
//   api: {
//     windowMs: 60000, // 1 minute
//     maxRequests: 30
//   },
//   ai: {
//     windowMs: 60000, // 1 minute
//     maxRequests: 10
//   },
//   upload: {
//     windowMs: 300000, // 5 minutes
//     maxRequests: 10
//   },
//   export: {
//     windowMs: 60000, // 1 minute
//     maxRequests: 5
//   }
// } as const;