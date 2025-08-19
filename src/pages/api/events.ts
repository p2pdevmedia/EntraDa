import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getSessionUser } from '../../lib/session';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'GET') {
    if (user.role !== Role.ADMIN && user.role !== Role.EVENT_MANAGER) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const where =
      user.role === Role.EVENT_MANAGER ? { managerId: user.id } : {};

    const events = await prisma.event.findMany({
      where,
      select: { id: true, name: true, mercadoPagoAccount: true }
    });

    return res.status(200).json(events);
  }

  if (req.method === 'PUT') {
    if (user.role !== Role.ADMIN && user.role !== Role.EVENT_MANAGER) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { id, name, mercadoPagoAccount } = req.body;
    if (typeof id !== 'number') {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (user.role !== Role.ADMIN && event.managerId !== user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { name, mercadoPagoAccount },
      select: { id: true, name: true, mercadoPagoAccount: true }
    });

    return res.status(200).json(updated);
  }

  if (req.method === 'POST') {
    if (user.role !== Role.EVENT_MANAGER && user.role !== Role.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, tickets, mercadoPagoAccount } = req.body;
    if (!name || !mercadoPagoAccount || !Array.isArray(tickets)) {
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
        mercadoPagoAccount,
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

  return res.status(405).end();
}
