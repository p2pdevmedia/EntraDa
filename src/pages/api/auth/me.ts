import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser } from '../../../lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSessionUser(req as any);
  if (!user) {
    return res.status(200).json({ user: null });
  }
  return res.status(200).json({
    user: { id: user.id, email: user.email, role: user.role }
  });
}
