import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs';
import path from 'path';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  const jsonDirectory = path.join(process.cwd(), 'src/pages/api/data/');
  const fileContents = await fs.readFile(jsonDirectory + 'pools.json', 'utf8');
  res.status(200).json(JSON.parse(fileContents));
}
