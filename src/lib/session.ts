import { NextApiRequest } from 'next';
import { prisma } from './prisma';

export async function getSessionUser(req: NextApiRequest) {
  const session = req.cookies?.session;
  if (!session) return null;
  const id = parseInt(session, 10);
  if (isNaN(id)) return null;
  return prisma.user.findUnique({ where: { id } });
}
