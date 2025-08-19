import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getSessionUser } from '../../lib/session';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSessionUser(req);
  if (!user || user.role !== Role.ADMIN) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });

    return res.status(200).json(users);
  }

  if (req.method === 'PUT') {
    const { id, role } = req.body;
    if (typeof id !== 'number' || !role) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    if (!(role in Role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true }
    });

    return res.status(200).json(updated);
  }

  return res.status(405).end();
}
