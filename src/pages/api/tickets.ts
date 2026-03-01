import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { getStore } from '../../lib/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { eventId, email, quantity } = req.body;
  if (typeof eventId !== 'number' || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const store = getStore();
  const event = store.events.find(e => e.id === eventId);
  if (!event || event.ticketTypes.length === 0) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const ticketType = event.ticketTypes[0];
  const sold = store.tickets.filter(t => t.ticketTypeId === ticketType.id).length;
  const available = ticketType.quantity - sold;
  if (quantity > available) {
    return res.status(400).json({ message: 'Not enough tickets available' });
  }

  for (let i = 0; i < quantity; i++) {
    store.tickets.push({
      id: store.nextTicketId++,
      ticketTypeId: ticketType.id,
      email,
      qrHash: randomUUID(),
    });
  }

  return res.status(200).json({ message: 'Tickets created' });
}
