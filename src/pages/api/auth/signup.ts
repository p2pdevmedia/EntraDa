import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { hashPassword } from '../../../lib/auth';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'User already exists' });

  const passwordHash = await hashPassword(password);

  const userRole = Object.values(Role).includes(role) ? role : Role.CLIENT;
  const user = await prisma.user.create({ data: { email, passwordHash, role: userRole } });

  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
}
