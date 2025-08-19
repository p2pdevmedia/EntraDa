import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getSessionUser } from '../../lib/session';
import { Role } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSessionUser(req);

  if (req.method === 'GET') {
    if (!user || (user.role !== Role.EVENT_MANAGER && user.role !== Role.ADMIN)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { id } = req.query;
    const where = id && typeof id === 'string' ? { id: Number(id) } : {};
    const ticketTypes = await prisma.ticketType.findMany({
      where,
      select: { id: true, name: true, price: true }
    });

    if (id) {
      return res.status(200).json(ticketTypes[0] || null);
    }

    return res.status(200).json(ticketTypes);
  }

  if (!user || (user.role !== Role.EVENT_MANAGER && user.role !== Role.ADMIN)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'POST') {
    const { name, price } = req.body;
    if (!name || typeof price !== 'number') {
      return res.status(400).json({ message: 'Name and price required' });
    }

    const ticketType = await prisma.ticketType.create({
      data: { name, price, creatorId: user.id }
    });

    return res.status(201).json(ticketType);
  }

  if (req.method === 'PUT') {
    const { id, name, price } = req.body;
    if (typeof id !== 'number' || !name || typeof price !== 'number') {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const updated = await prisma.ticketType.update({
      where: { id },
      data: { name, price },
      select: { id: true, name: true, price: true }
    });

    return res.status(200).json(updated);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const ttId = Number(id);
    if (!id || Array.isArray(id) || isNaN(ttId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    await prisma.ticketType.delete({ where: { id: ttId } });
    return res.status(204).end();
  }

  return res.status(405).end();
}
