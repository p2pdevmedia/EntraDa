import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { eventId, email, quantity } = req.body;

    if (typeof eventId !== 'number' || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { ticketTypes: { include: { _count: { select: { tickets: true } } } } },
    });

    if (!event || event.ticketTypes.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticketType = event.ticketTypes[0];
    const available = ticketType.quantity - ticketType._count.tickets;
    if (quantity > available) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const data = Array.from({ length: quantity }).map(() => ({
      ticketTypeId: ticketType.id,
      email,
      qrHash: randomUUID(),
    }));

    await prisma.ticket.createMany({ data });
    return res.status(200).json({ message: 'Tickets created' });
  }

  return res.status(405).end();
}
