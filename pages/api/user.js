// This file contains intentional security vulnerabilities for testing purposes
// DO NOT use this code in production

import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await client.connect();

  // VULNERABILITY: SQL Injection - user input directly concatenated into query
  const userId = req.query.id;
  // const query = `SELECT * FROM users WHERE id = ${userId}`;
  // FIXED: Parameterized query to prevent SQL Injection
  const query = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [userId],
  };
  
  try {
    const result = await client.query(query);
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    await client.end();
  }
}
