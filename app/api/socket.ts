import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from the API route' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
