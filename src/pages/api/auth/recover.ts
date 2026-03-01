import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../lib/auth';
import { sendPasswordResetEmail, type Locale } from '../../../lib/email';
import crypto from 'crypto';
import { rateLimiters, getClientId } from '../../../lib/rateLimit';
import { getStore } from '../../../lib/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = getClientId(req);
  const { allowed, retryAfter } = rateLimiters.recover.check(key);
  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil(retryAfter / 1000));
    return res.status(429).json({ message: 'Too many attempts. Try again later' });
  }

  const store = getStore();

  if (req.method === 'POST') {
    const { email } = req.body;
    if (!email) {
      rateLimiters.recover.fail(key);
      return res.status(400).json({ message: 'Email required' });
    }

    const lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const locale: Locale = lang === 'es' ? 'es' : 'en';

    const user = store.users.find(u => u.email === email);
    if (!user) {
      rateLimiters.recover.fail(key);
      return res.status(200).json({ message: 'If account exists, email sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExp = new Date(Date.now() + 3600 * 1000);

    rateLimiters.recover.succeed(key);
    await sendPasswordResetEmail(email, token, locale);

    return res.status(200).json({ message: 'Reset token generated', token });
  }

  if (req.method === 'PUT') {
    const { token, password } = req.body;
    if (!token || !password) {
      rateLimiters.recover.fail(key);
      return res.status(400).json({ message: 'Token and password required' });
    }

    const user = store.users.find(
      u => u.resetToken === token && !!u.resetTokenExp && u.resetTokenExp.getTime() > Date.now(),
    );

    if (!user) {
      rateLimiters.recover.fail(key);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.passwordHash = await hashPassword(password);
    user.resetToken = null;
    user.resetTokenExp = null;

    rateLimiters.recover.succeed(key);
    return res.status(200).json({ message: 'Password updated' });
  }

  return res.status(405).end();
}
