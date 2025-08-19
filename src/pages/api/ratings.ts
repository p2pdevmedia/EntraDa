import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getSessionUser } from '../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const user = await getSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { eventId, value } = req.body;
  if (typeof eventId !== 'number' || typeof value !== 'number') {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const rating = await prisma.rating.create({
    data: {
      value,
      raterId: user.id,
      eventId
    }
  });

  const avg = await prisma.rating.aggregate({
    where: { event: { managerId: event.managerId } },
    _avg: { value: true }
  });

  await prisma.user.update({
    where: { id: event.managerId },
    data: { averageRating: avg._avg.value ?? 0 }
  });

  return res.status(201).json(rating);
}
