import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { hashPassword } from '../../../lib/auth';
import { Role } from '@prisma/client';
import { rateLimiters, getClientId } from '../../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const key = getClientId(req);
  const { allowed, retryAfter } = rateLimiters.signup.check(key);
  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil(retryAfter / 1000));
    return res.status(429).json({ message: 'Too many attempts. Try again later' });
  }

  const { email, password, role } = req.body;
  if (!email || !password) {
    rateLimiters.signup.fail(key);
    return res.status(400).json({ message: 'Email and password required' });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    rateLimiters.signup.fail(key);
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await hashPassword(password);

  const userRole = Object.values(Role).includes(role) ? role : Role.CLIENT;
  const user = await prisma.user.create({ data: { email, passwordHash, role: userRole } });

  rateLimiters.signup.succeed(key);
  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
}
