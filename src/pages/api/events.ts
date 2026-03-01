import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser } from '../../lib/session';
import { getStore } from '../../lib/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const store = getStore();

  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const eventId = Number(id);
      if (Number.isNaN(eventId)) return res.status(400).json({ message: 'Invalid id' });
      const event = store.events.find(e => e.id === eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      return res.status(200).json(event);
    }

    const events = store.events.map(event => {
      const ticketTypeIds = event.ticketTypes.map(tt => tt.id);
      const sold = store.tickets.filter(ticket => ticketTypeIds.includes(ticket.ticketTypeId)).length;
      return { ...event, ticketsSold: sold };
    });
    return res.status(200).json(events);
  }

  const user = await getSessionUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'POST') {
    if (user.role !== 'EVENT_MANAGER' && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, date, tickets, mercadoPagoAccount, posterUrl, sliderUrl, miniUrl } = req.body;
    if (!name || !date || !mercadoPagoAccount || !Array.isArray(tickets)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const ticketTypes = tickets.map((t: any) => ({
      id: store.nextTicketTypeId++,
      name: t.name,
      price: Number(t.price),
      quantity: Number(t.quantity),
      saleStart: new Date(t.saleStart),
      saleEnd: new Date(date),
    }));

    const event = {
      id: store.nextEventId++,
      name,
      date: new Date(date),
      mercadoPagoAccount,
      posterUrl,
      sliderUrl,
      miniUrl,
      managerId: user.id,
      ticketTypes,
    };

    store.events.push(event);
    return res.status(201).json(event);
  }

  if (req.method === 'PUT') {
    const { id, name, date, tickets, mercadoPagoAccount, posterUrl, sliderUrl, miniUrl } = req.body;
    if (typeof id !== 'number' || !name || !date || !Array.isArray(tickets)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const event = store.events.find(e => e.id === id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (user.role !== 'ADMIN' && event.managerId !== user.id) return res.status(403).json({ message: 'Forbidden' });

    event.name = name;
    event.date = new Date(date);
    event.mercadoPagoAccount = mercadoPagoAccount;
    event.posterUrl = posterUrl;
    event.sliderUrl = sliderUrl;
    event.miniUrl = miniUrl;
    event.ticketTypes = tickets.map((t: any) => ({
      id: store.nextTicketTypeId++,
      name: t.name,
      price: Number(t.price),
      quantity: Number(t.quantity),
      saleStart: new Date(t.saleStart),
      saleEnd: new Date(date),
    }));

    return res.status(200).json(event);
  }

  if (req.method === 'DELETE') {
    if (user.role !== 'ADMIN' && user.role !== 'EVENT_MANAGER') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.query;
    const eventId = Number(id);
    if (!id || Array.isArray(id) || Number.isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const idx = store.events.findIndex(e => e.id === eventId);
    if (idx < 0) return res.status(404).json({ message: 'Event not found' });
    const event = store.events[idx];
    if (user.role !== 'ADMIN' && event.managerId !== user.id) return res.status(403).json({ message: 'Forbidden' });
    store.events.splice(idx, 1);
    return res.status(204).end();
  }

  return res.status(405).end();
}
