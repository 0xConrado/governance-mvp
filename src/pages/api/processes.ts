import type { NextApiRequest, NextApiResponse } from 'next';

type Process = {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
};

let processes: Process[] = []; // "Banco de dados" temporário

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      res.status(200).json(processes);
      break;
    case 'POST':
      const newProcess: Process = {
        id: Date.now().toString(),
        title: req.body.title,
        status: 'pending',
      };
      processes.push(newProcess);
      res.status(201).json(newProcess);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}