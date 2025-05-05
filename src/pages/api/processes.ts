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
      return res.status(200).json(processes);

    case 'POST':
      if (!req.body.title) {
        return res.status(400).json({ error: 'Título é obrigatório' });
      }
      const newProcess: Process = {
        id: Date.now().toString(),
        title: req.body.title,
        status: 'pending',
      };
      processes.push(newProcess);
      return res.status(201).json(newProcess);

    case 'PUT':
      const { id, title, status } = req.body;
      if (!id || !title || !status) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }
      const index = processes.findIndex(p => p.id === id);
      if (index >= 0) {
        processes[index] = { ...processes[index], title, status };
        return res.status(200).json(processes[index]);
      }
      return res.status(404).json({ error: 'Processo não encontrado' });

    case 'DELETE':
      const { id: deleteId } = req.query;
      if (!deleteId || typeof deleteId !== 'string') {
        return res.status(400).json({ error: 'ID inválido' });
      }
      processes = processes.filter(p => p.id !== deleteId);
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}