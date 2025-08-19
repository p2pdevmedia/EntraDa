import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getSessionUser } from '../../lib/session';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const user = await getSessionUser(req);
  if (!user || user.role !== Role.ADMIN) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  });

  return res.status(200).json(users);
}
