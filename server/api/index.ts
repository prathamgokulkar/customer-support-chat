import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server';

export default async function (req: VercelRequest, res: VercelResponse) {
  // @ts-ignore
  return app(req, res);
}
