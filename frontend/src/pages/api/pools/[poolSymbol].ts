import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs';
import path from 'path';
import { Pool } from '@/libs/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pool[]>
) {
  const jsonDirectory = path.join(process.cwd(), 'src/pages/api/pools/data/');
  const fileContents = await fs.readFile(jsonDirectory + 'pools.json', 'utf8');
  const data: Pool[] = JSON.parse(fileContents);

  const foundPool = data.filter(d => req.query.poolSymbol == d.symbol);
  res.status(200).json(foundPool);
}