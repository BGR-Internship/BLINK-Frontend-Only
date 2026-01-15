import pool from './db';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    if (request.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT * FROM services ORDER BY sort_order ASC');
            return response.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Failed to fetch services' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
}
