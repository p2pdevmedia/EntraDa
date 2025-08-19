import type { NextApiRequest } from 'next';

interface AttemptInfo {
  count: number;
  firstAttempt: number;
  lockUntil: number;
  factor: number;
}

interface Options {
  windowMs: number;
  maxAttempts: number;
  baseLockMs: number;
}

class RateLimiter {
  private attempts = new Map<string, AttemptInfo>();
  private windowMs: number;
  private maxAttempts: number;
  private baseLockMs: number;

  constructor(options: Options) {
    this.windowMs = options.windowMs;
    this.maxAttempts = options.maxAttempts;
    this.baseLockMs = options.baseLockMs;
  }

  check(key: string) {
    const now = Date.now();
    const info = this.attempts.get(key);
    if (info && info.lockUntil > now) {
      return { allowed: false, retryAfter: info.lockUntil - now };
    }
    return { allowed: true, retryAfter: 0 };
  }

  fail(key: string) {
    const now = Date.now();
    let info = this.attempts.get(key);
    if (!info) {
      info = { count: 1, firstAttempt: now, lockUntil: 0, factor: 1 };
      this.attempts.set(key, info);
      return;
    }
    if (now - info.firstAttempt > this.windowMs) {
      info.count = 1;
      info.firstAttempt = now;
      info.factor = 1;
    } else {
      info.count += 1;
    }
    if (info.count >= this.maxAttempts) {
      info.lockUntil = now + this.baseLockMs * info.factor;
      info.factor *= 2;
      info.count = 0;
    }
  }

  succeed(key: string) {
    this.attempts.delete(key);
  }

  reset(key?: string) {
    if (key) this.attempts.delete(key);
    else this.attempts.clear();
  }
}

export function getClientId(req: NextApiRequest): string {
  const headers = (req as any).headers || {};
  const forwarded = (headers['x-forwarded-for'] as string) || '';
  const ip = forwarded.split(',')[0] || (req.socket as any)?.remoteAddress || (req as any).ip;
  return ip || 'global';
}

const defaultOptions: Options = { windowMs: 60_000, maxAttempts: 5, baseLockMs: 60_000 };

export const rateLimiters = {
  login: new RateLimiter(defaultOptions),
  signup: new RateLimiter(defaultOptions),
  recover: new RateLimiter(defaultOptions),
};

export type { RateLimiter };
