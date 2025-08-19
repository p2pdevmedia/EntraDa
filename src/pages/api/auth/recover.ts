import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { hashPassword } from '../../../lib/auth';
import { sendPasswordResetEmail, type Locale } from '../../../lib/email';
import crypto from 'crypto';
import { rateLimiters, getClientId } from '../../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = getClientId(req);
  const { allowed, retryAfter } = rateLimiters.recover.check(key);
  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil(retryAfter / 1000));
    return res.status(429).json({ message: 'Too many attempts. Try again later' });
  }

  if (req.method === 'POST') {
    const { email } = req.body;
    if (!email) {
      rateLimiters.recover.fail(key);
      return res.status(400).json({ message: 'Email required' });
    }


    const locale: Locale = lang === 'es' ? 'es' : 'en';

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      rateLimiters.recover.fail(key);
      return res.status(200).json({ message: 'If account exists, email sent' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetTokenExp = new Date(Date.now() + 3600 * 1000);
    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExp }
    });

    rateLimiters.recover.succeed(key);
    await sendPasswordResetEmail(email, token, locale);

    return res.status(200).json({ message: 'Reset token generated', token });
  } else if (req.method === 'PUT') {
    const { token, password } = req.body;
    if (!token || !password) {
      rateLimiters.recover.fail(key);
      return res.status(400).json({ message: 'Token and password required' });
    }

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExp: { gt: new Date() } }
    });
    if (!user) {
      rateLimiters.recover.fail(key);
      return res.status(400).json({ message: 'Invalid token' });
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExp: null }
    });
    rateLimiters.recover.succeed(key);
    return res.status(200).json({ message: 'Password updated' });
  } else {
    return res.status(405).end();
  }
}
