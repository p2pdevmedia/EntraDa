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

  const { name, tickets } = req.body;
  if (!name || !Array.isArray(tickets)) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  for (const t of tickets) {
    if (
      typeof t.ticketTypeId !== 'number' ||
      typeof t.quantity !== 'number' ||
      !t.saleStart ||
      !t.saleEnd
    ) {
      return res.status(400).json({ message: 'Invalid ticket specification' });
    }
  }

  const event = await prisma.event.create({
    data: {
      name,
      managerId: user.id,
      tickets: {
        create: tickets.map((t: any) => ({
          ticketTypeId: t.ticketTypeId,
          quantity: t.quantity,
          saleStart: new Date(t.saleStart),
          saleEnd: new Date(t.saleEnd)
        }))
      }
    },
    include: { tickets: true }
  });

  return res.status(201).json(event);
}
