import { NextApiRequest } from 'next';
import { getStore } from './store';

export async function getSessionUser(req: NextApiRequest) {
  const session = req.cookies?.session;
  if (!session) return null;
  const id = parseInt(session, 10);
  if (Number.isNaN(id)) return null;
  return getStore().users.find(user => user.id === id) ?? null;
}
