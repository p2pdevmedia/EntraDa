import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser } from '../../lib/session';
import { getStore, type Role } from '../../lib/store';

const roles: Role[] = ['CLIENT', 'EVENT_MANAGER', 'EVENT_RRPP', 'ADMIN'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSessionUser(req);
  if (!user || user.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const store = getStore();

  if (req.method === 'GET') {
    return res.status(200).json(store.users.map(u => ({ id: u.id, email: u.email, role: u.role })));
  }

  if (req.method === 'PUT') {
    const { id, role } = req.body;
    if (typeof id !== 'number' || !roles.includes(role)) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const target = store.users.find(u => u.id === id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    target.role = role;
    return res.status(200).json({ id: target.id, email: target.email, role: target.role });
  }

  return res.status(405).end();
}
