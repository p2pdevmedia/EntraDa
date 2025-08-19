import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getSessionUser } from '../../lib/session';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const user = await getSessionUser(req);
  if (!user || (user.role !== Role.EVENT_MANAGER && user.role !== Role.ADMIN)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { name, price } = req.body;
  if (!name || typeof price !== 'number') {
    return res.status(400).json({ message: 'Name and price required' });
  }

  const ticketType = await prisma.ticketType.create({
    data: { name, price, creatorId: user.id }
  });

  return res.status(201).json(ticketType);
}
