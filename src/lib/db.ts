import mysql from 'mysql2/promise';

type DbConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

const getDbConfig = (): DbConfig => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'governance_db'
});

const pool = mysql.createPool({
  ...getDbConfig(),
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;