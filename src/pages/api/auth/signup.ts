import type { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../../lib/auth';
import { rateLimiters, getClientId } from '../../../lib/rateLimit';
import { getStore, type Role } from '../../../lib/store';

const roles: Role[] = ['CLIENT', 'EVENT_MANAGER', 'EVENT_RRPP', 'ADMIN'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const key = getClientId(req);
  const { allowed, retryAfter } = rateLimiters.signup.check(key);
  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil(retryAfter / 1000));
    return res.status(429).json({ message: 'Too many attempts. Try again later' });
  }

  const { email, password, role, walletAddress } = req.body;
  if (!email || !password) {
    rateLimiters.signup.fail(key);
    return res.status(400).json({ message: 'Email and password required' });
  }

  const store = getStore();
  if (store.users.some(user => user.email === email)) {
    rateLimiters.signup.fail(key);
    return res.status(409).json({ message: 'User already exists' });
  }

  const normalizedWallet = walletAddress ? String(walletAddress).toLowerCase() : null;
  if (normalizedWallet && store.users.some(user => user.walletAddress === normalizedWallet)) {
    rateLimiters.signup.fail(key);
    return res.status(409).json({ message: 'Wallet already registered' });
  }

  const passwordHash = await hashPassword(password);
  const userRole = roles.includes(role) ? role : 'CLIENT';

  const user = {
    id: store.nextUserId++,
    email,
    passwordHash,
    role: userRole,
    walletAddress: normalizedWallet,
    resetToken: null,
    resetTokenExp: null,
    averageRating: 0,
  };

  store.users.push(user);
  rateLimiters.signup.succeed(key);
  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
}
