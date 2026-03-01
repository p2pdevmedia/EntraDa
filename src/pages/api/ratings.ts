import type { NextApiRequest, NextApiResponse } from 'next';
import { getStore } from '../../lib/store';
import { getSessionUser } from '../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { eventId, value } = req.body;
  if (typeof eventId !== 'number' || typeof value !== 'number') {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const store = getStore();
  const event = store.events.find(e => e.id === eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const rating = {
    id: store.nextRatingId++,
    value,
    raterId: user.id,
    eventId,
  };
  store.ratings.push(rating);

  const managerRatings = store.ratings.filter(r => {
    const ratedEvent = store.events.find(e => e.id === r.eventId);
    return ratedEvent?.managerId === event.managerId;
  });

  const average = managerRatings.reduce((sum, r) => sum + r.value, 0) / managerRatings.length;
  const manager = store.users.find(u => u.id === event.managerId);
  if (manager) manager.averageRating = Number.isFinite(average) ? average : 0;

  return res.status(201).json(rating);
}
