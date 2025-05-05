import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db'; // Alterado para importar o pool MySQL

type Process = {
  id?: number; // Mudamos para number (MySQL usa auto_increment)
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: Date; // Padrão MySQL para nomeação
  updated_at?: Date;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await pool.getConnection();
  
  try {
    switch (req.method) {
      case 'GET':
        const [rows] = await connection.query(
          'SELECT * FROM processes ORDER BY created_at DESC'
        );
        return res.status(200).json(rows);

      case 'POST':
        const { title } = req.body;
        
        if (!title?.trim()) {
          return res.status(400).json({ error: 'Título é obrigatório' });
        }

        const [result] = await connection.query(
          'INSERT INTO processes (title, status) VALUES (?, ?)',
          [title.trim(), 'pending']
        );

        // Recupera o registro recém-criado
        const [newProcess] = await connection.query(
          'SELECT * FROM processes WHERE id = ?',
          [(result as any).insertId]
        );

        return res.status(201).json(newProcess[0]);

      case 'PUT':
        const { id, title: updateTitle, status } = req.body;
        
        if (!id || !updateTitle?.trim() || !status) {
          return res.status(400).json({ error: 'Dados incompletos' });
        }

        await connection.query(
          'UPDATE processes SET title = ?, status = ?, updated_at = NOW() WHERE id = ?',
          [updateTitle.trim(), status, id]
        );

        // Retorna o processo atualizado
        const [updatedProcess] = await connection.query(
          'SELECT * FROM processes WHERE id = ?',
          [id]
        );

        return res.status(200).json(updatedProcess[0]);

      case 'DELETE':
        const { id: deleteId } = req.query;
        
        await connection.query(
          'DELETE FROM processes WHERE id = ?',
          [deleteId]
        );

        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release(); // Libera a conexão de volta para o pool
  }
}