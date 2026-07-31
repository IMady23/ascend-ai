import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
let redis: Redis | null = null;
let aiRateLimit: Ratelimit | null = null;
let authRateLimit: Ratelimit | null = null;
let apiRateLimit: Ratelimit | null = null;

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  aiRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
  });

  authRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
  });

  apiRateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
  });
}

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/api/cron')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (path.startsWith('/api/') && redis) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    
    let limitResult;
    if (path.startsWith('/api/ai')) {
      limitResult = await aiRateLimit?.limit(ip);
    } else if (path.startsWith('/api/auth')) {
      limitResult = await authRateLimit?.limit(ip);
    } else {
      limitResult = await apiRateLimit?.limit(ip);
    }

    if (limitResult && !limitResult.success) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
