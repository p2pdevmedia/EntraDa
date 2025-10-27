import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { verifyPassword } from '../../../lib/auth';
import { rateLimiters, getClientId } from '../../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const key = getClientId(req);
  const { allowed, retryAfter } = rateLimiters.login.check(key);
  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil(retryAfter / 1000));
    return res.status(429).json({ message: 'Too many attempts. Try again later' });
  }

  const { email, password, walletAddress } = req.body;

  if (walletAddress) {
    const normalizedAddress = String(walletAddress).toLowerCase();
    const user = await prisma.user.findUnique({ where: { walletAddress: normalizedAddress } });
    if (!user) {
      rateLimiters.login.fail(key);
      return res.status(401).json({ message: 'Wallet not found' });
    }

    rateLimiters.login.succeed(key);
    res.setHeader('Set-Cookie', `session=${user.id}; HttpOnly; Path=/; Max-Age=3600`);
    return res.status(200).json({ id: user.id, email: user.email, role: user.role });
  }

  if (!email || !password) {
    rateLimiters.login.fail(key);
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    rateLimiters.login.fail(key);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    rateLimiters.login.fail(key);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  rateLimiters.login.succeed(key);
  res.setHeader('Set-Cookie', `session=${user.id}; HttpOnly; Path=/; Max-Age=3600`);
  return res.status(200).json({ id: user.id, email: user.email, role: user.role });
}
