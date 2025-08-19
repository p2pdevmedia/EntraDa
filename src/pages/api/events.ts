import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getSessionUser } from '../../lib/session';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSessionUser(req);

  if (req.method === 'GET') {
    const { id } = req.query;
    const baseWhere =
      user && user.role === Role.EVENT_MANAGER ? { managerId: user.id } : {};
    const where =
      id && typeof id === 'string' ? { ...baseWhere, id: Number(id) } : baseWhere;

    if (user && user.role !== Role.ADMIN && user.role !== Role.EVENT_MANAGER) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const select = user
      ? {
          id: true,
          name: true,
          date: true,
          mercadoPagoAccount: true,
          posterUrl: true,
          sliderUrl: true,
          miniUrl: true,
        }
      : { id: true, name: true, posterUrl: true, sliderUrl: true };

    const events = await prisma.event.findMany({ where, select });

    if (id) {
      return res.status(200).json(events[0] || null);
    }

    return res.status(200).json(events);
  }

  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.method === 'PUT') {
    if (user.role !== Role.ADMIN && user.role !== Role.EVENT_MANAGER) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { id, name, date, mercadoPagoAccount, posterUrl, sliderUrl, miniUrl } = req.body;
    if (typeof id !== 'number' || !date) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (user.role !== Role.ADMIN && event.managerId !== user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { name, date: new Date(date), mercadoPagoAccount, posterUrl, sliderUrl, miniUrl },
      select: {
        id: true,
        name: true,
        date: true,
        mercadoPagoAccount: true,
        posterUrl: true,
        sliderUrl: true,
        miniUrl: true,
      },
    });

    return res.status(200).json(updated);
  }

  if (req.method === 'POST') {
    if (user.role !== Role.EVENT_MANAGER && user.role !== Role.ADMIN) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { name, date, tickets, mercadoPagoAccount, posterUrl, sliderUrl, miniUrl } = req.body;
    if (!name || !date || !mercadoPagoAccount || !Array.isArray(tickets)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    for (const t of tickets) {
      if (
        !t.name ||
        typeof t.price !== 'number' ||
        typeof t.quantity !== 'number' ||
        !t.saleStart
      ) {
        return res.status(400).json({ message: 'Invalid ticket specification' });
      }
    }

    const event = await prisma.event.create({
      data: {
        name,
        date: new Date(date),
        managerId: user.id,
        mercadoPagoAccount,
        posterUrl,
        sliderUrl,
        miniUrl,
        ticketTypes: {
          create: tickets.map((t: any) => ({
            name: t.name,
            price: t.price,
            quantity: t.quantity,
            saleStart: new Date(t.saleStart),
            saleEnd: new Date(date),
          })),
        },
      },
      include: { ticketTypes: true },
    });

    return res.status(201).json(event);
  }

  if (req.method === 'DELETE') {
    if (user.role !== Role.ADMIN && user.role !== Role.EVENT_MANAGER) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.query;
    const eventId = Number(id);
    if (!id || Array.isArray(id) || isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (user.role !== Role.ADMIN && event.managerId !== user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.event.delete({ where: { id: eventId } });
    return res.status(204).end();
  }

  return res.status(405).end();
}
