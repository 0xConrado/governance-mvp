import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { Citizen } from '@/types/citizen';
import { validateCPF } from '@/utils/cpfValidator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await pool.getConnection();
  
  try {
    switch (req.method) {
      case 'GET':
        // Implementação com busca
        const { search, id } = req.query;

        if (id) {
          // GET único para edição
          const [citizen] = await connection.query(
            'SELECT * FROM citizens WHERE id = ?', 
            [id]
          );
          
          if (!citizen[0]) {
            return res.status(404).json({ error: 'Cidadão não encontrado' });
          }
          
          return res.status(200).json(citizen[0]);
        } else {
          // Listagem com busca
          let query = 'SELECT id, full_name, cpf, email, phone FROM citizens';
          const params = [];

          if (search) {
            query += ' WHERE full_name LIKE ? OR cpf LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
          }

          query += ' ORDER BY created_at DESC';
          const [citizens] = await connection.query(query, params);
          return res.status(200).json(citizens);
        }

      case 'POST':
        // Validação de criação
        const { full_name, cpf, email, phone, address, city, state, birth_date } = req.body;

        if (!full_name || !cpf || !email) {
          return res.status(400).json({ error: 'Nome completo, CPF e email são obrigatórios' });
        }

        if (!validateCPF(cpf)) {
          return res.status(400).json({ error: 'CPF inválido' });
        }

        const [result] = await connection.query(
          `INSERT INTO citizens 
          (full_name, cpf, email, phone, address, city, state, birth_date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [full_name.trim(), cpf, email.trim(), phone, address, city, state, birth_date]
        );

        const [newCitizen] = await connection.query(
          'SELECT * FROM citizens WHERE id = ?',
          [(result as any).insertId]
        );

        return res.status(201).json(newCitizen[0]);

      case 'PUT':
        // Atualização de registro
        const { id: updateId, ...updateData } = req.body;

        if (!updateId) {
          return res.status(400).json({ error: 'ID do cidadão é obrigatório' });
        }

        await connection.query(
          `UPDATE citizens SET
          full_name = ?, cpf = ?, email = ?, phone = ?,
          address = ?, city = ?, state = ?, birth_date = ?
          WHERE id = ?`,
          [
            updateData.full_name.trim(),
            updateData.cpf,
            updateData.email.trim(),
            updateData.phone,
            updateData.address,
            updateData.city,
            updateData.state,
            updateData.birth_date,
            updateId
          ]
        );

        const [updatedCitizen] = await connection.query(
          'SELECT * FROM citizens WHERE id = ?',
          [updateId]
        );

        return res.status(200).json(updatedCitizen[0]);

      case 'DELETE':
        // Exclusão de registro
        const { id: deleteId } = req.query;

        if (!deleteId) {
          return res.status(400).json({ error: 'ID do cidadão é obrigatório' });
        }

        await connection.query(
          'DELETE FROM citizens WHERE id = ?',
          [deleteId]
        );

        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    // Tratamento de erros refinado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        error: 'Dados duplicados',
        field: error.message.includes('cpf') ? 'CPF' : 'Email'
      });
    }

    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Erro interno no servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    connection.release();
  }
}